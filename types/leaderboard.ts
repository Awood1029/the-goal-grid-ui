export interface LeaderboardEntry {
	userId: number;
	name: string;
	completedGoals: number;
	totalGoals: number;
}

export interface LeaderboardProps {
	entries: LeaderboardEntry[];
	className?: string;
}
