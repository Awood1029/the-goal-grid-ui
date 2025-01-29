import apiClient from "./apiClient";
import type {
	PostDTO,
	CommentDTO,
	ReactionDTO,
	SocialError,
	SocialErrorType,
	PaginatedResponse,
} from "@/types";
import { AxiosError } from "axios";

const handleApiError = (error: unknown): never => {
	if (error instanceof AxiosError) {
		const status = error.response?.status;
		let type: SocialErrorType = "SERVER_ERROR";
		let message = "An unexpected error occurred";

		switch (status) {
			case 400:
				type = "VALIDATION_ERROR";
				message = error.response?.data?.message || "Invalid request";
				break;
			case 401:
				type = "UNAUTHORIZED";
				message = "Please login to continue";
				break;
			case 403:
				type = "FORBIDDEN";
				message = "You don't have permission to perform this action";
				break;
			case 404:
				type = "NOT_FOUND";
				message = "The requested resource was not found";
				break;
			case undefined:
				type = "NETWORK_ERROR";
				message = "Network error occurred";
				break;
		}

		throw {
			type,
			message,
			details: error.response?.data,
		} as SocialError;
	}

	throw {
		type: "SERVER_ERROR",
		message: "An unexpected error occurred",
	} as SocialError;
};

export const socialService = {
	// Post-related endpoints
	createPost: async (
		content: string,
		referencedGoalId?: number,
		isProgressUpdate: boolean = false
	): Promise<PostDTO> => {
		try {
			const response = await apiClient.post("/posts", {
				content,
				referencedGoalId,
				isProgressUpdate,
			});
			return response.data;
		} catch (error) {
			throw handleApiError(error);
		}
	},

	getPost: async (postId: number): Promise<PostDTO> => {
		try {
			const response = await apiClient.get(`/posts/${postId}`);
			return response.data;
		} catch (error) {
			throw handleApiError(error);
		}
	},

	getAllCommentsForPost: async (postId: number): Promise<CommentDTO[]> => {
		try {
			const response = await apiClient.get(`/posts/${postId}/comments`);
			return response.data;
		} catch (error) {
			throw handleApiError(error);
		}
	},

	// Feed endpoints
	getMainFeed: async (
		page: number = 0,
		size: number = 20
	): Promise<PaginatedResponse<PostDTO>> => {
		try {
			const response = await apiClient.get(
				`/feed/main?page=${page}&size=${size}`
			);
			return response.data;
		} catch (error) {
			throw handleApiError(error);
		}
	},

	getGroupFeed: async (
		groupUniqueCode: string,
		page: number = 0,
		size: number = 20
	): Promise<PaginatedResponse<PostDTO>> => {
		try {
			const response = await apiClient.get(
				`/feed/group/${groupUniqueCode}?page=${page}&size=${size}`
			);
			return response.data;
		} catch (error) {
			throw handleApiError(error);
		}
	},

	getGoalFeed: async (
		goalId: number,
		page: number = 0,
		size: number = 20
	): Promise<PaginatedResponse<PostDTO>> => {
		try {
			const response = await apiClient.get(
				`/feed/goal/${goalId}?page=${page}&size=${size}`
			);
			return response.data;
		} catch (error) {
			throw handleApiError(error);
		}
	},

	// Comment-related endpoints
	createComment: async (
		postId: number,
		content: string
	): Promise<CommentDTO> => {
		try {
			const response = await apiClient.post(`/posts/${postId}/comments`, {
				content,
			});
			return response.data;
		} catch (error) {
			throw handleApiError(error);
		}
	},

	// Reaction-related endpoints
	addReactionToPost: async (
		postId: number,
		type: string
	): Promise<ReactionDTO> => {
		try {
			const response = await apiClient.post(`/posts/${postId}/reactions`, {
				type,
			});
			return response.data;
		} catch (error) {
			throw handleApiError(error);
		}
	},

	addReactionToComment: async (
		commentId: number,
		type: string
	): Promise<ReactionDTO> => {
		try {
			const response = await apiClient.post(
				`/comments/${commentId}/reactions`,
				{
					type,
				}
			);
			return response.data;
		} catch (error) {
			throw handleApiError(error);
		}
	},

	updatePost: async (
		postId: number,
		content: string,
		isProgressUpdate?: boolean
	): Promise<PostDTO> => {
		try {
			const response = await apiClient.put(`/posts/${postId}`, {
				content,
				isProgressUpdate,
			});
			return response.data;
		} catch (error) {
			throw handleApiError(error);
		}
	},

	deletePost: async (postId: number): Promise<void> => {
		try {
			await apiClient.delete(`/posts/${postId}`);
		} catch (error) {
			throw handleApiError(error);
		}
	},

	deleteComment: async (commentId: number): Promise<void> => {
		try {
			await apiClient.delete(`/comments/${commentId}`);
		} catch (error) {
			throw handleApiError(error);
		}
	},

	updateComment: async (
		commentId: number,
		content: string
	): Promise<CommentDTO> => {
		try {
			const response = await apiClient.put(`/comments/${commentId}`, {
				content,
			});
			return response.data;
		} catch (error) {
			throw handleApiError(error);
		}
	},
};
