import { BoardDTO, GoalDTO } from "./board";
import { PostDTO } from "./social";

export interface UserDTO {
	id: number;
	username: string;
	firstName?: string;
	lastName?: string;
}

export interface User extends UserDTO {
	createdAt: string;
}

export type FriendRequestStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export interface FriendRequestDTO {
	id: number;
	sender: UserDTO;
	recipient: UserDTO;
	status: FriendRequestStatus;
	createdAt: string;
	updatedAt: string;
}

export interface UserProfileDTO {
	id: number;
	username: string;
	firstName?: string;
	lastName?: string;
	friends: UserDTO[];
	board?: BoardDTO;
	recentCompletedGoal?: GoalDTO;
	totalCompletedGoals: number;
	recentPosts: PostDTO[];
	pendingRequests: FriendRequestDTO[];
	areFriends: boolean;
	friendRequestPending: boolean;
}
