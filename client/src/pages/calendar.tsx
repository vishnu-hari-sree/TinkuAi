import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import EventUploadModal from "@/components/events/event-upload-modal";
import CalendarView from "@/components/calendar/calendar-view";

export default function Calendar() {
  const { user } = useAuth();
  const [showEventModal, setShowEventModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["/api/events"],
    queryFn: () => fetch(`/api/events?campusId=${user?.campusId}`).then(res => res.json()),
    enabled: !!user?.campusId,
  });

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    } else if (view === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    }
    
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getDateRangeText = () => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long' 
    };
    
    if (view === "month") {
      return currentDate.toLocaleDateString('en-US', options);
    } else if (view === "week") {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Calendar</h1>
          <p className="text-gray-500 mt-1">Manage event scheduling and avoid conflicts</p>
        </div>
        <Button onClick={() => setShowEventModal(true)} className="mt-4 sm:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </Button>
      </div>

      {/* Calendar Controls */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate("prev")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-semibold text-gray-900 min-w-0">
                  {getDateRangeText()}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateDate("next")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
              >
                Today
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={view === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("month")}
              >
                Month
              </Button>
              <Button
                variant={view === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("week")}
              >
                Week
              </Button>
              <Button
                variant={view === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("day")}
              >
                Day
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center space-x-6">
            <span className="text-sm font-medium text-gray-700">Event Types:</span>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-primary-500 rounded"></div>
              <span className="text-sm text-gray-600">Talks</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-emerald-500 rounded"></div>
              <span className="text-sm text-gray-600">Workshops</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-secondary-500 rounded"></div>
              <span className="text-sm text-gray-600">Hackathons</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-amber-500 rounded"></div>
              <span className="text-sm text-gray-600">Networking</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <CalendarView 
        events={events}
        currentDate={currentDate}
        view={view}
        onDateChange={setCurrentDate}
        onEventClick={(event) => {
          // Handle event click - could open a detail modal
          console.log("Event clicked:", event);
        }}
      />

      <EventUploadModal 
        open={showEventModal} 
        onOpenChange={setShowEventModal}
      />
    </div>
  );
}
