import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { UserDTO } from "@/types";
import type { Board } from "@/types";

interface UserSelectorProps {
	users: UserDTO[];
	selectedUserId: number;
	onUserSelect: (userId: number) => void;
	boards: Board[];
	className?: string;
}

export const UserSelector: React.FC<UserSelectorProps> = ({
	users,
	selectedUserId,
	onUserSelect,
	boards,
	className,
}) => {
	return (
		<Card className={cn("p-4", className)}>
			<div className="flex flex-wrap gap-2">
				{users.map((user) => {
					const hasBoard = boards.some((board) => board.ownerId === user.id);
					return (
						<button
							key={user.id}
							onClick={() => onUserSelect(user.id)}
							className={cn(
								"px-4 py-2 rounded-full text-sm font-medium transition-all",
								"border hover:border-purple-500",
								selectedUserId === user.id
									? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent"
									: "bg-white text-gray-700",
								!hasBoard && "opacity-50 cursor-not-allowed"
							)}
							disabled={!hasBoard}
						>
							{user.firstName} {user.lastName}
						</button>
					);
				})}
			</div>
		</Card>
	);
};

export default UserSelector;
