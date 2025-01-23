"use client";

import React, { useState, useEffect } from "react";
import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Target } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ReactionType } from "@/types/social";
import type { PostDTO, GoalDTO } from "@/types";
import { socialService } from "@/services/socialService";
import { cn } from "@/lib/utils";
import { reactionIcons } from "@/lib/constants";
import { CommentSection } from "./CommentSection";

interface PostCardProps {
	post: PostDTO;
	onCommentAdded?: (updatedPost: PostDTO) => void;
	onReactionAdded?: () => void;
	className?: string;
	referencedGoal?: GoalDTO;
}

export const PostCard: React.FC<PostCardProps> = ({
	post,
	onCommentAdded,
	onReactionAdded,
	className,
	referencedGoal,
}) => {
	const [localPost, setLocalPost] = useState(post);

	// Update localPost when post prop changes
	useEffect(() => {
		setLocalPost(post);
	}, [post]);

	const handleReaction = async (type: ReactionType) => {
		try {
			await socialService.addReactionToPost(post.id, type);
			onReactionAdded?.();
		} catch (error) {
			console.error("Error adding reaction:", error);
		}
	};

	const getReactionCount = (type: ReactionType) => {
		return localPost.reactions?.filter((r) => r.type === type).length || 0;
	};

	const authorName =
		localPost.author.firstName && localPost.author.lastName
			? `${localPost.author.firstName} ${localPost.author.lastName}`
			: localPost.author.username || "Unknown User";

	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<div className="flex items-center gap-2">
					<div className="font-semibold">{authorName}</div>
					<div className="text-sm text-gray-500">
						{formatDistanceToNow(new Date(localPost.createdAt), {
							addSuffix: true,
						})}
					</div>
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
				<p className="whitespace-pre-wrap">{localPost.content}</p>
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
				/>
			</CardFooter>
		</Card>
	);
};
