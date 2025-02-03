import { useState, useEffect } from "react";
import { friendService } from "@/services/friendService";
import type { UserProfileDTO } from "@/types/user";
import { useToast } from "@/hooks/use-toast";

export function useProfile(userId?: number) {
	const [profile, setProfile] = useState<UserProfileDTO | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { toast } = useToast();

	const fetchProfile = async () => {
		try {
			setLoading(true);
			const data =
				userId !== undefined
					? await friendService.getUserProfile(userId)
					: await friendService.getCurrentUserProfile();
			setProfile(data);
			setError(null);
		} catch {
			setError("Failed to load profile");
			toast({
				title: "Error",
				description: "Failed to load profile",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	const sendFriendRequest = async (recipientId: number) => {
		try {
			await friendService.sendFriendRequest(recipientId);
			toast({
				description: "Friend request sent successfully",
			});
		} catch {
			toast({
				title: "Error",
				description: "Failed to send friend request",
				variant: "destructive",
			});
		}
	};

	useEffect(() => {
		fetchProfile();
	}, [userId]);

	return {
		profile,
		loading,
		error,
		sendFriendRequest,
		refreshProfile: fetchProfile,
	};
}
