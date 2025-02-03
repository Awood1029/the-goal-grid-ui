import apiClient from "./apiClient";
import type { AuthResponseDTO } from "@/types";

export const authService = {
	login: async (
		username: string,
		password: string
	): Promise<AuthResponseDTO> => {
		const response = await apiClient.post("/api/auth/login", {
			username,
			password,
		});
		return response.data;
	},

	register: async (
		username: string,
		password: string,
		firstName: string,
		lastName: string
	): Promise<void> => {
		await apiClient.post("/api/auth/register", {
			username,
			password,
			firstName,
			lastName,
		});
	},

	refreshToken: async (refreshToken: string): Promise<AuthResponseDTO> => {
		const response = await apiClient.post(
			"/api/auth/refresh",
			{},
			{
				headers: {
					Authorization: `Bearer ${refreshToken}`,
				},
			}
		);
		return response.data;
	},

	logout: async (): Promise<void> => {
		await apiClient.post("/api/auth/logout");
	},
};
