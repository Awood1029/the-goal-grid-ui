import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { PostDTO, CommentDTO, ReactionDTO } from "@/types";
import { socialService } from "@/services/socialService";
import { useToast } from "@/hooks/use-toast";
import { ReactionSection } from "./ReactionSection";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

export interface CommentSectionProps {
	post: PostDTO;
	onCommentAdded: (updatedPost: PostDTO) => void;
	onCommentDeleted?: () => void;
	currentUserId?: number;
}

interface CommentFormProps {
	onSubmit: (content: string) => Promise<void>;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
	const [content, setContent] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!content.trim() || isSubmitting) return;

		setIsSubmitting(true);
		try {
			await onSubmit(content.trim());
			setContent("");
		} catch {
			toast({
				title: "Error",
				description: "Failed to post comment",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-2">
			<Textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder="Write a comment..."
				className="min-h-[80px]"
			/>
			<div className="flex justify-end">
				<Button type="submit" disabled={!content.trim() || isSubmitting}>
					{isSubmitting ? "Posting..." : "Post Comment"}
				</Button>
			</div>
		</form>
	);
};

interface CommentItemProps {
	comment: CommentDTO;
	currentUserId?: number;
	onDelete: (commentId: number) => Promise<void>;
	onReactionAdded: (commentId: number, updatedReactions: ReactionDTO[]) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
	comment,
	currentUserId,
	onDelete,
	onReactionAdded,
}) => {
	const isAuthor = currentUserId === comment.authorId.id;

	return (
		<div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
			<div className="flex-1">
				<div className="flex items-center justify-between gap-2 mb-1">
					<div className="font-medium">
						<Link
							href={`/profile/${comment.authorId.id}`}
							className="hover:text-purple-600 hover:underline"
						>
							{comment.authorId.firstName} {comment.authorId.lastName}
						</Link>
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
						onReactionAdded={(updatedReactions) =>
							onReactionAdded(comment.id, updatedReactions)
						}
						currentUserId={currentUserId}
						entityId={comment.id}
						entityType="comment"
						className="justify-start"
					/>
				</div>
			</div>
			{isAuthor && (
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 text-gray-500 hover:text-red-600"
					onClick={() => onDelete(comment.id)}
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			)}
		</div>
	);
};

export const CommentSection: React.FC<CommentSectionProps> = ({
	post,
	onCommentAdded,
	onCommentDeleted,
	currentUserId,
}) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [comments, setComments] = useState<CommentDTO[]>([]);
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

	const loadComments = useCallback(async () => {
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
	}, [post.id, toast]);

	const handleSubmitComment = async (content: string) => {
		const comment = await socialService.createComment(post.id, content);
		setComments((prev) => [comment, ...prev]);
		onCommentAdded(post);
	};

	useEffect(() => {
		if (isExpanded) {
			loadComments();
		}
	}, [isExpanded, post.id, loadComments]);

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
					<CommentForm onSubmit={handleSubmitComment} />

					{isLoading ? (
						<div className="flex justify-center py-4">
							<Spinner size="md" />
						</div>
					) : (
						<div className="space-y-4">
							{comments.map((comment) => (
								<CommentItem
									key={comment.id}
									comment={comment}
									currentUserId={currentUserId}
									onDelete={handleDeleteComment}
									onReactionAdded={(commentId, updatedReactions) => {
										setComments((prev) =>
											prev.map((c) =>
												c.id === commentId
													? { ...c, reactions: updatedReactions }
													: c
											)
										);
									}}
								/>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
};
