
import React, { useState } from "react";
import { 
  addDays, 
  startOfWeek, 
  format, 
  addWeeks, 
  subWeeks, 
  addMonths,
  subMonths,
  startOfMonth,
  getDaysInMonth,
  getDay,
  isSameMonth,
  endOfMonth
} from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import DayColumn from "./DayColumn";
import { useTeam } from "@/context/TeamContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

type ViewMode = "week" | "month";

const WeeklyCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const { activeTeamId, teams } = useTeam();
  const { theme } = useTheme();
  
  // Get dates for current week (Monday to Friday)
  const generateWeekDays = (date: Date) => {
    // Get the start of the week (Monday)
    const start = startOfWeek(date, { weekStartsOn: 1 });
    
    // Create an array of 5 days (Monday to Friday)
    return Array.from({ length: 5 }).map((_, i) => addDays(start, i));
  };
  
  // Generate days for the month view
  const generateMonthDays = (date: Date) => {
    const monthStart = startOfMonth(date);
    const daysInMonth = getDaysInMonth(date);
    const startDay = getDay(monthStart);
    
    // Adjust for Monday as first day of week (0 = Monday, 6 = Sunday)
    const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;
    
    // Create array for all calendar boxes (previous month, current month, next month)
    const totalDays = Math.ceil((daysInMonth + adjustedStartDay) / 7) * 7;
    
    return Array.from({ length: totalDays }).map((_, i) => {
      const dayOffset = i - adjustedStartDay;
      return addDays(monthStart, dayOffset);
    });
  };
  
  const weekDays = generateWeekDays(currentDate);
  const monthDays = generateMonthDays(currentDate);
  
  const goToNextPeriod = () => {
    if (viewMode === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };
  
  const goToPreviousPeriod = () => {
    if (viewMode === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };
  
  const goToCurrentPeriod = () => {
    setCurrentDate(new Date());
  };
  
  // Get the active team name
  const getActiveTeamName = () => {
    if (activeTeamId === "all") return "All Teams";
    const team = teams.find(t => t.id === activeTeamId);
    return team ? team.name : "Unknown Team";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-colors">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 className="text-xl font-bold dark:text-white">{getActiveTeamName()} Calendar</h2>
        <div className="flex gap-2">
          <Tabs 
            value={viewMode} 
            onValueChange={(v) => setViewMode(v as ViewMode)}
            className="mr-2"
          >
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button variant="outline" size="sm" onClick={goToPreviousPeriod}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToCurrentPeriod}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextPeriod}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="text-center py-2 font-medium text-gray-500 dark:text-gray-300">
        {viewMode === "week" ? (
          <>
            {format(weekDays[0], "MMMM d")} - {format(weekDays[4], "MMMM d, yyyy")}
          </>
        ) : (
          format(currentDate, "MMMM yyyy")
        )}
      </div>
      
      {viewMode === "week" ? (
        <div className="overflow-x-auto">
          <div className="flex min-w-full table-fixed" style={{ tableLayout: 'fixed' }}>
            {weekDays.map((day) => (
              <DayColumn key={day.toISOString()} date={day} />
            ))}
          </div>
        </div>
      ) : (
        <div className="overflow-auto">
          <div className="grid grid-cols-7 text-center py-2 border-b dark:border-gray-700">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="font-medium text-gray-500 dark:text-gray-300">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {monthDays.map((day) => (
              <div 
                key={day.toISOString()}
                className={cn(
                  "min-h-[150px] border border-gray-600 dark:border-gray-700 p-1 overflow-auto", 
                  !isSameMonth(day, currentDate) && "bg-gray-50 dark:bg-gray-900 opacity-50"
                )}
              >
                <div className="text-center font-medium mb-1 dark:text-gray-300">
                  {format(day, "d")}
                </div>
                <DayColumn date={day} isMonthView={true} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyCalendar;
