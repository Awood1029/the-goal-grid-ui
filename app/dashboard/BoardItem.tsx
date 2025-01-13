import React from "react";
import BoardItem from "./BoardItem";
import { Board } from "@/types";

interface BoardListProps {
	boards: Board[];
}

export default function BoardList({ boards }: BoardListProps) {
	if (boards.length === 0) {
		return <div>No boards yet. Create one to get started!</div>;
	}

	return (
		<div className="grid gap-6">
			{boards.map((board) => (
				<BoardItem key={board.id} board={board} />
			))}
		</div>
	);
}
