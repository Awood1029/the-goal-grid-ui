"use client";

import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Trophy, Target } from "lucide-react";
import { socialService } from "@/services/socialService";
import type { GoalDTO } from "@/types";
import { cn } from "@/lib/utils";

interface CreatePostFormProps {
	goals?: GoalDTO[];
	onPostCreated?: () => void;
	className?: string;
	preselectedGoalId?: number;
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({
	goals = [],
	onPostCreated,
	className,
	preselectedGoalId,
}) => {
	const [content, setContent] = useState("");
	const [isProgressUpdate, setIsProgressUpdate] = useState(false);
	const [selectedGoalId, setSelectedGoalId] = useState<string>(
		preselectedGoalId?.toString() || ""
	);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async () => {
		if (!content.trim() || !selectedGoalId || isSubmitting) return;

		setIsSubmitting(true);
		try {
			await socialService.createPost(
				content,
				parseInt(selectedGoalId),
				isProgressUpdate
			);
			setContent("");
			setIsProgressUpdate(false);
			if (!preselectedGoalId) setSelectedGoalId("");
			onPostCreated?.();
		} catch (error) {
			console.error("Error creating post:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const selectedGoal = goals.find(
		(goal) => goal.id.toString() === selectedGoalId
	);

	return (
		<Card className={cn("w-full", className)}>
			<CardContent className="pt-6">
				{selectedGoal ? (
					<div className="mb-4 p-3 bg-purple-50 border border-purple-100 rounded-lg">
						<div className="flex items-center gap-2 text-sm text-purple-700 mb-2">
							<Target className="h-4 w-4" />
							<span className="font-medium">Selected Goal</span>
						</div>
						<p className="text-sm text-purple-900">
							{selectedGoal.description}
						</p>
					</div>
				) : (
					<div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
						<p className="text-sm text-amber-700">
							Please select a goal to post about. Your posts should be related
							to your goals.
						</p>
					</div>
				)}
				<Textarea
					placeholder={
						selectedGoal
							? "Share your thoughts or progress about this goal..."
							: "Select a goal first..."
					}
					value={content}
					onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
						setContent(e.target.value)
					}
					className="min-h-[100px] resize-none"
					disabled={!selectedGoal}
				/>
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
					<div className="flex items-center gap-2">
						<Switch
							id="progress-update"
							checked={isProgressUpdate}
							onCheckedChange={setIsProgressUpdate}
							disabled={!selectedGoal}
						/>
						<Label
							htmlFor="progress-update"
							className="flex items-center gap-1 cursor-pointer"
						>
							<Trophy className="h-4 w-4" />
							Progress Update
						</Label>
					</div>
					<Select
						value={selectedGoalId}
						onValueChange={setSelectedGoalId}
						disabled={!!preselectedGoalId}
					>
						<SelectTrigger className="w-full sm:w-[250px]">
							<SelectValue placeholder="Select a goal to post about" />
						</SelectTrigger>
						<SelectContent>
							{goals.map((goal) => (
								<SelectItem key={goal.id} value={goal.id.toString()}>
									{goal.description}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</CardContent>
			<CardFooter>
				<Button
					onClick={handleSubmit}
					disabled={!content.trim() || !selectedGoalId || isSubmitting}
					className="w-full sm:w-auto"
					variant="gradient"
				>
					{isProgressUpdate ? "Post Progress Update" : "Post"}
				</Button>
			</CardFooter>
		</Card>
	);
};
