import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle, ExternalLink } from "lucide-react";
import Board from "@/components/Board";
import Link from "next/link";
import type { BoardDTO } from "@/types/board";
import type { UserDTO } from "@/types/user";

interface UserBoardCardProps {
	user: UserDTO;
	board?: BoardDTO | null;
}

export function UserBoardCard({ user, board }: UserBoardCardProps) {
	const displayName =
		user.firstName && user.lastName
			? `${user.firstName} ${user.lastName}`
			: user.username;

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<div className="flex items-center gap-3">
					<UserCircle className="h-10 w-10 text-gray-400" />
					<div>
						<h3 className="font-semibold">{displayName}</h3>
						<p className="text-sm text-gray-500">@{user.username}</p>
					</div>
				</div>
				<Link href={`/profile/${user.id}`}>
					<Button variant="ghost" size="sm" className="gap-2">
						<ExternalLink className="h-4 w-4" />
						View Profile
					</Button>
				</Link>
			</CardHeader>
			<CardContent>
				{board ? (
					<Board
						board={board}
						canEdit={false}
						onUpdateGoals={async () => {}}
						onToggleComplete={async () => {}}
					/>
				) : (
					<div className="text-center text-gray-500 py-4">
						No board available
					</div>
				)}
			</CardContent>
		</Card>
	);
}
