import { Heart, ThumbsUp, PartyPopper, Smile } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactionType } from "@/types";

export const reactionIcons: Record<ReactionType, LucideIcon> = {
	LIKE: ThumbsUp,
	LOVE: Heart,
	CELEBRATE: PartyPopper,
	SUPPORT: Smile,
};
