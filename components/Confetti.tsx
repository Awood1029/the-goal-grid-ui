import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";

export interface ConfettiProps {
	colors: string[];
}

export const Confetti = ({ colors }: ConfettiProps) => {
	const { width, height } = useWindowSize();

	return (
		<ReactConfetti
			width={width}
			height={height}
			colors={colors}
			numberOfPieces={200}
			recycle={false}
		/>
	);
};

export default Confetti;
