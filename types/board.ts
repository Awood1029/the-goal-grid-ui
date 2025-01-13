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

export interface UpdateGoalDescriptionDTO {
	id: number;
	completed: boolean;
}

export interface GoalDTO {
	id: number;
	description: string;
	position: number;
	boardId: number;
	completed: boolean;
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

export interface Board extends BoardDTO {
	// Additional frontend fields if needed
}

export interface Goal extends GoalDTO {
	// Additional frontend fields if needed
}
