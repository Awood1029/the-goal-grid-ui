import apiClient from "./apiClient";
import type { GoalDTO } from "@/types";

export const goalService = {
	updateGoalDescription: async (
		goalId: number,
		description: string
	): Promise<GoalDTO> => {
		const response = await apiClient.put(
			`/api/goals/${goalId}/description`,
			null,
			{
				params: { description },
			}
		);
		return response.data;
	},

	updateGoalStatus: async (
		goalId: number,
		isCompleted: boolean
	): Promise<GoalDTO> => {
		const response = await apiClient.put(`/api/goals/${goalId}/status`, null, {
			params: { isCompleted },
		});
		return response.data;
	},
};
