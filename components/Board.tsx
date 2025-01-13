import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import Goal from "@/components/Goal";
import type {
	BoardDTO,
	Goal as GoalType,
	UpdateGoalDescriptionDTO,
} from "@/types";

interface BoardProps {
	board: BoardDTO;
	onUpdateGoals: (updates: UpdateGoalDescriptionDTO[]) => Promise<void>;
	onToggleComplete: (goalId: number, completed: boolean) => Promise<void>;
	canEdit: boolean;
}

const Board: React.FC<BoardProps> = ({
	board,
	onUpdateGoals,
	onToggleComplete,
	canEdit,
}) => {
	const [editMode, setEditMode] = useState(false);
	const [pendingUpdates, setPendingUpdates] = useState<{
		[goalId: number]: string;
	}>({});
	const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null);
	const [modalEdit, setModalEdit] = useState("");

	const calculateProgress = () => {
		const completedCount = board.goals.filter((goal) => goal.completed).length;
		return (completedCount / 25) * 100;
	};

	const handleSaveChanges = async () => {
		const updates = Object.entries(pendingUpdates).map(
			([goalId, description]) => ({
				goalId: Number(goalId),
				description,
			})
		);
		if (updates.length > 0) {
			await onUpdateGoals(updates);
		}
		setPendingUpdates({});
		setEditMode(false);
	};

	const handleCellClick = (goal: GoalType) => {
		setSelectedGoal(goal);
		if (editMode) {
			setModalEdit(pendingUpdates[goal.id] ?? goal.description);
		}
	};

	const handleUpdateGoalDescription = () => {
		if (selectedGoal !== null) {
			setPendingUpdates((prev) => ({
				...prev,
				[selectedGoal.id]: modalEdit,
			}));
			setSelectedGoal(null);
		}
	};

	const handleToggleComplete = async () => {
		if (selectedGoal) {
			await onToggleComplete(selectedGoal.id, !selectedGoal.completed);
			setSelectedGoal(null);
		}
	};

	// Ensure goals are sorted by position before rendering
	const sortedGoals = [...board.goals].sort((a, b) => a.position - b.position);

	return (
		<div className="space-y-4">
			{/* Board Grid */}
			<div className="aspect-square w-full max-w-3xl mx-auto">
				<Card className="h-full p-2 sm:p-4">
					<div className="grid grid-cols-5 gap-1 sm:gap-2 h-full">
						{sortedGoals.map((goal) => (
							<Goal
								key={goal.id}
								goal={{
									...goal,
									description: pendingUpdates[goal.id] ?? goal.description,
								}}
								onClick={() => handleCellClick(goal)}
								onToggleComplete={onToggleComplete} // Pass the function here
								editMode={editMode}
							/>
						))}
					</div>
				</Card>
			</div>

			{/* Edit Controls */}
			{canEdit && (
				<div className="flex items-center justify-between gap-4 max-w-3xl mx-auto">
					<Button
						variant={editMode ? "default" : "outline"}
						onClick={() => {
							setEditMode(!editMode);
							setPendingUpdates({});
						}}
						className={
							editMode ? "bg-gradient-to-r from-purple-600 to-pink-600" : ""
						}
					>
						{editMode ? "Cancel Editing" : "Edit Goals"}
					</Button>
					{editMode && (
						<Button
							onClick={handleSaveChanges}
							className="bg-gradient-to-r from-purple-600 to-pink-600"
						>
							Save Changes
						</Button>
					)}
				</div>
			)}

			{/* Progress Bar */}
			<div className="flex-1">
				<div className="h-2 sm:h-3 bg-gray-200 rounded-full overflow-hidden">
					<div
						className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
						style={{ width: `${calculateProgress()}%` }}
					/>
				</div>
			</div>

			{/* Goal Edit/Details Dialog */}
			<Dialog
				open={selectedGoal !== null}
				onOpenChange={() => setSelectedGoal(null)}
			>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>{editMode ? "Edit Goal" : "Goal Details"}</DialogTitle>
					</DialogHeader>
					<div className="p-4 space-y-4">
						{editMode ? (
							<>
								<Input
									value={modalEdit}
									onChange={(e) => setModalEdit(e.target.value)}
									className="w-full"
									autoFocus
								/>
								<div className="flex justify-end gap-2">
									<Button
										variant="outline"
										onClick={() => setSelectedGoal(null)}
									>
										Cancel
									</Button>
									<Button
										onClick={handleUpdateGoalDescription}
										className="bg-gradient-to-r from-purple-600 to-pink-600"
									>
										Update
									</Button>
								</div>
							</>
						) : (
							<>
								<div className="p-4 rounded-lg text-center bg-gray-100">
									<p className="text-sm sm:text-base">
										{selectedGoal?.description}
									</p>
								</div>
								{canEdit && (
									<Button
										onClick={handleToggleComplete}
										className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
									>
										{selectedGoal?.completed
											? "Mark Incomplete"
											: "Mark Complete"}
									</Button>
								)}
							</>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Board;
