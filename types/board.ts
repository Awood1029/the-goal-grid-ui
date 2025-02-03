import type { UserDTO } from "./user";

export interface GoalDTO {
	id: number;
	description: string;
	position: number;
	boardId: number;
	completed: boolean;
}

export interface UpdateGoalCompletionDTO {
	id: number;
	completed: boolean;
}

export interface GoalUpdateDTO {
	goalId: number;
	description?: string;
	completed?: boolean;
}

export interface BoardDTO {
	id: number;
	ownerId: number;
	name: string;
	goals: GoalDTO[];
}

export interface CreateBoardRequestDTO {
	boardName: string;
}

export interface LeaderboardEntry {
	userId: number;
	user: UserDTO;
	completedGoals: number;
	totalGoals: number;
}

// Using type aliases instead of empty interfaces
export type Board = BoardDTO;
export type Goal = GoalDTO;
