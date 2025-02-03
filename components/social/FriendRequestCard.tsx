"use client";

import { FriendRequestDTO } from "@/types/user";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle, Check, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface FriendRequestCardProps {
	request: FriendRequestDTO;
	onAccept: (requestId: number) => Promise<void>;
	onDecline: (requestId: number) => Promise<void>;
}

export function FriendRequestCard({
	request,
	onAccept,
	onDecline,
}: FriendRequestCardProps) {
	const displayName =
		request.sender.firstName && request.sender.lastName
			? `${request.sender.firstName} ${request.sender.lastName}`
			: request.sender.username;

	return (
		<Card>
			<CardContent className="p-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<UserCircle className="h-10 w-10 text-gray-400" />
						<div>
							<p className="font-semibold">{displayName}</p>
							<p className="text-sm text-gray-500">
								@{request.sender.username}
							</p>
							<p className="text-xs text-gray-400">
								Sent {formatDistanceToNow(new Date(request.createdAt))} ago
							</p>
						</div>
					</div>
					<div className="flex gap-2">
						<Button
							size="sm"
							variant="outline"
							className="text-green-600 hover:text-green-700 hover:bg-green-50"
							onClick={() => onAccept(request.id)}
						>
							<Check className="h-4 w-4" />
						</Button>
						<Button
							size="sm"
							variant="outline"
							className="text-red-600 hover:text-red-700 hover:bg-red-50"
							onClick={() => onDecline(request.id)}
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
