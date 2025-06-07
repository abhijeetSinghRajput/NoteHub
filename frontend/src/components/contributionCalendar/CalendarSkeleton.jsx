import React from "react";
import { Skeleton } from "../ui/skeleton";

const CalendarSkeleton = () => {
  const grid = new Array(53 * 7).fill(null);
  return (
    <div className="grid calendar pb-1">
      {grid.map((_, index) => (
        <Skeleton
          key={index}
          style={{
            gridRow: (index % 7) + 1,
            gridColumn: Math.floor(index / 7) + 1,
          }}
          className={`size-[10px] grid place-items-center text-[4px] aspect-square  rounded-[2px] bg-contribution-none`}
        ></Skeleton>
      ))}
    </div>
  );
};

export default CalendarSkeleton;
