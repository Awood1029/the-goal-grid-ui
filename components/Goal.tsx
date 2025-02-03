import React, { useState, useRef } from "react";
import type { Goal as GoalType } from "@/types";
import { Confetti } from "@/components/Confetti";

interface GoalProps {
	goal: GoalType;
	onClick: () => void;
}

const Goal: React.FC<GoalProps> = ({ goal, onClick }) => {
	const [showConfetti, setShowConfetti] = useState(false);
	const previousCompletedRef = useRef(goal.completed);

	// Keep track of completion state changes to trigger confetti
	React.useEffect(() => {
		// Only show confetti when transitioning from incomplete to complete
		if (goal.completed && !previousCompletedRef.current) {
			setShowConfetti(true);
			setTimeout(() => setShowConfetti(false), 3000);
		}
		previousCompletedRef.current = goal.completed;
	}, [goal.completed]);

	return (
		<>
			{showConfetti && (
				<div className="fixed inset-0 z-50 pointer-events-none">
					<Confetti colors={["#9333ea", "#db2777", "#fcd34d", "#4f46e5"]} />
				</div>
			)}
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
			</div>
		</>
	);
};

export default Goal;
