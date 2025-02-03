import { FriendRequestDTO, UserProfileDTO } from "@/types/user";
import apiClient from "./apiClient";
import { AxiosError } from "axios";

class FriendService {
	async getCurrentUserProfile(): Promise<UserProfileDTO> {
		try {
			const { data } = await apiClient.get<UserProfileDTO>("/profile/me");
			return data;
		} catch (error) {
			if (error instanceof AxiosError) {
				throw new Error(
					`Failed to fetch current user profile: ${
						error.response?.data?.message || error.message
					}`
				);
			}
			throw error;
		}
	}

	async getUserProfile(userId: number): Promise<UserProfileDTO> {
		try {
			const { data } = await apiClient.get<UserProfileDTO>(
				`/profile/${userId}`
			);
			return data;
		} catch (error) {
			if (error instanceof AxiosError) {
				throw new Error(
					`Failed to fetch profile for user ${userId}: ${
						error.response?.data?.message || error.message
					}`
				);
			}
			throw error;
		}
	}

	async sendFriendRequest(recipientId: number): Promise<void> {
		try {
			await apiClient.post(`/friend-requests/send/${recipientId}`);
		} catch (error) {
			if (error instanceof AxiosError) {
				throw new Error(
					`Failed to send friend request: ${
						error.response?.data?.message || error.message
					}`
				);
			}
			throw error;
		}
	}

	async acceptFriendRequest(requestId: number): Promise<void> {
		try {
			await apiClient.post(`/friend-requests/accept/${requestId}`);
		} catch (error) {
			if (error instanceof AxiosError) {
				throw new Error(
					`Failed to accept friend request: ${
						error.response?.data?.message || error.message
					}`
				);
			}
			throw error;
		}
	}

	async declineFriendRequest(requestId: number): Promise<void> {
		try {
			await apiClient.post(`/friend-requests/decline/${requestId}`);
		} catch (error) {
			if (error instanceof AxiosError) {
				throw new Error(
					`Failed to decline friend request: ${
						error.response?.data?.message || error.message
					}`
				);
			}
			throw error;
		}
	}

	async getPendingFriendRequests(): Promise<FriendRequestDTO[]> {
		try {
			const { data } = await apiClient.get<FriendRequestDTO[]>(
				"/friend-requests/pending"
			);
			return data;
		} catch (error) {
			if (error instanceof AxiosError) {
				throw new Error(
					`Failed to fetch pending friend requests: ${
						error.response?.data?.message || error.message
					}`
				);
			}
			throw error;
		}
	}

	async removeFriend(friendId: number): Promise<void> {
		try {
			await apiClient.post(`/friends/remove/${friendId}`);
		} catch (error) {
			if (error instanceof AxiosError) {
				throw new Error(
					`Failed to remove friend: ${
						error.response?.data?.message || error.message
					}`
				);
			}
			throw error;
		}
	}
}

export const friendService = new FriendService();
