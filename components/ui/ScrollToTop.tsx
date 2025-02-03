"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const ScrollToTop = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const toggleVisibility = () => {
			// Show button when page is scrolled more than 500px
			setIsVisible(window.scrollY > 500);
		};

		window.addEventListener("scroll", toggleVisibility);

		return () => {
			window.removeEventListener("scroll", toggleVisibility);
		};
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<Button
			variant="secondary"
			size="icon"
			className={cn(
				"fixed bottom-8 right-8 z-50 rounded-full shadow-lg transition-all duration-300",
				"bg-purple-600 hover:bg-purple-700 text-white",
				isVisible
					? "opacity-100 translate-y-0"
					: "opacity-0 translate-y-16 pointer-events-none"
			)}
			onClick={scrollToTop}
			aria-label="Scroll to top"
		>
			<ArrowUp className="h-5 w-5" />
		</Button>
	);
};
