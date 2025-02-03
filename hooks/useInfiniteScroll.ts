import { useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollProps {
	isLoading: boolean;
	hasMore: boolean;
	onLoadMore: () => void;
}

export const useInfiniteScroll = ({
	isLoading,
	hasMore,
	onLoadMore,
}: UseInfiniteScrollProps) => {
	const observerRef = useRef<IntersectionObserver | null>(null);

	const lastElementRef = useCallback(
		(node: HTMLElement | null) => {
			if (isLoading) return;

			if (observerRef.current) {
				observerRef.current.disconnect();
			}

			observerRef.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting && hasMore) {
					onLoadMore();
				}
			});

			if (node) {
				observerRef.current.observe(node);
			}
		},
		[isLoading, hasMore, onLoadMore]
	);

	useEffect(() => {
		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, []);

	return { lastElementRef };
};
