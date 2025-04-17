import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import TooltipWrapper from "./TooltipWrapper";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const StreakCalender = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>346 Contribution in last year</CardTitle>
      </CardHeader>
      <CardContent className="pb-2 w-full">
        <div className="overflow-x-scroll flex gap-1 pb-2">
          <div className="space-y-1">
            {DAYS.map((day, i) => (
              <div className={`${(i%2==0) && 'opacity-0'}  mt-5 weekday flex items-center justify-start h-[10px] text-xs font-semibold rounded`}>
                {day.slice(0, 3)}
              </div>
            ))}
          </div>
          <div>
            <div className="flex mb-1 text-xs font-semibold items-center gap-12">
              {MONTHS.map((month) => (
                <span>{month}</span>
              ))}
            </div>
            <div className="calendar ">
              {Array(53 * 7)
                .fill(null)
                .map((_, dayIndex) => (
                  <TooltipWrapper
                    message={`day ${dayIndex}`}
                  >
                    <div className="bg-secondary rounded-[2px] aspect-square"></div>
                  </TooltipWrapper>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakCalender;
