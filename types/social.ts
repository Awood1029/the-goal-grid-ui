import type { UserDTO } from "./user";
import type { GoalDTO } from "./board";

export enum ReactionType {
	LIKE = "LIKE",
	LOVE = "LOVE",
	LAUGH = "LAUGH",
	CELEBRATE = "CELEBRATE",
	HIGH_FIVE = "HIGH_FIVE",
}

export interface ReactionDTO {
	id: number;
	type: ReactionType;
	user: UserDTO;
}

export interface CommentDTO {
	id: number;
	content: string;
	authorId: UserDTO;
	postId: number;
	createdAt: string;
	reactions: ReactionDTO[];
}

export interface ReferencedGoalDTO {
	id: number;
	referencedGoalContent: string;
}

export interface PostDTO {
	id: number;
	content: string;
	author: UserDTO;
	createdAt: string;
	reactions: ReactionDTO[];
	commentCount: number;
	referencedGoal?: ReferencedGoalDTO;
	progressUpdate: boolean;
}

export type FeedType = "main" | "group" | "goal";

export interface FeedProps {
	type: FeedType;
	groupUniqueCode?: string;
	goalId?: number;
	goals?: GoalDTO[];
	className?: string;
	hidePostCreation?: boolean;
}

export interface PaginatedResponse<T> {
	content: T[];
	pageNumber: number;
	pageSize: number;
	totalElements: number;
	totalPages: number;
	last: boolean;
}

export interface FeedState {
	posts: PostDTO[];
	isLoading: boolean;
	error: string | null;
	hasMore: boolean;
	currentPage: number;
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
	details?: Record<string, string | number | boolean | null | undefined>;
}
