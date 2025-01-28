import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	MessageCircle,
	ChevronDown,
	ChevronUp,
	MoreVertical,
	Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { CommentDTO, PostDTO, SocialError } from "@/types";
import { socialService } from "@/services/socialService";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CommentSectionProps {
	post: PostDTO;
	onCommentAdded: (updatedPost: PostDTO) => void;
	className?: string;
	currentUserId?: number;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
	post,
	onCommentAdded,
	className,
	currentUserId,
}) => {
	const [newComment, setNewComment] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showComments, setShowComments] = useState(false);
	const [isLoadingComments, setIsLoadingComments] = useState(false);
	const [comments, setComments] = useState<CommentDTO[]>([]);
	const { toast } = useToast();

	const loadComments = async () => {
		if (!showComments) {
			setIsLoadingComments(true);
			try {
				const loadedComments = await socialService.getAllCommentsForPost(
					post.id
				);
				setComments(loadedComments);
			} catch (error) {
				console.error("Error loading comments:", error);
				toast({
					title: "Error",
					description: "Failed to load comments",
					variant: "destructive",
				});
			} finally {
				setIsLoadingComments(false);
			}
		}
		setShowComments(!showComments);
	};

	const handleAddComment = async () => {
		if (!newComment.trim() || isSubmitting) return;

		setIsSubmitting(true);
		try {
			const comment = await socialService.createComment(post.id, newComment);
			setNewComment("");

			// Update comments list
			setComments((prev) => [...prev, comment]);

			// Notify parent component of updated post
			const updatedPost = {
				...post,
				commentCount: (post.commentCount || 0) + 1,
			};
			onCommentAdded(updatedPost);

			toast({
				description: "Comment added successfully",
			});
		} catch (error) {
			console.error("Error adding comment:", error);
			toast({
				title: "Error",
				description: "Failed to add comment",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteComment = async (commentId: number) => {
		try {
			await socialService.deleteComment(commentId);

			// Update local comments list
			setComments((prev) => prev.filter((c) => c.id !== commentId));

			// Update post comment count
			const updatedPost = {
				...post,
				commentCount: Math.max(0, (post.commentCount || 0) - 1),
			};
			onCommentAdded(updatedPost);

			toast({
				description: "Comment deleted successfully",
			});
		} catch (error: unknown) {
			console.error("Error deleting comment:", error);
			const socialError = error as SocialError;

			toast({
				title: "Error",
				description: socialError.message || "Failed to delete comment",
				variant: "destructive",
			});
		}
	};

	return (
		<div className={cn("w-full", className)}>
			<div className="w-full">
				<Button
					variant="ghost"
					size="sm"
					className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
					onClick={loadComments}
					disabled={isLoadingComments}
				>
					<MessageCircle className="h-4 w-4" />
					<span>
						{post.commentCount || 0}{" "}
						{(post.commentCount || 0) === 1 ? "Comment" : "Comments"}
					</span>
					{showComments ? (
						<ChevronUp className="h-4 w-4" />
					) : (
						<ChevronDown className="h-4 w-4" />
					)}
				</Button>

				{isLoadingComments && (
					<div className="flex justify-center py-4">
						<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600" />
					</div>
				)}

				{showComments && !isLoadingComments && (
					<div className="space-y-2 mt-2 w-full">
						{comments.map((comment) => {
							const commentAuthorName =
								comment.authorId.firstName && comment.authorId.lastName
									? `${comment.authorId.firstName} ${comment.authorId.lastName}`
									: comment.authorId.username || "Unknown User";

							const isCommentAuthor = currentUserId === comment.authorId.id;

							return (
								<div
									key={comment.id}
									className="bg-gray-50 p-3 rounded-lg w-full"
								>
									<div className="flex items-center justify-between mb-1">
										<div className="flex items-center gap-2">
											<span className="font-medium">{commentAuthorName}</span>
											<span className="text-sm text-gray-500">
												{formatDistanceToNow(new Date(comment.createdAt), {
													addSuffix: true,
												})}
											</span>
										</div>
										{isCommentAuthor && (
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8 hover:bg-gray-100"
													>
														<MoreVertical className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem
														className="text-red-600"
														onClick={() => handleDeleteComment(comment.id)}
													>
														<Trash2 className="h-4 w-4 mr-2" />
														Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										)}
									</div>
									<p className="text-sm">{comment.content}</p>
								</div>
							);
						})}

						<div className="flex items-center gap-2 w-full mt-4">
							<Input
								placeholder="Add a comment..."
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										handleAddComment();
									}
								}}
								className="flex-1"
							/>
							<Button
								variant="outline"
								size="icon"
								onClick={handleAddComment}
								disabled={isSubmitting || !newComment.trim()}
							>
								<MessageCircle className="h-4 w-4" />
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
