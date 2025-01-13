"use client";

import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Board } from "@/types";

interface RenameBoardDialogProps {
	open: boolean;
	board: Board | null;
	onClose: () => void;
	onRename: (boardId: number, newName: string) => Promise<void>;
}

export default function RenameBoardDialog({
	open,
	board,
	onClose,
	onRename,
}: RenameBoardDialogProps) {
	const [boardName, setBoardName] = useState(board?.name || "");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleRename = async () => {
		if (!board || !boardName.trim()) return;

		try {
			setIsSubmitting(true);
			setError(null);
			await onRename(board.id, boardName.trim());
			onClose();
		} catch (err: any) {
			setError(err.message || "Failed to rename board");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Rename Board</DialogTitle>
					<DialogDescription>Update your board's name</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<label className="text-sm font-medium">Board Name</label>
						<Input
							value={boardName}
							onChange={(e) => setBoardName(e.target.value)}
							placeholder="Enter board name"
							disabled={isSubmitting}
						/>
					</div>
					{error && <p className="text-sm text-red-500">{error}</p>}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose} disabled={isSubmitting}>
						Cancel
					</Button>
					<Button
						onClick={handleRename}
						disabled={isSubmitting || !boardName.trim()}
						className="bg-gradient-to-r from-purple-600 to-pink-600"
					>
						{isSubmitting ? "Saving..." : "Save Changes"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
