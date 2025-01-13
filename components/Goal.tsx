import React from "react";
import { Star } from "lucide-react";
import type { Goal as GoalType } from "@/types";
import { Button } from "./ui/button";

interface GoalProps {
	goal: GoalType;
	onClick: () => void;
	onToggleComplete: (goalId: number, completed: boolean) => void; // Updated type
	editMode: boolean;
}

const Goal: React.FC<GoalProps> = ({
	goal,
	onClick,
	onToggleComplete,
	editMode,
}) => {
	return (
		<div
			onClick={onClick}
			className={`aspect-square p-1 sm:p-2 rounded-lg cursor-pointer flex items-center justify-center text-center
        transition-all duration-300 relative overflow-hidden ${
					goal.completed
						? "bg-gradient-to-br from-purple-100 to-pink-100 border-purple-200 border text-purple-800"
						: "bg-white hover:shadow-lg border border-gray-200"
				}`}
		>
			<div className="w-full h-full flex items-center justify-center text-xs sm:text-sm overflow-hidden">
				<span className="line-clamp-3">{goal.description}</span>
			</div>
			{goal.completed && (
				<Star className="absolute top-0.5 right-0.5 h-2 w-2 sm:h-3 sm:w-3 text-yellow-500" />
			)}
		</div>
	);
};

export default Goal;
