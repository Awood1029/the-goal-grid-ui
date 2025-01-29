import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { socialService } from "@/services/socialService";
import { useToast } from "@/hooks/use-toast";
import type { ReactionDTO, ReactionType } from "@/types";
import { Heart, ThumbsUp, Laugh } from "lucide-react";

const reactionConfig = {
	LIKE: {
		icon: ThumbsUp,
		activeColor: "text-blue-500",
		hoverColor: "hover:text-blue-500",
	},
	LOVE: {
		icon: Heart,
		activeColor: "text-red-500",
		hoverColor: "hover:text-red-500",
	},
	LAUGH: {
		icon: Laugh,
		activeColor: "text-yellow-500",
		hoverColor: "hover:text-yellow-500",
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

	const handleReaction = async (type: ReactionType) => {
		try {
			if (hasUserReacted(type)) {
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
			} else {
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
		<div className={cn("flex items-center gap-2", className)}>
			{Object.entries(reactionConfig).map(([type, config]) => {
				const reactionType = type as ReactionType;
				const hasReacted = hasUserReacted(reactionType);
				const reactionCount = getReactionCount(reactionType);
				const Icon = config.icon;

				return (
					<Button
						key={type}
						variant="ghost"
						size="sm"
						className={cn(
							"flex items-center gap-1 hover:bg-transparent",
							!hasReacted && config.hoverColor,
							hasReacted && config.activeColor
						)}
						onClick={() => handleReaction(reactionType)}
					>
						<Icon className={cn("h-4 w-4", hasReacted && "fill-current")} />
						{reactionCount > 0 && (
							<span className={cn("text-sm", hasReacted && config.activeColor)}>
								{reactionCount}
							</span>
						)}
					</Button>
				);
			})}
		</div>
	);
};
