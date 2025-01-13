import apiClient from "./apiClient";
import type { UserDTO } from "@/types";

export const userService = {
	getAllUsers: async (): Promise<UserDTO[]> => {
		const response = await apiClient.get("/api/users");
		return response.data;
	},

	getUserById: async (id: string): Promise<UserDTO> => {
		const response = await apiClient.get(`/api/users/${id}`);
		return response.data;
	},
};
