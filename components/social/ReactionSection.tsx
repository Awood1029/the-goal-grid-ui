import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { socialService } from "@/services/socialService";
import { useToast } from "@/hooks/use-toast";
import type { ReactionDTO, ReactionType } from "@/types";
import { Heart, Hand, Laugh, PartyPopper } from "lucide-react";
import { Confetti } from "@/components/Confetti";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

const reactionConfig = {
	HIGH_FIVE: {
		icon: Hand,
		activeGradient: "bg-gradient-to-r from-emerald-400 to-green-500",
		hoverColor: "hover:text-green-500",
		textColor: "text-white",
		label: "High Five",
	},
	LOVE: {
		icon: Heart,
		activeGradient: "bg-gradient-to-r from-pink-500 to-red-500",
		hoverColor: "hover:text-red-500",
		textColor: "text-white",
		label: "Love",
	},
	LAUGH: {
		icon: Laugh,
		activeGradient: "bg-gradient-to-r from-amber-400 to-yellow-500",
		hoverColor: "hover:text-yellow-500",
		textColor: "text-white",
		label: "Laugh",
	},
	CELEBRATE: {
		icon: PartyPopper,
		activeGradient: "bg-gradient-to-r from-violet-500 to-purple-500",
		hoverColor: "hover:text-purple-500",
		textColor: "text-white",
		label: "Celebrate",
	},
} as const;

interface ReactionSectionProps {
	reactions: ReactionDTO[] | null;
	onReactionAdded?: (updatedReactions: ReactionDTO[]) => void;
	currentUserId?: number;
	entityId: number;
	entityType: "post" | "comment";
	className?: string;
}

export const ReactionSection: React.FC<ReactionSectionProps> = ({
	reactions,
	onReactionAdded,
	currentUserId,
	entityId,
	entityType,
	className,
}) => {
	const { toast } = useToast();
	const [showConfetti, setShowConfetti] = useState(false);

	const handleReaction = async (type: ReactionType) => {
		try {
			if (!hasUserReacted(type)) {
				// Trigger confetti immediately for CELEBRATE reaction
				if (type === "CELEBRATE") {
					setShowConfetti(true);
					setTimeout(() => setShowConfetti(false), 3000); // Reduced to 3 seconds
				}

				// User has not reacted with this type, so add the reaction
				const reaction =
					entityType === "post"
						? await socialService.addReactionToPost(entityId, type)
						: await socialService.addReactionToComment(entityId, type);
				// Update local reactions by adding the new reaction
				const updatedReactions = reactions
					? [...reactions, reaction]
					: [reaction];
				onReactionAdded?.(updatedReactions);
			} else {
				// User has already reacted with this type, so remove the reaction
				if (entityType === "post") {
					await socialService.removeReactionFromPost(entityId, type);
				} else {
					await socialService.removeReactionFromComment(entityId, type);
				}
				// Update local reactions by removing the reaction
				const updatedReactions =
					reactions?.filter(
						(r) => !(r.type === type && r.user?.id === currentUserId)
					) || [];
				onReactionAdded?.(updatedReactions);
			}
		} catch (error) {
			console.error("Error handling reaction:", error);
			toast({
				title: "Error",
				description: "Failed to handle reaction",
				variant: "destructive",
			});
		}
	};

	const getReactionCount = (type: ReactionType) => {
		return reactions?.filter((r) => r.type === type).length || 0;
	};

	const hasUserReacted = (type: ReactionType) => {
		return (
			reactions?.some((r) => r.type === type && r.user?.id === currentUserId) ||
			false
		);
	};

	return (
		<>
			{showConfetti && (
				<div className="fixed inset-0 z-50 pointer-events-none">
					<Confetti colors={["#9333ea", "#db2777", "#fcd34d", "#4f46e5"]} />
				</div>
			)}
			<div className={cn("flex items-center gap-2", className)}>
				{Object.entries(reactionConfig).map(([type, config]) => {
					const reactionType = type as ReactionType;
					const hasReacted = hasUserReacted(reactionType);
					const reactionCount = getReactionCount(reactionType);
					const Icon = config.icon;

					return (
						<TooltipProvider key={type}>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className={cn(
											"flex items-center gap-1 hover:bg-transparent transition-all duration-200",
											hasReacted
												? cn(
														config.activeGradient,
														config.textColor,
														"shadow-sm"
												  )
												: "bg-transparent",
											!hasReacted && config.hoverColor
										)}
										onClick={() => handleReaction(reactionType)}
									>
										<Icon
											className={cn("h-4 w-4", hasReacted && config.textColor)}
										/>
										{reactionCount > 0 && (
											<span
												className={cn(
													"text-sm",
													hasReacted ? config.textColor : "text-gray-600"
												)}
											>
												{reactionCount}
											</span>
										)}
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>{config.label}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					);
				})}
			</div>
		</>
	);
};
