import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Trophy } from "lucide-react";
import type { GroupStatsProps } from "@/types";
import { cn } from "@/lib/utils";

export const GroupStats: React.FC<GroupStatsProps> = ({
	totalMembers,
	totalGoalsCompleted,
	totalGoals,
	className,
}) => {
	const completionPercentage = Math.round(
		(totalGoalsCompleted / totalGoals) * 100
	);

	return (
		<div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
			<Card>
				<CardContent className="pt-6">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-purple-100 rounded-lg">
							<Users className="h-5 w-5 text-purple-600" />
						</div>
						<div>
							<div className="text-sm font-medium text-gray-500">Members</div>
							<div className="text-2xl font-bold">{totalMembers}</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className="pt-6">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-pink-100 rounded-lg">
							<Target className="h-5 w-5 text-pink-600" />
						</div>
						<div>
							<div className="text-sm font-medium text-gray-500">
								Goals Completed
							</div>
							<div className="text-2xl font-bold">
								{totalGoalsCompleted}/{totalGoals}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardContent className="pt-6">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-yellow-100 rounded-lg">
							<Trophy className="h-5 w-5 text-yellow-600" />
						</div>
						<div>
							<div className="text-sm font-medium text-gray-500">
								Completion Rate
							</div>
							<div className="text-2xl font-bold">{completionPercentage}%</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default GroupStats;
