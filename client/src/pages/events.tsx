import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Calendar, Users, Star, MapPin, Clock, IndianRupee } from "lucide-react";
import { useAuth } from "@/lib/auth";
import EventUploadModal from "@/components/events/event-upload-modal";
import { useState } from "react";

export default function Events() {
  const { user } = useAuth();
  const [showEventModal, setShowEventModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["/api/events"],
    queryFn: () => fetch(`/api/events?campusId=${user?.campusId}`).then(res => res.json()),
    enabled: !!user?.campusId,
  });

  const filteredEvents = events.filter((event: any) => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || event.programType === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Talk: "bg-primary-100 text-primary-700",
      Workshop: "bg-emerald-100 text-emerald-700",
      Hackathon: "bg-secondary-100 text-secondary-700",
      Networking: "bg-amber-100 text-amber-700",
      Seminar: "bg-pink-100 text-pink-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  const getModeIcon = (mode: string) => {
    if (mode === "Online") return "🌐";
    if (mode === "Offline") return "🏢";
    return "🔗"; // Hybrid
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
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-500 mt-1">Manage and view all campus events</p>
        </div>
        <Button onClick={() => setShowEventModal(true)} className="mt-4 sm:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Talk">Talks</SelectItem>
                <SelectItem value="Workshop">Workshops</SelectItem>
                <SelectItem value="Hackathon">Hackathons</SelectItem>
                <SelectItem value="Networking">Networking</SelectItem>
                <SelectItem value="Seminar">Seminars</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event: any) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">{getModeIcon(event.mode)}</div>
                  <Badge className={getTypeColor(event.programType)}>
                    {event.programType}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg leading-tight">{event.name}</h3>
                  <div className="flex items-center text-amber-500 ml-2">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{event.rating}</span>
                  </div>
                </div>
                
                {event.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                )}
                
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(event.dateTime).toLocaleDateString()}</span>
                    <Clock className="h-4 w-4 ml-4 mr-1" />
                    <span>{new Date(event.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{event.mode}</span>
                    <Users className="h-4 w-4 ml-4 mr-1" />
                    <span>{event.participantCount || 0} participants</span>
                  </div>
                  
                  {event.expense && parseFloat(event.expense) > 0 && (
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      <span>₹{parseFloat(event.expense).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filterType !== "all" ? "No events found" : "No events yet"}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterType !== "all" 
              ? "Try adjusting your search or filter criteria" 
              : "Start by creating your first event"}
          </p>
          <Button onClick={() => setShowEventModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {searchTerm || filterType !== "all" ? "Create Event" : "Create First Event"}
          </Button>
        </div>
      )}

      <EventUploadModal 
        open={showEventModal} 
        onOpenChange={setShowEventModal}
      />
    </div>
  );
}
