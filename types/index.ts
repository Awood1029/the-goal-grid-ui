export * from "./auth";
export * from "./user";
export * from "./board";
export * from "./group";
export * from "./leaderboard";
export * from "./props";
export * from "./social";

export interface LeaderboardEntry {
	userId: number;
	name: string;
	completedGoals: number;
	totalGoals: number;
}

export interface GroupStatsProps {
	totalMembers: number;
	totalGoalsCompleted: number;
	totalGoals: number;
	className?: string;
}
