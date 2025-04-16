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
        <div className="overflow-x-scroll flex gap-2 pb-2">
          <div className="space-y-1">
            {DAYS.map((day, i) => (
              <div className="mt-4 weekday flex items-center justify-start h-[14px] text-xs font-semibold rounded">
                {day.slice(0, 3)}
              </div>
            ))}
          </div>
          <div>
            <div className="flex text-xs font-semibold items-center gap-12">
              {MONTHS.map((month) => (
                <span>{month}</span>
              ))}
            </div>
            <div className="flex space-x-1">
              {Array(52)
                .fill(null)
                .map((_, weekIndex) => (
                  <div className="week space-y-1">
                    {Array(7)
                      .fill(null)
                      .map((_, dayIndex) => (
                        <TooltipWrapper message={`week ${weekIndex} : day ${dayIndex}`}>
                          <div className="weekday flex items-center justify-center size-[14px] text-sm rounded bg-secondary"></div>
                        </TooltipWrapper>
                      ))}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakCalender;
