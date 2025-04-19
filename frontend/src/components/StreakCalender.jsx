import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import TooltipWrapper from "./TooltipWrapper";
import { Skeleton } from "./ui/skeleton";
import { useContributionStore } from "@/stores/useContributionStore";
import { ConciergeBell } from "lucide-react";

const MONTHS = [ 
  "Jan", "Feb", "Mar", "Apr", 
  "May", "Jun", "Jul", "Aug",
  "Sep", "Oct", "Nov", "Dec",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const colorLabel = ["#0e4429", "#006b32", "#26a642", "#3ad454"];
const getColorLabel = (contributionCount) => {
  if (contributionCount >= 7) return "bg-contributionLevel-4";
  if (contributionCount >= 4) return "bg-contributionLevel-3";
  if (contributionCount >= 2) return "bg-contributionLevel-2";
  if (contributionCount >= 1) return "bg-contributionLevel-1";
  return "bg-contributionLevel-0";
};

const StreakCalender = () => {
  const {
    getContributionCalendar,
    contributionCalendar,
    fetchingCalendar,
    totalContribution,
  } = useContributionStore();
  const scrollRef = useRef(null);
  const [grid, setGrid] = useState([]);

  useEffect(() => {
    getContributionCalendar();
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

  useEffect(() => {
    if(!Array.isArray(contributionCalendar)) return;
    const arr = [];
    for (let i = 0; i < 7; ++i) {
      for (let j = 0; j < 53; ++j) {
        if (!contributionCalendar[j][i]) continue;
        arr.push(contributionCalendar[j][i]);
      }
    }

    setGrid(arr);
  }, [contributionCalendar]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>{totalContribution} Contribution in last year</CardTitle>
      </CardHeader>
      <CardContent className="pb-2 w-full">
        <div ref={scrollRef} className="overflow-x-scroll flex gap-1 pb-[6px]">
          <div className="space-y-1">
            {DAYS.map((day, i) => (
              <div
                key={i}
                className={`${
                  i % 2 == 0 && "opacity-0"
                }  mt-5 weekday flex items-center justify-start h-[10px] text-xs font-semibold rounded`}
              >
                {day.slice(0, 3)}
              </div>
            ))}
          </div>
          <div>
            <div className="flex mb-1 text-xs font-semibold items-center gap-12">
              {MONTHS.map((month, i) =>
                fetchingCalendar ? (
                  <Skeleton
                    key={i}
                    className="h-3 w-6 rounded-[2px] aspect-square"
                  />
                ) : (
                  <span key={i}>{month}</span>
                )
              )}
            </div>
            <div className="calendar">
              {grid.map(({ date, contributionCount }, index) =>
                fetchingCalendar  ? (
                  <Skeleton
                    key={index}
                    className="bg-secondary rounded-[2px] aspect-square w-3"
                  />
                ) : (
                  <TooltipWrapper
                    key={index}
                    message={`${date}: ${contributionCount} contributions`}
                  >
                    <div
                      className={`aspect-square w-3 ${getColorLabel(
                        contributionCount
                      )} rounded-[2px]`}
                    ></div>
                  </TooltipWrapper>
                )
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 my-2">
          <span className="text-muted-foreground/50 text-xs font-semibold">Less</span>
          <div className="flex gap-[3px]">
            <div className="aspect-square size-3 rounded-[2px] bg-contributionLevel-0"></div>
            <div className="aspect-square size-3 rounded-[2px] bg-contributionLevel-1"></div>
            <div className="aspect-square size-3 rounded-[2px] bg-contributionLevel-2"></div>
            <div className="aspect-square size-3 rounded-[2px] bg-contributionLevel-3"></div>
            <div className="aspect-square size-3 rounded-[2px] bg-contributionLevel-4"></div>
          </div>
          <span className="text-muted-foreground/50 text-xs font-semibold">More</span>
        </div>

      </CardContent>
    </Card>
  );
};

export default StreakCalender;
