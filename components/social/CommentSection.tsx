import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { PostDTO, CommentDTO } from "@/types";
import { socialService } from "@/services/socialService";
import { useToast } from "@/hooks/use-toast";
import { ReactionSection } from "./ReactionSection";

export interface CommentSectionProps {
	post: PostDTO;
	onCommentAdded: (updatedPost: PostDTO) => void;
	onCommentDeleted?: () => void;
	currentUserId?: number;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
	post,
	onCommentAdded,
	onCommentDeleted,
	currentUserId,
}) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [comments, setComments] = useState<CommentDTO[]>([]);
	const [newComment, setNewComment] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const handleDeleteComment = async (commentId: number) => {
		try {
			await socialService.deleteComment(commentId);
			setComments((prev) => prev.filter((c) => c.id !== commentId));
			onCommentDeleted?.();
			toast({
				description: "Comment deleted successfully",
			});
		} catch (error) {
			console.error("Error deleting comment:", error);
			toast({
				title: "Error",
				description: "Failed to delete comment",
				variant: "destructive",
			});
		}
	};

	const loadComments = async () => {
		try {
			setIsLoading(true);
			const fetchedComments = await socialService.getAllCommentsForPost(
				post.id,
				"createdAt",
				"desc"
			);
			setComments(fetchedComments);
		} catch (error) {
			console.error("Error loading comments:", error);
			toast({
				title: "Error",
				description: "Failed to load comments",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmitComment = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newComment.trim()) return;

		try {
			const comment = await socialService.createComment(
				post.id,
				newComment.trim()
			);
			setComments((prev) => [comment, ...prev]);
			setNewComment("");
			onCommentAdded(post);
		} catch (error) {
			console.error("Error creating comment:", error);
			toast({
				title: "Error",
				description: "Failed to create comment",
				variant: "destructive",
			});
		}
	};

	useEffect(() => {
		if (isExpanded) {
			loadComments();
		}
	}, [isExpanded, post.id]);

	return (
		<div className="w-full">
			<Button
				variant="ghost"
				className="text-gray-600 hover:text-gray-900 p-2 h-auto"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<div className="flex items-center gap-2">
					<span>{post.commentCount || 0} Comments</span>
					{isExpanded ? (
						<ChevronUp className="h-4 w-4" />
					) : (
						<ChevronDown className="h-4 w-4" />
					)}
				</div>
			</Button>

			{isExpanded && (
				<div className="mt-4 space-y-4">
					<form onSubmit={handleSubmitComment} className="space-y-2">
						<Textarea
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder="Write a comment..."
							className="min-h-[80px]"
						/>
						<div className="flex justify-end">
							<Button type="submit" disabled={!newComment.trim()}>
								Post Comment
							</Button>
						</div>
					</form>

					{isLoading ? (
						<div className="flex justify-center py-4">
							<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600" />
						</div>
					) : (
						<div className="space-y-4">
							{comments.map((comment) => (
								<div
									key={comment.id}
									className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg"
								>
									<div className="flex-1">
										<div className="flex items-center justify-between gap-2 mb-1">
											<div className="font-medium">
												{comment.authorId.firstName} {comment.authorId.lastName}
											</div>
											<div className="text-sm text-gray-500">
												{formatDistanceToNow(new Date(comment.createdAt), {
													addSuffix: true,
												})}
											</div>
										</div>
										<p className="text-gray-700">{comment.content}</p>
										<div className="mt-2">
											<ReactionSection
												reactions={comment.reactions}
												onReactionAdded={(updatedReactions) => {
													setComments((prev) =>
														prev.map((c) =>
															c.id === comment.id
																? { ...c, reactions: updatedReactions }
																: c
														)
													);
												}}
												currentUserId={currentUserId}
												entityId={comment.id}
												entityType="comment"
												className="justify-start"
											/>
										</div>
									</div>
									{currentUserId === comment.authorId.id && (
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 text-gray-500 hover:text-red-600"
											onClick={() => handleDeleteComment(comment.id)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
};
