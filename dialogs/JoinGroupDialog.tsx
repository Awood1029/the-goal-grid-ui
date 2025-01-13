"use client";

import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface JoinGroupDialogProps {
	open: boolean;
	onClose: () => void;
	onJoin: (inviteCode: string) => Promise<void>;
}

export default function JoinGroupDialog({
	open,
	onClose,
	onJoin,
}: JoinGroupDialogProps) {
	const [inviteCode, setInviteCode] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleJoin = async () => {
		if (!inviteCode.trim()) return;

		try {
			setIsSubmitting(true);
			setError(null);
			await onJoin(inviteCode.trim());
			onClose();
		} catch (err: any) {
			setError(err.message || "Failed to join group");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Join Group</DialogTitle>
					<DialogDescription>
						Enter an invite code to join an existing group.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<label className="text-sm font-medium">Invite Code</label>
						<Input
							value={inviteCode}
							onChange={(e) => setInviteCode(e.target.value)}
							placeholder="Enter invite code"
							disabled={isSubmitting}
						/>
					</div>
					{error && <p className="text-sm text-red-500">{error}</p>}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={onClose} disabled={isSubmitting}>
						Cancel
					</Button>
					<Button
						onClick={handleJoin}
						disabled={isSubmitting || !inviteCode.trim()}
						className="bg-gradient-to-r from-purple-600 to-pink-600"
					>
						{isSubmitting ? "Joining..." : "Join Group"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
