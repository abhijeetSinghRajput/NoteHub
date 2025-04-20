import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import TooltipWrapper from "./TooltipWrapper";
import { useContributionStore } from "@/stores/useContributionStore";
import { getContributionMessage } from "@/lib/getContributionMessage";
import CalendarSkeleton from "./sekeletons/CalendarSkeleton";
import { Flame } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

const MONTHS_STR = [ 
  "Jan", "Feb", "Mar", "Apr", 
  "May", "Jun", "Jul", "Aug",
  "Sep", "Oct", "Nov", "Dec",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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
  const {authUser} = useAuthStore();

  const scrollRef = useRef(null);
  const [grid, setGrid] = useState([]);
  const [cellRowCol, setCellRowCol] = useState();
  const [monthsSpan, setMonthsSpan] = useState('repeat(13, 1fr)')
  const [calendarMonths, setCalendarMonths] = useState([]);
  const [hasContributedToday, setHasContributedToday] = useState(false);
  const scrollToEnd = ()=>{
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }
  useEffect(() => {
    getContributionCalendar();
    scrollToEnd();
    window.addEventListener('resize', scrollToEnd);
  }, []);

  useEffect(() => {
    if(!Array.isArray(contributionCalendar)) return;
    setGrid(contributionCalendar.flat());

    const todayBlock = grid[grid.length-1];
    const today = new Date().toISOString().slice(0, 10);
    setHasContributedToday(
      todayBlock?.contributionCount > 0 
      && todayBlock?.date === today
    );

    const cellCordinate = [];
    let months = [];
    contributionCalendar.forEach((week, i)=>{
      months.push(+(week[0].date.split('-')[1]));
      week.forEach((weekday, j)=>{
        cellCordinate.push([j + 1, i + 1]);
      })
    })

    setCellRowCol(cellCordinate);
    let span = '';
    let count = 0;
    for(let i = 0; i<months.length; ++i){
      count++;
      if(months[i] !== months[i+1]){
        span += count + 'fr ';
        count = 0;
      }
    }
    setMonthsSpan(span);
    months = months.filter((e, i)=> e !== months[i+1]);
    setCalendarMonths(months);

  }, [contributionCalendar]);

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div className="flex justify-between items-center font-semibold leading-none tracking-tight">
          <div>{totalContribution} Contribution in last year</div>
          <div className="flex gap-1 items-center">
            <div className="size-5">
              {(hasContributedToday)?
                <img src="./flame-active.svg" className="w-full h-full"/>:
                <Flame className="w-full h-full"/>
              }
            </div>
            <span>{authUser.currentStreak}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 w-full">
        <div ref={scrollRef} className="overflow-x-scroll flex gap-1 pb-[6px]">
          <div className="space-y-[3px]">
            {DAYS.map((day, i) => (
              <div
                key={i}
                className={`${
                  i % 2 == 0 && "opacity-0" 
                }  mt-5 weekday flex items-center justify-start h-[10px] text-xs font-semibold`}
              >
                {day.slice(0, 3)}
              </div>
            ))}
          </div>
          <div>
            { (fetchingCalendar)?
              <CalendarSkeleton/>:
              <div>
                  <div 
                    className="grid justify-between mb-2"
                    style={{gridTemplateColumns : monthsSpan}}
                  >
                    {
                      calendarMonths.map((m, i)=>(
                        <div key={i} className="text-xs h-3 font-semibold">{MONTHS_STR[m - 1]}</div>
                      ))
                    }
                  </div>
                  <div className="calendar">
                    {
                      grid.map(({date, contributionCount}, index)=>(
                        <TooltipWrapper key={index} message={getContributionMessage(date, contributionCount)}>
                          <div 
                            className={`${getColorLabel(contributionCount)} aspect-square rounded-[2px]`}
                            style={{
                              gridRow: `${cellRowCol[index][0]}`,
                              gridColumn: `${cellRowCol[index][1]}`,
                            }}
                          />
                        </TooltipWrapper>
                      ))
                    }
                  </div>
              </div>
            }
          </div>
        </div>
        
        <div className="flex items-center gap-2 my-2">
          <span className="text-muted-foreground/50 text-xs font-semibold">Less</span>
          <div className="flex gap-[3px]">
            <div className="aspect-square size-[10px] rounded-[2px] bg-contributionLevel-0"></div>
            <div className="aspect-square size-[10px] rounded-[2px] bg-contributionLevel-1"></div>
            <div className="aspect-square size-[10px] rounded-[2px] bg-contributionLevel-2"></div>
            <div className="aspect-square size-[10px] rounded-[2px] bg-contributionLevel-3"></div>
            <div className="aspect-square size-[10px] rounded-[2px] bg-contributionLevel-4"></div>
          </div>
          <span className="text-muted-foreground/50 text-xs font-semibold">More</span>
        </div>

      </CardContent>
    </Card>
  );
};



export default StreakCalender;
