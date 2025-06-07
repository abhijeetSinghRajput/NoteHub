import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Flame } from "lucide-react";
import TooltipWrapper from "../TooltipWrapper";
import { axiosInstance } from "@/lib/axios";
import CalendarSkeleton from "./CalendarSkeleton";
import { getContributionMessage } from "@/lib/getContributionMessage";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getLevel = (contributionCount)=>{
    if (contributionCount >= 7) return "level4";
    else if (contributionCount >= 4) return "level3";
    else if (contributionCount >= 2) return "level2";
    else if (contributionCount > 0) return "level1";
    return "none";
}

const Calendar = ({ username }) => {
  const hasContributedToday = false;
  const [grid, setGrid] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`contribution/${username}`, {
          params: {
            currentDate: new Date().toISOString(),
            offset: new Date().getTimezoneOffset(),
          },
        });
        if (Array.isArray(res.data)) {
          setGrid(res.data);
        } else {
          console.error("Unexpected API response format:", res.data);
          setGrid([]);
        }
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching contribution data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center text-sm">
          <div>482 contribution in the last year</div>
          <div
            className={`${
              hasContributedToday ? "text-[#ff8828]" : ""
            } flex items-center gap-1 text-sm`}
          >
            <span className="text-right">{18}</span>
            <div className="size-4">
              {hasContributedToday ? (
                <img className="w-full h-full" src="flame-active.svg" alt="" />
              ) : (
                <Flame className="w-full h-full" />
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex">
          <div className="overflow-x-auto flex">
            <ul
              className="mr-1 grid text-right leading-[10px] gap-[3px] text-[10px]"
              style={{ gridTemplateRows: "repeat(7, 10px)" }}
            >
              <li className="opacity-0">Sun</li>
              <li>Mon</li>
              <li className="opacity-0">Tue</li>
              <li>Wed</li>
              <li className="opacity-0">Thu</li>
              <li>Fri</li>
              <li className="opacity-0">Sat</li>
            </ul>
            {loading ? (
              <CalendarSkeleton />
            ) : (
              <div className="grid calendar pb-1">
                {grid.map(({ date, count }, index) => (
                  <TooltipWrapper
                    key={index}
                    message={getContributionMessage(date, count)}
                  >
                    <div
                      style={{
                        gridRow: (index % 7) + 1,
                        gridColumn: Math.floor(index / 7) + 1,
                      }}
                      className={`size-[10px] grid place-items-center text-[4px] aspect-square  rounded-[2px] bg-contribution-${getLevel(count)}`}
                    ></div>
                  </TooltipWrapper>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <div className="text-muted-foreground text-xs flex items-center gap-2">
            Less
            <ul className="flex gap-[3px] items-center">
              <li className="h-[10px] w-[10px] rounded-[2px] aspect-square bg-contribution-none"></li>
              <li className="h-[10px] w-[10px] rounded-[2px] aspect-square bg-contribution-level1"></li>
              <li className="h-[10px] w-[10px] rounded-[2px] aspect-square bg-contribution-level2"></li>
              <li className="h-[10px] w-[10px] rounded-[2px] aspect-square bg-contribution-level3"></li>
              <li className="h-[10px] w-[10px] rounded-[2px] aspect-square bg-contribution-level4"></li>
            </ul>
            More
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Calendar;
