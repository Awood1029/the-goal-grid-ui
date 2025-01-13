import { useState } from "react";
import { boardService } from "@/services/boardService";
import type { BoardDTO, UpdateGoalDescriptionDTO } from "@/types";

export function useBoard() {
	const [board, setBoard] = useState<BoardDTO | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleError = (err: any) => {
		console.error("Board Error:", err);
		setError(err?.message || "An unexpected error occurred");
	};

	const getBoard = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const fetchedBoard = await boardService.getOrCreatePersonalBoard();
			setBoard(fetchedBoard);
		} catch (err) {
			handleError(err);
		} finally {
			setIsLoading(false);
		}
	};

	const createBoard = async () => {
		setIsLoading(true);
		setError(null);
		try {
			const newBoard = await boardService.getOrCreatePersonalBoard();
			setBoard(newBoard);
		} catch (err) {
			handleError(err);
		} finally {
			setIsLoading(false);
		}
	};

	const renameBoard = async (boardId: number, newName: string) => {
		setIsLoading(true);
		setError(null);
		try {
			const updatedBoard = await boardService.updateBoardName(boardId, newName);
			setBoard(updatedBoard);
		} catch (err) {
			handleError(err);
		} finally {
			setIsLoading(false);
		}
	};

	const updateGoals = async (
		boardId: number,
		updates: UpdateGoalDescriptionDTO[]
	) => {
		setIsLoading(true);
		setError(null);
		try {
			const updatedBoard = await boardService.bulkUpdateGoals(boardId, updates);
			setBoard(updatedBoard);
		} catch (err) {
			handleError(err);
		} finally {
			setIsLoading(false);
		}
	};

	const resetError = () => setError(null);

	return {
		board,
		error,
		isLoading,
		getBoard,
		createBoard,
		renameBoard,
		updateGoals,
		resetError,
	};
}
