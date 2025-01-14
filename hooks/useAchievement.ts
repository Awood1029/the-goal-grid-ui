import { useState, useCallback, useEffect } from "react";
import { ACHIEVEMENT_MESSAGES } from "@/constants";

export const useAchievement = () => {
	const [showConfetti, setShowConfetti] = useState(false);
	const [achievementMessage, setAchievementMessage] = useState<string | null>(
		null
	);

	useEffect(() => {
		let messageTimeout: NodeJS.Timeout;
		let confettiTimeout: NodeJS.Timeout;

		if (showConfetti) {
			messageTimeout = setTimeout(() => {
				setAchievementMessage(null);
			}, 3000);

			confettiTimeout = setTimeout(() => {
				setShowConfetti(false);
			}, 5000);
		}

		return () => {
			clearTimeout(messageTimeout);
			clearTimeout(confettiTimeout);
		};
	}, [showConfetti]);

	const triggerAchievement = useCallback(() => {
		const randomMessage =
			ACHIEVEMENT_MESSAGES[
				Math.floor(Math.random() * ACHIEVEMENT_MESSAGES.length)
			];
		setAchievementMessage(randomMessage);
		setShowConfetti(true);
	}, []);

	return {
		showConfetti,
		achievementMessage,
		triggerAchievement,
	};
};

export default useAchievement;
