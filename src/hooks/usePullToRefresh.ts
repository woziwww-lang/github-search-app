import { useEffect, useState, useRef } from 'react';

interface UsePullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  enabled?: boolean;
}

export const usePullToRefresh = ({ onRefresh, enabled = true }: UsePullToRefreshProps) => {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY === 0 && !isRefreshing) {
        currentY.current = e.touches[0].clientY;
        const distance = currentY.current - startY.current;

        if (distance > 0) {
          setIsPulling(true);
          setPullDistance(Math.min(distance, 150));
        }
      }
    };

    const handleTouchEnd = async () => {
      if (isPulling && pullDistance > 80 && !isRefreshing) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }
      setIsPulling(false);
      setPullDistance(0);
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, isPulling, isRefreshing, pullDistance, onRefresh]);

  return { isPulling, isRefreshing, pullDistance };
};
