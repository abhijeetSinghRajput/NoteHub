import React, { useState, useMemo } from "react";
import { Button } from "../ui/button";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useContributionStore } from "@/stores/useContributionStore";

const getLocalDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const DateCalendar = () => {
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 1, today.getMonth(), 1);
  const maxDate = new Date(today.getFullYear(), today.getMonth(), 1);

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const { contributionCalendar } = useContributionStore();

  const contributionSet = useMemo(() => {
    if(!Array.isArray(contributionCalendar)) return new Set();
    
    const flat = contributionCalendar.flat();
    return new Set(
      flat
        .filter(({ contributionCount }) => contributionCount > 0)
        .map(({ date }) => date)
    );
  }, [contributionCalendar]);

  const DAY_STR = ["su", "mo", "tu", "we", "th", "fr", "sa"];

  const getWeeksOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const weeks = [];
    let current = new Date(firstDay);
    current.setDate(current.getDate() - current.getDay()); // go to previous Sunday

    while (current <= lastDay || current.getDay() !== 0) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      weeks.push(week);
    }
    return weeks;
  };

  const handleGoBack = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    if (prevMonth >= minDate) setCurrentMonth(prevMonth);
  };

  const handleGoForward = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    if (
      nextMonth.getFullYear() < maxDate.getFullYear() ||
      (nextMonth.getFullYear() === maxDate.getFullYear() &&
        nextMonth.getMonth() <= maxDate.getMonth())
    ) {
      setCurrentMonth(nextMonth);
    }
  };

  const weeks = getWeeksOfMonth(currentMonth);
  return (
    <div className="select-none bg-background border p-3 rounded-lg">
      <div className="flex gap-4 items-center justify-between mb-2">
        <Button
          variant="secondary"
          className="size-6 p-0"
          onClick={handleGoBack}
          disabled={
            currentMonth.getFullYear() === minDate.getFullYear() &&
            currentMonth.getMonth() === minDate.getMonth()
          }
        >
          <ChevronLeft />
        </Button>
        <div className="text-sm font-semibold pointer-events-none">
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </div>
        <Button
          variant="secondary"
          className="size-6 p-0"
          onClick={handleGoForward}
          disabled={
            currentMonth.getFullYear() === maxDate.getFullYear() &&
            currentMonth.getMonth() === maxDate.getMonth()
          }
        >
          <ChevronRight />
        </Button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            {DAY_STR.map((day) => (
              <th
                key={day}
                className="text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, i) => (
            <tr key={i}>
              {week.map((date, j) => {
                const isCurrentMonth =
                  date.getMonth() === currentMonth.getMonth();
                const isToday = date.toDateString() === today.toDateString();
                const dateStr = getLocalDateString(date);
                const isContributed = contributionSet.has(dateStr);
                if(isContributed) console.log(date.getDate(), dateStr);
                return (
                  <td
                    key={j}
                    className={`w-8 h-8 text-center text-sm rounded ${
                      isCurrentMonth
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    <Button
                      variant={isToday ? "secondary" : "ghost"}
                      className={`${(isContributed && isToday) && 'bg-green-400/20'} relative size-8 p-0 font-normal`}
                    >
                      {isContributed?
                        <CheckCircle className="text-green-500 size-3" />:
                        date.getDate()
                      }
                    </Button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DateCalendar;
