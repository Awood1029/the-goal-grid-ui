import { useState, useEffect } from "react";
import { socialService } from "@/services/socialService";
import type { PostDTO, FeedType, FeedState, SocialError } from "@/types";

interface UseFeedParams {
	type: FeedType;
	groupUniqueCode?: string;
	goalId?: number;
}

export const useFeed = ({ type, groupUniqueCode, goalId }: UseFeedParams) => {
	const [state, setState] = useState<FeedState>({
		posts: [],
		isLoading: true,
		error: null,
	});

	const loadPosts = async () => {
		try {
			setState((prev) => ({ ...prev, isLoading: true, error: null }));

			let fetchedPosts: PostDTO[];
			switch (type) {
				case "main":
					fetchedPosts = await socialService.getMainFeed();
					break;
				case "group":
					if (!groupUniqueCode) {
						throw {
							type: "VALIDATION_ERROR",
							message: "Group code is required",
						} as SocialError;
					}
					fetchedPosts = await socialService.getGroupFeed(groupUniqueCode);
					break;
				case "goal":
					if (!goalId) {
						throw {
							type: "VALIDATION_ERROR",
							message: "Goal ID is required",
						} as SocialError;
					}
					fetchedPosts = await socialService.getGoalFeed(goalId);
					break;
				default:
					throw {
						type: "VALIDATION_ERROR",
						message: "Invalid feed type",
					} as SocialError;
			}

			setState((prev) => ({ ...prev, posts: fetchedPosts, isLoading: false }));
		} catch (err) {
			console.error("Error loading posts:", err);
			const error = err as SocialError;
			let errorMessage: string;

			switch (error.type) {
				case "NETWORK_ERROR":
					errorMessage =
						"Unable to connect to the server. Please check your internet connection.";
					break;
				case "UNAUTHORIZED":
					errorMessage = "Please login to view this feed.";
					break;
				case "FORBIDDEN":
					errorMessage = "You don't have permission to view this feed.";
					break;
				case "NOT_FOUND":
					errorMessage =
						type === "group"
							? "The group you're looking for doesn't exist."
							: type === "goal"
							? "The goal you're looking for doesn't exist."
							: "The requested feed was not found.";
					break;
				case "VALIDATION_ERROR":
					errorMessage = error.message;
					break;
				default:
					errorMessage = "Failed to load posts. Please try again later.";
			}

			setState((prev) => ({
				...prev,
				error: errorMessage,
				isLoading: false,
			}));
		}
	};

	useEffect(() => {
		loadPosts();
	}, [type, groupUniqueCode, goalId]);

	const handleCommentAdded = (updatedPost: PostDTO) => {
		setState((prev) => ({
			...prev,
			posts: prev.posts.map((post) =>
				post.id === updatedPost.id ? updatedPost : post
			),
		}));
	};

	return {
		...state,
		loadPosts,
		handleCommentAdded,
	};
};
