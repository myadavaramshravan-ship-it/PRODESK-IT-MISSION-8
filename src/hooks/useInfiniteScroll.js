import { useRef, useEffect } from "react";

export default function useInfiniteScroll({ onLoadMore, loading, hasMore, rootMargin = "600px" }) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    let observer;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) onLoadMore?.();
        },
        { root: null, rootMargin, threshold: 0 }
      );
      observer.observe(node);
    }

    
    const checkAndLoad = () => {
      if (loading || !hasMore || !node) return;
      const rect = node.getBoundingClientRect();
      if (rect.top <= window.innerHeight + 200) onLoadMore?.();
    };

    window.addEventListener("scroll", checkAndLoad, { passive: true });
    const intervalId = setInterval(checkAndLoad, 500);

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener("scroll", checkAndLoad);
      clearInterval(intervalId);
    };
  }, [onLoadMore, loading, hasMore, rootMargin]);

  return sentinelRef;
}
