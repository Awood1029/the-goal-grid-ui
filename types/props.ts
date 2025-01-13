import { Goal, Board } from "./board";
import { User } from "./user";

export interface GoalGridProps {
	board: {
		goals: Goal[];
		// ... other board properties
	};
	onUpdateGoal: (
		goalId: number,
		updates: { description?: string; completed?: boolean }
	) => Promise<void>;
	onToggleComplete: (goalId: number) => void;
	isCurrentUser?: boolean;
}

export interface ConfettiProps {
	colors: string[];
}

export interface ProgressBarProps {
	progress: number;
	className?: string;
}

export interface UserSelectorProps {
	users: User[];
	selectedUserId: number;
	onUserSelect: (userId: number) => void;
	boards: Board[];
}

export interface GroupStatsProps {
	totalMembers: number;
	totalGoalsCompleted: number;
	totalGoals: number;
}
