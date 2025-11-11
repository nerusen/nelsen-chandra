import SkeletonLoader from "@/common/components/elements/SkeletonLoader";
import Skeleton from "react-loading-skeleton";

const ChatItemSkeleton = () => {
  return (
    <SkeletonLoader>
      <div className="space-y-5 py-4">
        {/* Skeleton 1 */}
        <div className="flex items-center gap-3 px-4 lg:px-8">
          <Skeleton className="h-full" circle containerClassName="w-[40px]" />
          <div className="space-y-1 flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-x-2 gap-y-1">
              <Skeleton containerClassName="w-20" />
            </div>
            <div className="group flex flex-col w-fit relative">
              <Skeleton containerClassName="w-64" className="h-12 rounded-xl" />
            </div>
          </div>
        </div>
        {/* Skeleton 2 */}
        <div className="flex items-center gap-3 px-4 lg:px-8 flex-row-reverse">
          <Skeleton className="h-full" circle containerClassName="w-[40px]" />
          <div className="space-y-1 flex-1 flex flex-col items-end">
            <div className="flex flex-col md:flex-row md:items-center gap-x-2 gap-y-1 md:flex-row-reverse">
              <Skeleton containerClassName="w-20" />
            </div>
            <div className="group flex flex-col w-fit relative items-end">
              <Skeleton containerClassName="w-48" className="h-10 rounded-xl" />
            </div>
          </div>
        </div>
        {/* Skeleton 3 */}
        <div className="flex items-center gap-3 px-4 lg:px-8">
          <Skeleton className="h-full" circle containerClassName="w-[40px]" />
          <div className="space-y-1 flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-x-2 gap-y-1">
              <Skeleton containerClassName="w-16" />
            </div>
            <div className="group flex flex-col w-fit relative">
              <Skeleton containerClassName="w-56" className="h-14 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </SkeletonLoader>
  );
};

export default ChatItemSkeleton;
