"use client";

import React, { useState } from "react";

interface CreateBoardDialogProps {
	open: boolean;
	onClose: () => void;
	onCreate: (boardName: string) => Promise<void>;
}

export default function CreateBoardDialog({
	open,
	onClose,
	onCreate,
}: CreateBoardDialogProps) {
	const [boardName, setBoardName] = useState("");

	const handleSubmit = async () => {
		await onCreate(boardName);
		setBoardName("");
		onClose();
	};

	if (!open) return null;

	return (
		<div className="dialog">
			<div className="dialog-content">
				<h2>Create New Board</h2>
				<input
					value={boardName}
					onChange={(e) => setBoardName(e.target.value)}
					placeholder="Board Name"
					className="input"
				/>
				<button onClick={onClose}>Cancel</button>
				<button onClick={handleSubmit} disabled={!boardName.trim()}>
					Create
				</button>
			</div>
		</div>
	);
}
