"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Users, ExternalLink } from "lucide-react";
import { groupService } from "@/services/groupService";
import type { GroupDTO } from "@/types";

export default function GroupsPage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen flex items-center justify-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
				</div>
			}
		>
			<GroupsContent />
		</Suspense>
	);
}

function GroupsContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [groups, setGroups] = useState<GroupDTO[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const [showJoinDialog, setShowJoinDialog] = useState(false);
	const [groupName, setGroupName] = useState("");
	const [inviteCode, setInviteCode] = useState("");
	const [joinError, setJoinError] = useState<string | null>(null);

	useEffect(() => {
		const inviteParam = searchParams.get("invite");
		if (inviteParam) {
			setInviteCode(inviteParam);
			setShowJoinDialog(true);
		}
	}, [searchParams]);

	useEffect(() => {
		loadGroups();
	}, []);

	const loadGroups = async () => {
		try {
			setLoading(true);
			const userGroups = await groupService.getGroupsByUser();
			setGroups(userGroups);
		} catch (err) {
			console.error("Error loading groups:", err);
			setError("Failed to load groups");
		} finally {
			setLoading(false);
		}
	};

	const handleCreateGroup = async () => {
		if (!groupName.trim()) return;
		try {
			const group = await groupService.createGroup(groupName);
			setShowCreateDialog(false);
			setGroupName("");
			router.push(`/groups/${group.uniqueUrl}`);
		} catch (err) {
			console.error("Error creating group:", err);
		}
	};

	const handleJoinGroup = async () => {
		if (!inviteCode.trim()) return;
		setJoinError(null);
		try {
			const group = await groupService.joinGroupByInvite(inviteCode);
			setShowJoinDialog(false);
			setInviteCode("");
			if (group?.uniqueUrl) {
				router.push(`/groups/${group.uniqueUrl}`);
			} else {
				setJoinError("Failed to get group details after joining");
			}
		} catch (error) {
			console.error("Error joining group:", error);
			if (error instanceof Error) {
				setJoinError(error.message);
			} else {
				setJoinError("Failed to join group");
			}
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4">
			<div className="max-w-4xl mx-auto space-y-6">
				<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
					<div>
						<h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text text-center sm:text-left">
							Your Groups
						</h1>
						<p className="text-gray-600 text-center sm:text-left">
							Manage and join goal-sharing groups
						</p>
					</div>
					<div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-start">
						<Button
							onClick={() => setShowJoinDialog(true)}
							variant="outline"
							className="flex-1 sm:flex-initial"
						>
							Join Group
						</Button>
						<Button
							onClick={() => setShowCreateDialog(true)}
							className="bg-gradient-to-r from-purple-600 to-pink-600 flex-1 sm:flex-initial"
						>
							<Plus className="mr-2 h-4 w-4" />
							Create Group
						</Button>
					</div>
				</div>

				{error && (
					<Alert variant="destructive">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
					{groups.map((group: GroupDTO) => (
						<Card
							key={group.id}
							className="hover:shadow-lg transition-shadow cursor-pointer"
							onClick={() => router.push(`/groups/${group.uniqueUrl}`)}
						>
							<CardHeader className="space-y-2">
								<CardTitle className="flex justify-between items-start gap-2">
									<span className="truncate">{group.name}</span>
									<Button variant="ghost" size="sm" className="shrink-0">
										<ExternalLink className="h-4 w-4" />
									</Button>
								</CardTitle>
								<CardDescription className="flex items-center gap-1">
									<Users className="h-4 w-4 shrink-0" />
									<span className="truncate">
										{group.users?.length || 0}{" "}
										{group.users?.length === 1 ? "member" : "members"}
									</span>
								</CardDescription>
							</CardHeader>
						</Card>
					))}
				</div>

				{groups.length === 0 && !loading && (
					<Card className="p-6">
						<div className="text-center space-y-4">
							<p className="text-gray-600">
								You haven&apos;t joined any groups yet.
							</p>
							<div className="flex justify-center gap-2">
								<Button
									variant="outline"
									onClick={() => setShowJoinDialog(true)}
								>
									Join a Group
								</Button>
								<Button
									onClick={() => setShowCreateDialog(true)}
									className="bg-gradient-to-r from-purple-600 to-pink-600"
								>
									Create Your First Group
								</Button>
							</div>
						</div>
					</Card>
				)}

				<Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create New Group</DialogTitle>
							<DialogDescription>
								Create a new group to share and track goals together.
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4 py-4">
							<div className="space-y-2">
								<label className="text-sm font-medium">Group Name</label>
								<Input
									value={groupName}
									onChange={(e) => setGroupName(e.target.value)}
									placeholder="Enter group name"
								/>
							</div>
						</div>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setShowCreateDialog(false)}
							>
								Cancel
							</Button>
							<Button
								onClick={handleCreateGroup}
								disabled={!groupName.trim()}
								className="bg-gradient-to-r from-purple-600 to-pink-600"
							>
								Create Group
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				<Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
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
								/>
								{joinError && (
									<p className="text-sm text-red-500 mt-1">{joinError}</p>
								)}
							</div>
						</div>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setShowJoinDialog(false)}
							>
								Cancel
							</Button>
							<Button
								onClick={handleJoinGroup}
								disabled={!inviteCode.trim()}
								className="bg-gradient-to-r from-purple-600 to-pink-600"
							>
								Join Group
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
