import type { UserDTO } from "./user";
import type { GoalDTO } from "./board";

export enum ReactionType {
	LIKE = "LIKE",
	LOVE = "LOVE",
	CELEBRATE = "CELEBRATE",
	SUPPORT = "SUPPORT",
}

export interface ReactionDTO {
	id: number;
	type: ReactionType;
	userId?: number;
	createdAt?: string;
}

export interface CommentDTO {
	id: number;
	authorId: UserDTO;
	postId: number;
	content: string;
	createdAt: string;
	reactions: ReactionDTO[];
}

export interface PostDTO {
	id: number;
	author: UserDTO;
	content: string;
	createdAt: string;
	referencedGoalId?: number;
	isProgressUpdate: boolean;
	reactions: ReactionDTO[] | null;
	commentCount: number | null;
}

export type FeedType = "main" | "group" | "goal";

export interface FeedProps {
	type: FeedType;
	groupUniqueCode?: string;
	goalId?: number;
	goals?: GoalDTO[];
	className?: string;
}

export interface FeedState {
	posts: PostDTO[];
	isLoading: boolean;
	error: string | null;
}

export type SocialErrorType =
	| "NETWORK_ERROR"
	| "NOT_FOUND"
	| "UNAUTHORIZED"
	| "FORBIDDEN"
	| "VALIDATION_ERROR"
	| "SERVER_ERROR";

export interface SocialError {
	type: SocialErrorType;
	message: string;
	details?: Record<string, any>;
}
