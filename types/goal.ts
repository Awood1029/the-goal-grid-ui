export interface GoalDTO {
	id: number;
	title: string;
	description?: string;
	completed: boolean;
	completedAt?: string;
	createdAt: string;
	updatedAt: string;
	position: number;
}
