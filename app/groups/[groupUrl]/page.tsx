"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Share2, Copy } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { groupService } from "@/services/groupService";
import { boardService } from "@/services/boardService";
import { UserSelector } from "@/components/UserSelector";
import { GroupStats } from "@/components/GroupStats";
import { GroupLeaderboard } from "@/components/GroupLeaderboard";
import Board from "@/components/Board";
import { UserLink } from "@/components/social/UserLink";
import { Feed } from "@/components/social/Feed";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import type { GroupDTO, Board as BoardType, GoalUpdateDTO } from "@/types";

export default function GroupPage() {
	const params = useParams();
	const { user } = useAuth();
	const [currentGroup, setCurrentGroup] = useState<GroupDTO | null>(null);
	const [groupBoards, setGroupBoards] = useState<BoardType[]>([]);
	const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
	const [showInviteDialog, setShowInviteDialog] = useState(false);
	const [creatingBoard, setCreatingBoard] = useState(false);
	const [loading, setLoading] = useState(true);

	const groupUrl = typeof params?.groupUrl === "string" ? params.groupUrl : "";

	const loadGroupData = useCallback(async () => {
		try {
			const [group, boards] = await Promise.all([
				groupService.getGroupByUrl(groupUrl),
				groupService.getGroupBoards(groupUrl),
			]);
			setCurrentGroup(group);
			setGroupBoards(boards);
		} catch (err) {
			console.error("Error loading group data:", err);
		} finally {
			setLoading(false);
		}
	}, [groupUrl]);

	useEffect(() => {
		if (groupUrl) {
			loadGroupData();
		}
	}, [groupUrl, loadGroupData]);

	useEffect(() => {
		if (user?.userId && !selectedUserId) {
			setSelectedUserId(user.userId);
		}
	}, [user, selectedUserId]);

	const handleUpdateGoals = async (updates: GoalUpdateDTO[]) => {
		try {
			await Promise.all(
				updates.map(async (update) => {
					if (update.description !== undefined) {
						await boardService.updateGoalDescription(
							update.goalId,
							update.description
						);
					}
					if (update.completed !== undefined) {
						await boardService.updateGoalStatus(
							update.goalId,
							update.completed
						);
					}
				})
			);
			await loadGroupData();
		} catch (err) {
			console.error("Error updating goals:", err);
		}
	};

	const handleToggleComplete = async (goalId: number, completed: boolean) => {
		try {
			await boardService.updateGoalStatus(goalId, completed);
			await loadGroupData();
		} catch (err) {
			console.error("Error toggling goal completion:", err);
		}
	};

	const handleCopyInvite = async () => {
		if (currentGroup?.inviteCode) {
			await navigator.clipboard.writeText(currentGroup.inviteCode);
		}
	};

	const handleCreateBoard = async () => {
		if (!groupUrl || !user) return;
		setCreatingBoard(true);
		try {
			await boardService.createBoard(`${user.firstName}'s Board`);
			await loadGroupData();
		} catch (err) {
			console.error("Error creating board:", err);
		} finally {
			setCreatingBoard(false);
		}
	};

	if (loading || !currentGroup) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
			</div>
		);
	}

	// Sort users to put current user first
	const sortedUsers = [...currentGroup.users].sort((a, b) => {
		if (a.id === user?.userId) return -1;
		if (b.id === user?.userId) return 1;
		return 0;
	});

	const displayedBoard =
		groupBoards.find((b) => b.ownerId === selectedUserId) || null;
	const hasUserBoard = groupBoards.some((b) => b.ownerId === user?.userId);

	// Calculate completion stats for leaderboard
	const leaderboardEntries = currentGroup.users.map((user) => {
		const userBoard = groupBoards.find((b) => b.ownerId === user.id);
		const completedGoals =
			userBoard?.goals.filter((g) => g.completed).length || 0;
		return {
			userId: user.id,
			user,
			name: `${user.firstName} ${user.lastName}`,
			completedGoals,
			totalGoals: userBoard?.goals.length || 25,
		};
	});

	const totalGoalsCompleted = groupBoards.reduce(
		(total, board) => total + board.goals.filter((g) => g.completed).length,
		0
	);

	const totalGoals = groupBoards.reduce(
		(total, board) => total + board.goals.length,
		0
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-8">
			<ScrollToTop />
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center space-y-2 mb-8">
					<h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
						{currentGroup.name}
					</h1>
					<p className="text-sm sm:text-base text-gray-600">
						Transform your dreams into achievements! ✨
					</p>
					<div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4">
						<Button
							variant="outline"
							onClick={() => setShowInviteDialog(true)}
							className="flex items-center gap-2 text-sm sm:text-base border-purple-600 text-purple-600 hover:bg-purple-50"
						>
							<Share2 className="h-4 w-4" />
							Invite Members
						</Button>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
					<div className="lg:col-span-8 space-y-6">
						<GroupStats
							totalMembers={currentGroup.users.length}
							totalGoalsCompleted={totalGoalsCompleted}
							totalGoals={totalGoals}
						/>

						<UserSelector
							users={sortedUsers}
							selectedUserId={selectedUserId ?? 0}
							onUserSelect={setSelectedUserId}
							boards={groupBoards}
						/>

						{displayedBoard ? (
							<Card className="p-4 sm:p-6 relative overflow-hidden">
								<div className="relative">
									<h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-900">
										{(() => {
											const boardUser = currentGroup.users.find(
												(u) => u.id === selectedUserId
											);
											if (!boardUser) {
												return <span className="font-semibold">Board</span>;
											}
											return (
												<UserLink user={boardUser} className="font-semibold" />
											);
										})()}
										&apos;s Board
									</h2>
									<Board
										board={displayedBoard}
										onUpdateGoals={handleUpdateGoals}
										onToggleComplete={handleToggleComplete}
										canEdit={user?.userId === selectedUserId}
									/>
								</div>
							</Card>
						) : (
							!hasUserBoard &&
							user?.userId === selectedUserId && (
								<div className="text-center space-y-4 mt-8">
									<p className="text-gray-600">
										You do not have a board in this group yet.
									</p>
									<Button
										onClick={handleCreateBoard}
										disabled={creatingBoard}
										className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
									>
										{creatingBoard ? "Creating Board..." : "Create Board"}
									</Button>
								</div>
							)
						)}

						<div className="mt-8 pt-8 border-t border-gray-200">
							<h2 className="text-lg sm:text-xl font-semibold mb-6 text-gray-900">
								Group Activity
							</h2>
							<Feed
								type="group"
								groupUniqueCode={groupUrl}
								goals={groupBoards.flatMap((board) => board.goals)}
								hidePostCreation={true}
								className="mb-6"
							/>
						</div>
					</div>

					<div className="lg:col-span-4">
						<div className="sticky top-6">
							<GroupLeaderboard entries={leaderboardEntries} />
						</div>
					</div>
				</div>

				<Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>Invite Members</DialogTitle>
						</DialogHeader>
						<div className="flex items-center gap-2 p-2 sm:p-4">
							<Input
								value={currentGroup.inviteCode}
								readOnly
								className="font-mono text-sm"
							/>
							<Button onClick={handleCopyInvite} variant="outline">
								<Copy className="h-4 w-4" />
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
