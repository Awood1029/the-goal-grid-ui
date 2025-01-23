"use client";

import React from "react";
import { PostCard } from "./PostCard";
import { CreatePostForm } from "./CreatePostForm";
import { useFeed } from "@/hooks/useFeed";
import type { FeedProps } from "@/types";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export const Feed: React.FC<FeedProps> = ({
	type,
	groupUniqueCode,
	goalId,
	goals = [],
	className,
}) => {
	const { posts, isLoading, error, handleCommentAdded, loadPosts } = useFeed({
		type,
		groupUniqueCode,
		goalId,
	});

	if (isLoading) {
		return (
			<div className="w-full flex justify-center py-8">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
			</div>
		);
	}

	if (error) {
		return (
			<Alert variant="destructive" className="my-4">
				<AlertCircle className="h-4 w-4" />
				<AlertDescription>{error}</AlertDescription>
				<Button
					variant="outline"
					size="sm"
					onClick={loadPosts}
					className="mt-2"
				>
					Try Again
				</Button>
			</Alert>
		);
	}

	return (
		<div className={className}>
			<CreatePostForm
				goals={goals}
				onPostCreated={loadPosts}
				className="mb-6"
				preselectedGoalId={goalId}
			/>
			<div className="space-y-6">
				{posts.map((post) => {
					const referencedGoal = goals.find(
						(goal) => goal.id === post.referencedGoalId
					);
					return (
						<PostCard
							key={post.id}
							post={post}
							onCommentAdded={handleCommentAdded}
							onReactionAdded={loadPosts}
							referencedGoal={referencedGoal}
						/>
					);
				})}
				{posts.length === 0 && (
					<div className="text-center py-8 text-gray-500">
						No posts yet. Be the first to share something!
					</div>
				)}
			</div>
		</div>
	);
};
