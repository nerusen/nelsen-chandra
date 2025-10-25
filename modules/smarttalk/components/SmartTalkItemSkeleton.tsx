const SmartTalkItemSkeleton = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg animate-pulse ${
              index % 2 === 0
                ? "bg-neutral-800 rounded-bl-none"
                : "bg-neutral-700 rounded-br-none"
            }`}
          >
            <div className="h-4 bg-neutral-600 rounded mb-2"></div>
            <div className="h-3 bg-neutral-600 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SmartTalkItemSkeleton;
