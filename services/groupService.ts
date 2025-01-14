import apiClient from "./apiClient";
import type { GroupDTO, Board } from "@/types";

export const groupService = {
	createGroup: async (name: string): Promise<GroupDTO> => {
		const response = await apiClient.post("/groups", null, {
			params: { name },
		});
		return response.data;
	},

	joinGroupByInvite: async (inviteCode: string): Promise<GroupDTO> => {
		const response = await apiClient.post("/groups/join", { inviteCode });
		return response.data;
	},

	getGroupByUrl: async (uniqueUrl: string): Promise<GroupDTO> => {
		const response = await apiClient.get(`/groups/${uniqueUrl}`);
		return response.data;
	},

	getGroupByInviteCode: async (inviteCode: string): Promise<GroupDTO> => {
		const response = await apiClient.get(`/groups/invite/${inviteCode}`);
		return response.data;
	},

	getGroupsByUser: async (): Promise<GroupDTO[]> => {
		const response = await apiClient.get("/groups/user");
		return response.data;
	},

	getGroupBoards: async (uniqueUrl: string): Promise<Board[]> => {
		const response = await apiClient.get(`/groups/${uniqueUrl}/boards`);
		return response.data;
	},
};
