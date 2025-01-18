"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useBoard } from "@/hooks/board/useBoard";
import Board from "@/components/Board";
import Loading from "@/components/Loading";
import CreateBoardDialog from "@/dialogs/CreateBoardDialog";
import RenameBoardDialog from "@/dialogs/RenameBoardDialog";
import { GoalUpdateDTO } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Target, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
	const { user, isInitialized } = useAuth();
	const router = useRouter();
	const { board, getBoard, createBoard, renameBoard, updateGoals } = useBoard();
	const [showCreateBoardDialog, setShowCreateBoardDialog] = useState(false);
	const [showRenameBoardDialog, setShowRenameBoardDialog] = useState(false);

	const loadBoard = useCallback(async () => {
		try {
			await getBoard();
		} catch (err) {
			console.error("Failed to load board:", err);
		}
	}, [getBoard]);

	useEffect(() => {
		if (isInitialized && !user) {
			router.replace("/login");
		}
	}, [isInitialized, user, router]);

	useEffect(() => {
		if (isInitialized && user) {
			loadBoard();
		}
	}, [isInitialized, user, loadBoard]);

	const handleUpdateGoals = async (updates: GoalUpdateDTO[]) => {
		if (!board) return;
		try {
			await updateGoals(board.id, updates);
		} catch (err) {
			console.error("Failed to update goals:", err);
		}
	};

	const handleToggleComplete = async (goalId: number, completed: boolean) => {
		if (!board) return;
		try {
			await updateGoals(board.id, [{ goalId, completed }]);
		} catch (err) {
			console.error("Failed to toggle goal completion:", err);
		}
	};

	const getCompletionStats = () => {
		if (!board) return { completed: 0, total: 0, percentage: 0 };
		const completed = board.goals.filter((g) => g.completed).length;
		const total = board.goals.length;
		const percentage = Math.round((completed / total) * 100);
		return { completed, total, percentage };
	};

	if (!isInitialized || !user) {
		return <Loading />;
	}

	const stats = getCompletionStats();
	const timeOfDay = new Date().getHours();
	const greeting =
		timeOfDay < 12
			? "Good morning"
			: timeOfDay < 18
			? "Good afternoon"
			: "Good evening";

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4">
			<div className="max-w-6xl mx-auto space-y-6">
				<div className="text-center space-y-2">
					<h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
						{greeting}, {user?.firstName}! 👋
					</h1>
					<p className="text-gray-600">
						Your journey to greatness continues. Keep pushing forward!
					</p>
				</div>

				{!board ? (
					<div className="text-center mt-8">
						<p className="text-gray-600 mb-4">
							You don&apos;t have a board yet. Create one to get started!
						</p>
						<button
							onClick={() => setShowCreateBoardDialog(true)}
							className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
						>
							Create Board
						</button>
					</div>
				) : (
					<>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<Card className="bg-white/50 backdrop-blur-sm">
								<CardContent className="pt-6">
									<div className="flex items-center gap-3">
										<Target className="h-8 w-8 text-purple-600" />
										<div>
											<p className="text-sm text-gray-600">Total Goals</p>
											<p className="text-2xl font-bold">{stats.total}</p>
										</div>
									</div>
								</CardContent>
							</Card>
							<Card className="bg-white/50 backdrop-blur-sm">
								<CardContent className="pt-6">
									<div className="flex items-center gap-3">
										<CheckCircle2 className="h-8 w-8 text-green-600" />
										<div>
											<p className="text-sm text-gray-600">Completed</p>
											<p className="text-2xl font-bold">{stats.completed}</p>
										</div>
									</div>
								</CardContent>
							</Card>
							<Card className="bg-white/50 backdrop-blur-sm">
								<CardContent className="pt-6">
									<div className="flex items-center gap-3">
										<Trophy className="h-8 w-8 text-yellow-600" />
										<div>
											<p className="text-sm text-gray-600">Completion Rate</p>
											<p className="text-2xl font-bold">{stats.percentage}%</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						<Board
							board={board}
							onUpdateGoals={handleUpdateGoals}
							onToggleComplete={handleToggleComplete}
							canEdit={true}
						/>
					</>
				)}
			</div>

			{/* Dialogs */}
			<CreateBoardDialog
				open={showCreateBoardDialog}
				onClose={() => setShowCreateBoardDialog(false)}
				onCreate={createBoard}
			/>
			<RenameBoardDialog
				open={showRenameBoardDialog}
				board={board}
				onClose={() => setShowRenameBoardDialog(false)}
				onRename={renameBoard}
			/>
		</div>
	);
}
