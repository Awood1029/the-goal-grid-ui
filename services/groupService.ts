import apiClient from "./apiClient";
import type { GroupDTO } from "@/types";

export const groupService = {
	createGroup: async (name: string): Promise<GroupDTO> => {
		const response = await apiClient.post("/api/groups", null, {
			params: { name },
		});
		return response.data;
	},

	joinGroupByInvite: async (inviteCode: string): Promise<GroupDTO> => {
		const response = await apiClient.post("/api/groups/join", { inviteCode });
		return response.data;
	},

	getGroupByUrl: async (uniqueUrl: string): Promise<GroupDTO> => {
		const response = await apiClient.get(`/api/groups/${uniqueUrl}`);
		return response.data;
	},

	getGroupByInviteCode: async (inviteCode: string): Promise<GroupDTO> => {
		const response = await apiClient.get(`/api/groups/invite/${inviteCode}`);
		return response.data;
	},

	getGroupsByUser: async (): Promise<GroupDTO[]> => {
		const response = await apiClient.get("/api/groups/user");
		return response.data;
	},
};
