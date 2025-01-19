import apiClient from "./apiClient"; // Axios instance with base URL
import type { BoardDTO, GoalDTO, GoalUpdateDTO } from "@/types";

export const boardService = {
	/**
	 * Create a new board with the given name
	 * @param boardName - Name for the new board
	 */
	createBoard: async (boardName: string): Promise<BoardDTO> => {
		const response = await apiClient.post("/api/boards", { boardName });
		return response.data;
	},

	/**
	 * Get or create the personal board for the current user.
	 */
	getOrCreatePersonalBoard: async (): Promise<BoardDTO> => {
		const response = await apiClient.get("/boards");
		return response.data; // Assuming the backend returns the user's board
	},

	/**
	 * Update the board name.
	 * @param boardId - ID of the board to update
	 * @param boardName - New name for the board
	 */
	updateBoardName: async (
		boardId: number,
		boardName: string
	): Promise<BoardDTO> => {
		const response = await apiClient.put(`/boards/${boardId}/name`, {
			boardName,
		});
		return response.data;
	},

	/**
	 * Bulk update goals for a specific board.
	 * @param boardId - ID of the board whose goals are being updated
	 * @param goalUpdates - List of goal updates (description or completion status)
	 */
	bulkUpdateGoals: async (
		boardId: number,
		goalUpdates: GoalUpdateDTO[]
	): Promise<BoardDTO> => {
		const response = await apiClient.put(
			`/boards/${boardId}/goals`,
			goalUpdates
		);
		return response.data;
	},

	/**
	 * Update the description of a specific goal.
	 * @param goalId - ID of the goal to update
	 * @param description - New description for the goal
	 */
	updateGoalDescription: async (
		goalId: number,
		description: string
	): Promise<GoalDTO> => {
		const response = await apiClient.put(`/goals/${goalId}/description`, null, {
			params: { description },
		});
		return response.data;
	},

	/**
	 * Update the completion status of a specific goal.
	 * @param goalId - ID of the goal to update
	 * @param isCompleted - New completion status for the goal
	 */
	updateGoalStatus: async (
		goalId: number,
		isCompleted: boolean
	): Promise<GoalDTO> => {
		const response = await apiClient.put(`/goals/${goalId}/status`, null, {
			params: { isCompleted },
		});
		return response.data;
	},
};
