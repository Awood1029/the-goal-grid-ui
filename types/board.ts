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

// Using type aliases instead of empty interfaces
export type Board = BoardDTO;
export type Goal = GoalDTO;
