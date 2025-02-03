import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import type { LeaderboardEntry } from "@/types";
import { cn } from "@/lib/utils";
import { UserLink } from "@/components/social/UserLink";

interface GroupLeaderboardProps {
	entries: LeaderboardEntry[];
	className?: string;
}

export const GroupLeaderboard: React.FC<GroupLeaderboardProps> = ({
	entries,
	className,
}) => {
	const sortedEntries = [...entries].sort(
		(a, b) => b.completedGoals - a.completedGoals
	);

	return (
		<Card className={cn("", className)}>
			<CardHeader className="p-4">
				<CardTitle className="flex items-center gap-2 text-sm sm:text-base">
					<Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
					<span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
						Leaderboard
					</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="p-4">
				<div className="space-y-2 sm:space-y-3">
					{sortedEntries.map((entry, index) => (
						<div
							key={entry.userId}
							className={cn(
								"flex items-center justify-between p-3 rounded-lg border",
								index === 0
									? "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200"
									: index === 1
									? "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200"
									: index === 2
									? "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200"
									: "bg-white border-gray-100"
							)}
						>
							<div className="flex items-center gap-2 sm:gap-4">
								<span className="w-4 sm:w-6 text-center font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-sm sm:text-base">
									{index + 1}
								</span>
								<div>
									<div className="font-medium text-sm sm:text-base">
										<UserLink user={entry.user} className="font-medium" />
									</div>
									<div className="text-xs sm:text-sm text-gray-600">
										{entry.completedGoals}/{entry.totalGoals} goals
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

export default GroupLeaderboard;
