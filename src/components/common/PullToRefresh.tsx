interface PullToRefreshProps {
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
}

export const PullToRefresh = ({ isPulling, isRefreshing, pullDistance }: PullToRefreshProps) => {
  const opacity = Math.min(pullDistance / 80, 1);
  const rotation = (pullDistance / 150) * 360;

  if (!isPulling && !isRefreshing) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 z-40"
      style={{
        height: `${pullDistance}px`,
        opacity: opacity,
      }}
    >
      <div
        className={`text-3xl ${isRefreshing ? 'animate-spin' : ''}`}
        style={{
          transform: isRefreshing ? 'none' : `rotate(${rotation}deg)`,
        }}
      >
        ↻
      </div>
    </div>
  );
};
