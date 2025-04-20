import React from "react";
import { Skeleton } from "../ui/skeleton";

const CalendarSkeleton = () => {
  return (
    <div>
        <div className="grid grid-cols-12 mb-2">
            {
                Array(12).fill().map((_,i)=>(
                    <Skeleton key={i} className="h-3 w-10 rounded-[2px]"/>
                ))
            }
        </div>
      <div className="calendar">
        {Array(7 * 53)
          .fill(null)
          .map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-[2px]" />
          ))}
      </div>
    </div>
  );
};

export default CalendarSkeleton;
