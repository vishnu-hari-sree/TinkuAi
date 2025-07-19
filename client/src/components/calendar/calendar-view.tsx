import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";

interface Event {
  id: number;
  name: string;
  dateTime: string;
  programType: string;
}

interface CalendarViewProps {
  events: Event[];
  currentDate: Date;
  view: "month" | "week" | "day";
  onDateChange: (date: Date) => void;
  onEventClick: (event: Event) => void;
}

export default function CalendarView({ 
  events, 
  currentDate, 
  view, 
  onDateChange, 
  onEventClick 
}: CalendarViewProps) {
  if (view === "month") {
    return <MonthView 
      events={events} 
      currentDate={currentDate} 
      onDateChange={onDateChange}
      onEventClick={onEventClick}
    />;
  }
  
  // For now, just show month view for all cases
  return <MonthView 
    events={events} 
    currentDate={currentDate} 
    onDateChange={onDateChange}
    onEventClick={onEventClick}
  />;
}

function MonthView({ events, currentDate, onDateChange, onEventClick }: Omit<CalendarViewProps, 'view'>) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // Get all days in the month
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get start of calendar grid (include previous month days to fill week)
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - monthStart.getDay());
  
  // Get end of calendar grid
  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));
  
  // Get all days to display in the calendar grid
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  
  const getEventsForDay = (day: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.dateTime), day)
    );
  };

  const getEventColor = (type: string) => {
    const colors: Record<string, string> = {
      Talk: "bg-primary-100 text-primary-700",
      Workshop: "bg-emerald-100 text-emerald-700",
      Hackathon: "bg-secondary-100 text-secondary-700",
      Networking: "bg-amber-100 text-amber-700",
      Seminar: "bg-pink-100 text-pink-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card>
      <CardContent className="p-6">
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {/* Day Headers */}
          {weekdays.map(day => (
            <div key={day} className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
          
          {/* Calendar Days */}
          {calendarDays.map(day => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isDayToday = isToday(day);
            
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "bg-white p-3 min-h-24 hover:bg-gray-50 cursor-pointer transition-colors",
                  isDayToday && "border-2 border-primary-500 bg-primary-50"
                )}
                onClick={() => onDateChange(day)}
              >
                <div className={cn(
                  "text-sm font-medium mb-1",
                  isCurrentMonth ? "text-gray-900" : "text-gray-400",
                  isDayToday && "text-primary-700"
                )}>
                  {format(day, "d")}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <Badge
                      key={event.id}
                      className={cn(
                        "text-xs p-1 w-full justify-start cursor-pointer",
                        getEventColor(event.programType)
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      <span className="truncate">{event.name}</span>
                    </Badge>
                  ))}
                  
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
