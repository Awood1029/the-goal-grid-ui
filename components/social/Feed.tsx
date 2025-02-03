"use client";

import React from "react";
import { PostCard } from "./PostCard";
import { CreatePostForm } from "./CreatePostForm";
import { useFeed } from "@/hooks/useFeed";
import type { FeedProps, PostDTO } from "@/types";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { cn } from "@/lib/utils";

const EmptyFeed = () => (
	<div className="text-center py-8 text-gray-500">
		No posts yet. Be the first to share something!
	</div>
);

const FeedError = ({
	error,
	onRetry,
}: {
	error: string;
	onRetry: () => void;
}) => (
	<Alert variant="destructive" className="my-4">
		<AlertCircle className="h-4 w-4" />
		<AlertDescription>{error}</AlertDescription>
		<Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
			Try Again
		</Button>
	</Alert>
);

export const Feed: React.FC<FeedProps> = ({
	type,
	groupUniqueCode,
	goalId,
	goals = [],
	className,
	hidePostCreation = false,
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

	const { lastElementRef } = useInfiniteScroll({
		isLoading,
		hasMore,
		onLoadMore: loadMore,
	});

	const handlePostUpdated = (updatedPost: PostDTO) => {
		handleCommentAdded(updatedPost);
	};

	if (error) {
		return <FeedError error={error} onRetry={() => loadPosts(0)} />;
	}

	return (
		<div className={cn("w-full", className)}>
			{!hidePostCreation && (
				<CreatePostForm
					goals={goals}
					onPostCreated={() => loadPosts(0)}
					className="mb-6"
					preselectedGoalId={goalId}
				/>
			)}
			<div className="space-y-6">
				{posts.map((post, index) => {
					const referencedGoal = goals.find(
						(goal) => goal.id === post.referencedGoal?.id
					);
					const isLastPost = index === posts.length - 1;

					return (
						<div key={post.id} ref={isLastPost ? lastElementRef : undefined}>
							<PostCard
								post={post}
								onCommentAdded={handleCommentAdded}
								onReactionAdded={handlePostUpdated}
								onPostDeleted={() => loadPosts(0)}
								onPostUpdated={handlePostUpdated}
								referencedGoal={referencedGoal}
								currentUserId={user?.userId}
							/>
						</div>
					);
				})}
				{isLoading && (
					<div className="w-full flex justify-center py-8">
						<Spinner size="lg" />
					</div>
				)}
				{!isLoading && posts.length === 0 && <EmptyFeed />}
			</div>
		</div>
	);
};
