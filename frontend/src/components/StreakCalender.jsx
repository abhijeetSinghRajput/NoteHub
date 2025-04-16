import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const months = [
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

const Days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const StreakCalender = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>346 Contribution in last year</CardTitle>
      </CardHeader>
      <CardContent className="">
        <div className="flex items-center gap-12">
          {months.map((month) => (
            <span>{month}</span>
          ))}
        </div>
        <div className="flex space-x-1">
          {Array(52)
            .fill(null)
            .map(() => (
              <div className="week space-y-1">
                {Array(7)
                  .fill(null)
                  .map((_, index) => (
                    <div className="weekday flex items-center justify-center size-[14px] text-sm rounded bg-secondary">
                    </div>
                  ))}
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakCalender;
