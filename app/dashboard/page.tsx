"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useBoard } from "@/hooks/board/useBoard";
import Board from "@/components/Board";
import Loading from "@/components/Loading";
import CreateBoardDialog from "@/dialogs/CreateBoardDialog";
import RenameBoardDialog from "@/dialogs/RenameBoardDialog";
import { UpdateGoalDescriptionDTO } from "@/types";

export default function DashboardPage() {
	const { user } = useAuth();
	const { board, getBoard, createBoard, renameBoard, updateGoals } = useBoard();
	const [loading, setLoading] = useState(true);
	const [showCreateBoardDialog, setShowCreateBoardDialog] = useState(false);
	const [showRenameBoardDialog, setShowRenameBoardDialog] = useState(false);

	useEffect(() => {
		if (user) {
			loadBoard();
		}
	}, [user]);

	const loadBoard = async () => {
		try {
			setLoading(true);
			await getBoard();
		} catch (err) {
			console.error("Failed to load board:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateGoals = async (updates: UpdateGoalDescriptionDTO[]) => {
		if (!board) return; // Ensure the board is loaded
		try {
			await updateGoals(board.id, updates); // Pass boardId and updates
		} catch (err) {
			console.error("Failed to update goals:", err);
		}
	};

	if (loading) return <Loading />;

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4">
			<div className="max-w-6xl mx-auto space-y-6">
				{!board ? (
					<div className="text-center">
						<p>You don’t have a board yet. Create one to get started!</p>
						<button
							onClick={() => setShowCreateBoardDialog(true)}
							className="bg-gradient-to-r from-purple-600 to-pink-600"
						>
							Create Board
						</button>
					</div>
				) : (
					<Board
						board={board}
						onUpdateGoals={handleUpdateGoals} // Pass the new function
						canEdit={true}
					/>
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
