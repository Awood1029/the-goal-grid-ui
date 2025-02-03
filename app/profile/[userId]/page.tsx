"use client";

import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	UserCircle,
	Users,
	UserPlus,
	Trophy,
	ClipboardList,
	Bell,
	UserMinus,
	Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { use } from "react";
import { PostCard } from "@/components/social/PostCard";
import Board from "@/components/Board";
import { FriendRequestCard } from "@/components/social/FriendRequestCard";
import { useState, useEffect, useCallback } from "react";
import { friendService } from "@/services/friendService";
import { FriendRequestDTO } from "@/types/user";
import { PostDTO } from "@/types/social";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { socialService } from "@/services/socialService";

interface ProfilePageProps {
	params: Promise<{
		userId: string;
	}>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
	const { userId } = use(params);
	const { user: currentUser } = useAuth();
	const { profile, loading, error, sendFriendRequest, refreshProfile } =
		useProfile(userId === "me" ? undefined : Number(userId));
	const [localPosts, setLocalPosts] = useState<PostDTO[]>([]);
	const [pendingRequests, setPendingRequests] = useState<FriendRequestDTO[]>(
		[]
	);
	const [loadingRequests, setLoadingRequests] = useState(false);
	const { toast } = useToast();

	// Update localPosts when profile changes
	useEffect(() => {
		if (profile?.recentPosts) {
			setLocalPosts(profile.recentPosts);
		}
	}, [profile?.recentPosts]);

	const handlePostUpdate = async (updatedPost: PostDTO) => {
		try {
			// Get the latest post data to ensure we have the most up-to-date reactions
			const latestPost = await socialService.getPost(updatedPost.id);
			setLocalPosts((prev) =>
				prev.map((p) => (p.id === latestPost.id ? latestPost : p))
			);
		} catch (error) {
			console.error("Error updating post:", error);
			toast({
				title: "Error",
				description: "Failed to update post",
				variant: "destructive",
			});
		}
	};

	const fetchPendingRequests = useCallback(async () => {
		try {
			setLoadingRequests(true);
			const requests = await friendService.getPendingFriendRequests();
			setPendingRequests(requests);
		} catch (err) {
			console.error("Failed to load friend requests:", err);
			toast({
				title: "Error",
				description: "Failed to load friend requests",
				variant: "destructive",
			});
		} finally {
			setLoadingRequests(false);
		}
	}, [toast]);

	useEffect(() => {
		if (
			currentUser &&
			(userId === "me" || currentUser.userId === Number(userId))
		) {
			fetchPendingRequests();
		}
	}, [currentUser, userId, fetchPendingRequests]);

	const handleAcceptRequest = async (requestId: number) => {
		try {
			await friendService.acceptFriendRequest(requestId);
			setPendingRequests((prev) =>
				prev.filter((request) => request.id !== requestId)
			);
			await refreshProfile();
			toast({
				description: "Friend request accepted",
			});
		} catch (err) {
			console.error("Failed to accept friend request:", err);
			toast({
				title: "Error",
				description: "Failed to accept friend request",
				variant: "destructive",
			});
		}
	};

	const handleDeclineRequest = async (requestId: number) => {
		try {
			await friendService.declineFriendRequest(requestId);
			setPendingRequests((prev) =>
				prev.filter((request) => request.id !== requestId)
			);
			toast({
				description: "Friend request declined",
			});
		} catch (err) {
			console.error("Failed to decline friend request:", err);
			toast({
				title: "Error",
				description: "Failed to decline friend request",
				variant: "destructive",
			});
		}
	};

	const handleSendFriendRequest = async (recipientId: number) => {
		try {
			await sendFriendRequest(recipientId);
			await refreshProfile();
		} catch (err) {
			console.error("Failed to send friend request:", err);
		}
	};

	const handleRemoveFriend = async () => {
		try {
			if (!profile) return;
			await friendService.removeFriend(profile.id);
			await refreshProfile();
			toast({
				description: "Friend removed successfully",
			});
		} catch (err) {
			console.error("Failed to remove friend:", err);
			toast({
				title: "Error",
				description: "Failed to remove friend",
				variant: "destructive",
			});
		}
	};

	if (loading) {
		return (
			<div className="container mx-auto p-6 space-y-6">
				<Card>
					<CardHeader>
						<div className="flex items-center gap-4">
							<Skeleton className="h-16 w-16 rounded-full" />
							<div className="space-y-2">
								<Skeleton className="h-6 w-48" />
								<Skeleton className="h-4 w-24" />
							</div>
						</div>
					</CardHeader>
				</Card>
				<Card>
					<CardContent className="p-6">
						<Skeleton className="h-64 w-full" />
					</CardContent>
				</Card>
			</div>
		);
	}

