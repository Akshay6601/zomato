import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-md ${className}`} />
  );
};

export const RestaurantCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm flex flex-col h-full">
      <Skeleton className="aspect-video w-full" />
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-5 w-10" />
          </div>
          <Skeleton className="h-4 w-1/2 mb-2.5" />
          <Skeleton className="h-3.5 w-full mb-1" />
          <Skeleton className="h-3.5 w-4/5 mb-4" />
        </div>
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
    </div>
  );
};

export const FoodItemSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-neutral-100 rounded-2xl p-4 flex gap-4">
      <div className="flex-1">
        <Skeleton className="h-4 w-8 mb-2" />
        <Skeleton className="h-5 w-2/3 mb-1" />
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-3.5 w-full mb-1.5" />
        <Skeleton className="h-3.5 w-4/5" />
      </div>
      <div className="w-28 h-28 flex-shrink-0 relative">
        <Skeleton className="w-full h-full rounded-xl" />
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <Skeleton className="h-8 w-20 rounded-lg shadow-sm" />
        </div>
      </div>
    </div>
  );
};
export default Skeleton;
