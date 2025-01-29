"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { PostCard } from "./PostCard";
import { CreatePostForm } from "./CreatePostForm";
import { useFeed } from "@/hooks/useFeed";
import type { FeedProps } from "@/types";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export const Feed: React.FC<FeedProps> = ({
	type,
	groupUniqueCode,
	goalId,
	goals = [],
	className,
}) => {
	const {
		posts,
		isLoading,
		error,
		hasMore,
		handleCommentAdded,
		loadPosts,
		loadMore,
	} = useFeed({
		type,
		groupUniqueCode,
		goalId,
	});
	const { user } = useAuth();
	const observerRef = useRef<IntersectionObserver>();
	const loadingRef = useRef<HTMLDivElement>(null);

	const lastPostRef = useCallback(
		(node: HTMLDivElement) => {
			if (isLoading) return;

			if (observerRef.current) {
				observerRef.current.disconnect();
			}

			observerRef.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					loadMore();
				}
			});

			if (node) {
				observerRef.current.observe(node);
			}
		},
		[isLoading, hasMore, loadMore]
	);

	useEffect(() => {
		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, []);

	if (error) {
		return (
			<Alert variant="destructive" className="my-4">
				<AlertCircle className="h-4 w-4" />
				<AlertDescription>{error}</AlertDescription>
				<Button
					variant="outline"
					size="sm"
					onClick={() => loadPosts(0)}
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
				onPostCreated={() => loadPosts(0)}
				className="mb-6"
				preselectedGoalId={goalId}
			/>
			<div className="space-y-6">
				{posts.map((post, index) => {
					const referencedGoal = goals.find(
						(goal) => goal.id === post.referencedGoalId
					);
					const isLastPost = index === posts.length - 1;

					return (
						<div key={post.id} ref={isLastPost ? lastPostRef : undefined}>
							<PostCard
								post={post}
								onCommentAdded={handleCommentAdded}
								onReactionAdded={() => loadPosts(0)}
								onPostDeleted={() => loadPosts(0)}
								onPostUpdated={() => loadPosts(0)}
								referencedGoal={referencedGoal}
								currentUserId={user?.userId}
							/>
						</div>
					);
				})}
				{isLoading && (
					<div ref={loadingRef} className="w-full flex justify-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
					</div>
				)}
				{!isLoading && posts.length === 0 && (
					<div className="text-center py-8 text-gray-500">
						No posts yet. Be the first to share something!
					</div>
				)}
			</div>
		</div>
	);
};
