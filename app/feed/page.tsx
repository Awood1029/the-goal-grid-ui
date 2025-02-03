"use client";

import React, { useEffect, useState } from "react";
import { Feed } from "@/components/social/Feed";
import { boardService } from "@/services/boardService";
import type { GoalDTO } from "@/types";
import { useAuth } from "@/context/AuthContext";

export default function FeedPage() {
	const { user } = useAuth();
	const [goals, setGoals] = useState<GoalDTO[]>([]);
	const [isLoadingGoals, setIsLoadingGoals] = useState(true);

	useEffect(() => {
		const loadGoals = async () => {
			try {
				const board = await boardService.getOrCreatePersonalBoard();
				setGoals(board.goals);
			} catch (error) {
				console.error("Error loading goals:", error);
			} finally {
				setIsLoadingGoals(false);
			}
		};

		if (user) {
			loadGoals();
		}
	}, [user]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4">
			<div className="max-w-2xl mx-auto space-y-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
						Your Feed
					</h1>
					<p className="text-gray-600">
						Stay updated with your community&apos;s progress
					</p>
				</div>
				{isLoadingGoals ? (
					<div className="flex justify-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
					</div>
				) : (
					<Feed type="main" goals={goals} />
				)}
			</div>
		</div>
	);
}
