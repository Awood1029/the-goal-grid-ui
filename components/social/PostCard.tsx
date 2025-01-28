"use client";

import React, { useState, useEffect } from "react";
import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Target, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ReactionType } from "@/types/social";
import type { PostDTO, GoalDTO } from "@/types";
import { socialService } from "@/services/socialService";
import type { SocialError } from "@/types";
import { cn } from "@/lib/utils";
import { reactionIcons } from "@/lib/constants";
import { CommentSection } from "./CommentSection";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface PostCardProps {
	post: PostDTO;
	onCommentAdded?: (updatedPost: PostDTO) => void;
	onReactionAdded?: () => void;
	onPostDeleted?: (postId: number) => void;
	onPostUpdated?: (updatedPost: PostDTO) => void;
	className?: string;
	referencedGoal?: GoalDTO;
	currentUserId?: number;
}

export const PostCard: React.FC<PostCardProps> = ({
	post,
	onCommentAdded,
	onReactionAdded,
	onPostDeleted,
	onPostUpdated,
	className,
	referencedGoal,
	currentUserId,
}) => {
	const [localPost, setLocalPost] = useState(post);
	const [isEditing, setIsEditing] = useState(false);
	const [editContent, setEditContent] = useState(post.content);
	const { toast } = useToast();

	// Update localPost when post prop changes
	useEffect(() => {
		setLocalPost(post);
		setEditContent(post.content);
	}, [post]);

	const handleReaction = async (type: ReactionType) => {
		try {
			await socialService.addReactionToPost(post.id, type);
			onReactionAdded?.();
		} catch (error) {
			console.error("Error adding reaction:", error);
			toast({
				title: "Error",
				description: "Failed to add reaction",
				variant: "destructive",
			});
		}
	};

	const handleDelete = async () => {
		try {
			await socialService.deletePost(post.id);
			onPostDeleted?.(post.id);
			toast({
				description: "Post deleted successfully",
			});
		} catch (error: unknown) {
			console.error("Error deleting post:", error);
			const socialError = error as SocialError;
			const errorMessage = socialError.message;

			// Check if the error is related to foreign key constraint
			const isForeignKeyError = errorMessage
				?.toLowerCase()
				.includes("foreign key constraint");

			toast({
				title: "Error",
				description: isForeignKeyError
					? "Cannot delete post because it has reactions or comments. Please remove them first."
					: socialError.message || "Failed to delete post. Please try again.",
				variant: "destructive",
			});
		}
	};

	const handleEdit = async () => {
		try {
			const updatedPost = await socialService.updatePost(
				post.id,
				editContent,
				localPost.isProgressUpdate
			);
			setLocalPost(updatedPost);
			onPostUpdated?.(updatedPost);
			setIsEditing(false);
			toast({
				description: "Post updated successfully",
			});
		} catch (error) {
			console.error("Error updating post:", error);
			toast({
				title: "Error",
				description: "Failed to update post",
				variant: "destructive",
			});
		}
	};

	const getReactionCount = (type: ReactionType) => {
		return localPost.reactions?.filter((r) => r.type === type).length || 0;
	};

	const authorName =
		localPost.author.firstName && localPost.author.lastName
			? `${localPost.author.firstName} ${localPost.author.lastName}`
			: localPost.author.username || "Unknown User";

	const isAuthor = currentUserId === localPost.author.id;

	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="font-semibold">{authorName}</div>
						<div className="text-sm text-gray-500">
							{formatDistanceToNow(new Date(localPost.createdAt), {
								addSuffix: true,
							})}
						</div>
					</div>
					{isAuthor && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="h-8 w-8">
									<MoreVertical className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={() => setIsEditing(true)}>
									<Pencil className="h-4 w-4 mr-2" />
									Edit
								</DropdownMenuItem>
								<DropdownMenuItem
									className="text-red-600"
									onClick={handleDelete}
								>
									<Trash2 className="h-4 w-4 mr-2" />
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
				{localPost.isProgressUpdate && (
					<div className="flex items-center gap-1 text-sm text-yellow-600">
						<Trophy className="h-4 w-4" />
						Progress Update
					</div>
				)}
			</CardHeader>
			<CardContent>
				{referencedGoal && (
					<div className="mb-4 p-3 bg-purple-50 border border-purple-100 rounded-lg">
						<div className="flex items-center gap-2 text-sm text-purple-700 mb-1">
							<Target className="h-4 w-4" />
							<span className="font-medium">Referenced Goal</span>
						</div>
						<p className="text-sm text-purple-900">
							{referencedGoal.description}
						</p>
					</div>
				)}
				{isEditing ? (
					<div className="space-y-2">
						<Textarea
							value={editContent}
							onChange={(e) => setEditContent(e.target.value)}
							className="min-h-[100px]"
						/>
						<div className="flex justify-end gap-2">
							<Button variant="outline" onClick={() => setIsEditing(false)}>
								Cancel
							</Button>
							<Button onClick={handleEdit}>Save</Button>
						</div>
					</div>
				) : (
					<p className="whitespace-pre-wrap">{localPost.content}</p>
				)}
			</CardContent>
			<CardFooter className="flex flex-col gap-4">
				<div className="flex items-center gap-2 w-full">
					{Object.entries(reactionIcons).map(([type, Icon]) => (
						<Button
							key={type}
							variant="outline"
							size="sm"
							className="flex items-center gap-1"
							onClick={() => handleReaction(type as ReactionType)}
						>
							<Icon className="h-4 w-4" />
							<span>{getReactionCount(type as ReactionType)}</span>
						</Button>
					))}
				</div>

				<CommentSection
					post={localPost}
					onCommentAdded={(updatedPost) => {
						setLocalPost(updatedPost);
						onCommentAdded?.(updatedPost);
					}}
					currentUserId={currentUserId}
				/>
			</CardFooter>
		</Card>
	);
};