	if (error || !profile) {
		return (
			<div className="container mx-auto p-6">
				<Card>
					<CardContent className="p-6">
						<div className="text-center space-y-4">
							<p className="text-red-600 font-medium">
								{error || "Failed to load profile"}
							</p>
							<Button
								onClick={() => window.location.reload()}
								variant="outline"
							>
								Try Again
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	const displayName =
		profile.firstName && profile.lastName
			? `${profile.firstName} ${profile.lastName}`
			: profile.username;

	const isCurrentUser = currentUser?.userId === profile.id || userId === "me";
	const isFriend = profile.areFriends;
	const hasPendingRequest = profile.friendRequestPending;

	const renderFriendButton = () => {
		if (!currentUser || isCurrentUser) return null;

		if (isFriend) {
			return (
				<Button
					onClick={handleRemoveFriend}
					className="gap-2"
					variant="outline"
				>
					<UserMinus className="h-4 w-4" />
					Remove Friend
				</Button>
			);
		}

		if (hasPendingRequest) {
			return (
				<Button className="gap-2" variant="outline" disabled>
					<Clock className="h-4 w-4" />
					Request Pending
				</Button>
			);
		}

		return (
			<Button
				onClick={() => handleSendFriendRequest(profile.id)}
				className="gap-2"
				variant="outline"
			>
				<UserPlus className="h-4 w-4" />
				Add Friend
			</Button>
		);
	};

	return (
		<div className="container mx-auto p-6 space-y-6">
			{/* Profile Header */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<UserCircle className="h-16 w-16 text-gray-400" />
							<div>
								<h1 className="text-2xl font-bold">{displayName}</h1>
								<p className="text-gray-500">@{profile.username}</p>
							</div>
						</div>
						{renderFriendButton()}
					</div>
				</CardHeader>
			</Card>

			{/* Friend Requests Section (only shown on own profile) */}
			{isCurrentUser && pendingRequests.length > 0 && (
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<Bell className="h-5 w-5 text-blue-500" />
							<h2 className="text-lg font-semibold">
								Friend Requests ({pendingRequests.length})
							</h2>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						{loadingRequests ? (
							<div className="space-y-4">
								<Skeleton className="h-24 w-full" />
								<Skeleton className="h-24 w-full" />
							</div>
						) : (
							pendingRequests.map((request) => (
								<FriendRequestCard
									key={request.id}
									request={request}
									onAccept={handleAcceptRequest}
									onDecline={handleDeclineRequest}
								/>
							))
						)}
					</CardContent>
				</Card>
			)}

			{/* Stats Section */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<Trophy className="h-5 w-5 text-yellow-500" />
							<h2 className="text-lg font-semibold">Recent Achievement</h2>
						</div>
					</CardHeader>
					<CardContent>
						{profile.recentCompletedGoal ? (
							<div>
								<p className="font-medium">
									{profile.recentCompletedGoal.description}
								</p>
							</div>
						) : (
							<p className="text-gray-500">No recent achievements</p>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<ClipboardList className="h-5 w-5 text-blue-500" />
							<h2 className="text-lg font-semibold">Goals Completed</h2>
						</div>
					</CardHeader>
					<CardContent>
						<p className="text-3xl font-bold">{profile.totalCompletedGoals}</p>
					</CardContent>
				</Card>
			</div>

			{/* Board Section */}
			{profile.board && (
				<Card>
					<CardHeader>
						<h2 className="text-lg font-semibold">Current Goals</h2>
					</CardHeader>
					<CardContent>
						<Board
							board={profile.board}
							canEdit={false}
							onUpdateGoals={async () => {}}
							onToggleComplete={async () => {}}
						/>
					</CardContent>
				</Card>
			)}

			{/* Recent Posts */}
			{localPosts.length > 0 && (
				<Card>
					<CardHeader>
						<h2 className="text-lg font-semibold">Recent Activity</h2>
					</CardHeader>
					<CardContent className="space-y-4">
						{localPosts.map((post) => (
							<PostCard
								key={post.id}
								post={post}
								currentUserId={currentUser?.userId}
								onReactionAdded={handlePostUpdate}
								onPostUpdated={handlePostUpdate}
								onCommentAdded={handlePostUpdate}
								onPostDeleted={(postId) => {
									setLocalPosts((prev) => prev.filter((p) => p.id !== postId));
									toast({
										description: "Post deleted successfully",
									});
								}}
							/>
						))}
					</CardContent>
				</Card>
			)}

			{/* Friends List */}
			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<Users className="h-5 w-5" />
						<h2 className="text-lg font-semibold">
							Friends ({profile.friends?.length || 0})
						</h2>
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-2">
						{profile.friends?.map((friend) => (
							<Link
								key={friend.id}
								href={`/profile/${friend.id}`}
								className="block transition-colors hover:bg-gray-50"
							>
								<Card>
									<CardContent className="p-4">
										<div className="flex items-center gap-3">
											<UserCircle className="h-10 w-10 text-gray-400" />
											<div>
												<p className="font-semibold">
													{friend.firstName && friend.lastName
														? `${friend.firstName} ${friend.lastName}`
														: friend.username}
												</p>
												<p className="text-sm text-gray-500">
													@{friend.username}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							</Link>
						))}
						{(!profile.friends || profile.friends.length === 0) && (
							<p className="text-gray-500 col-span-2 text-center py-8">
								No friends yet
							</p>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
