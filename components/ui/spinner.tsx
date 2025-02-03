import { cn } from "@/lib/utils";

interface SpinnerProps {
	className?: string;
	size?: "sm" | "md" | "lg";
}

export const Spinner: React.FC<SpinnerProps> = ({ className, size = "md" }) => {
	const sizeClasses = {
		sm: "h-4 w-4",
		md: "h-6 w-6",
		lg: "h-8 w-8",
	};

	return (
		<div
			className={cn(
				"animate-spin rounded-full border-b-2 border-purple-600",
				sizeClasses[size],
				className
			)}
		/>
	);
};
