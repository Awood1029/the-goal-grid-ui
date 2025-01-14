import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import type { LeaderboardProps } from "@/types";

export const Leaderboard = ({ entries, className }: LeaderboardProps) => {
	const sortedEntries = [...entries].sort(
		(a, b) => b.completedGoals - a.completedGoals
	);

	return (
		<Card className={className}>
			<CardHeader className="p-4">
				<CardTitle className="flex items-center gap-2 text-lg">
					<Trophy className="h-5 w-5 text-yellow-500" />
					<span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
						Leaderboard
					</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="p-4">
				<div className="space-y-3">
					{sortedEntries.map((entry, index) => (
						<div
							key={entry.userId}
							className={`
                flex items-center justify-between p-3 rounded-lg transition-colors
                ${
									index === 0
										? "bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200"
										: index === 1
										? "bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200"
										: index === 2
										? "bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200"
										: "bg-white border border-gray-100 hover:bg-gray-50"
								}
              `}
						>
							<div className="flex items-center gap-4">
								<span
									className={`w-6 text-center font-bold ${
										index === 0
											? "text-yellow-600"
											: index === 1
											? "text-gray-600"
											: index === 2
											? "text-orange-600"
											: "text-gray-400"
									}`}
								>
									{index + 1}
								</span>
								<div>
									<div className="font-medium">{entry.name}</div>
									<div className="text-sm text-gray-600">
										{entry.completedGoals}/{entry.totalGoals} goals
									</div>
								</div>
							</div>
							<div className="text-sm font-medium text-gray-600">
								{Math.round((entry.completedGoals / entry.totalGoals) * 100)}%
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};

export default Leaderboard;
