import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { School, Users, TrendingUp, Star, Plus, BarChart3, Mic, Wrench, Code, Network } from "lucide-react";
import { useAuth } from "@/lib/auth";
import EventUploadModal from "@/components/events/event-upload-modal";
import { useState } from "react";

interface CampusMetrics {
  totalEvents: number;
  totalParticipants: number;
  communitySize: number;
  thisMonth: number;
}

interface ActivityType {
  name: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [showEventModal, setShowEventModal] = useState(false);

  const { data: campus } = useQuery({
    queryKey: ["/api/campuses", user?.campusId],
    enabled: !!user?.campusId,
  });

  const { data: events = [] } = useQuery({
    queryKey: ["/api/events"],
    queryFn: () => fetch(`/api/events?campusId=${user?.campusId}`).then(res => res.json()),
    enabled: !!user?.campusId,
  });

  const { data: eventTypes = [] } = useQuery({
    queryKey: ["/api/analytics/event-types", user?.campusId],
    enabled: !!user?.campusId,
  });

  const metrics: CampusMetrics = {
    totalEvents: events.length,
    totalParticipants: events.reduce((sum: number, event: any) => sum + (event.participantCount || 0), 0),
    communitySize: campus?.memberCount || 0,
    thisMonth: events.filter((event: any) => {
      const eventDate = new Date(event.dateTime);
      const now = new Date();
      return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
    }).length,
  };

  const activityTypes: ActivityType[] = [
    {
      name: "Talks",
      count: eventTypes.find((type: any) => type.type === "Talk")?.count || 0,
      icon: <Mic className="h-6 w-6" />,
      color: "from-primary-50 to-primary-100",
    },
    {
      name: "Workshops",
      count: eventTypes.find((type: any) => type.type === "Workshop")?.count || 0,
      icon: <Wrench className="h-6 w-6" />,
      color: "from-emerald-50 to-emerald-100",
    },
    {
      name: "Hackathons",
      count: eventTypes.find((type: any) => type.type === "Hackathon")?.count || 0,
      icon: <Code className="h-6 w-6" />,
      color: "from-secondary-50 to-secondary-100",
    },
    {
      name: "Networking",
      count: eventTypes.find((type: any) => type.type === "Networking")?.count || 0,
      icon: <Network className="h-6 w-6" />,
      color: "from-amber-50 to-amber-100",
    },
  ];

  const recentEvents = events.slice(0, 3);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Campus Overview Section */}
      <div className="mb-8">
        <Card className="overflow-hidden">
          <div 
            className="h-48 bg-gradient-to-r from-primary-600 to-secondary-600 relative"
            style={{
              backgroundImage: "url('https://www.nssce.ac.in/assets/images/dept_pe.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/80 to-secondary-600/80" />
            <div className="relative p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                  <School className="h-8 w-8 text-primary-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{campus?.name || "Loading..."}</h1>
                  <p className="text-primary-100">{campus?.description || "Empowering innovation through collaborative learning"}</p>
                </div>
              </div>
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">{metrics.totalEvents}</div>
                <div className="text-sm text-gray-500">Total Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">{metrics.totalParticipants}</div>
                <div className="text-sm text-gray-500">Participants</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-600">{metrics.communitySize}</div>
                <div className="text-sm text-gray-500">Community Size</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">{metrics.thisMonth}</div>
                <div className="text-sm text-gray-500">This Month</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Activity Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Activity Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {activityTypes.map((activity) => (
                  <div key={activity.name} className={`bg-gradient-to-br ${activity.color} rounded-lg p-4 text-center`}>
                    <div className="w-12 h-12 bg-primary-600 rounded-lg mx-auto mb-2 flex items-center justify-center text-white">
                      {activity.icon}
                    </div>
                    <div className="text-sm font-medium text-gray-900">{activity.name}</div>
                    <div className="text-xs text-gray-500">{activity.count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full" 
                onClick={() => setShowEventModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Upload New Event
              </Button>
              <Button variant="outline" className="w-full">
                <School className="h-4 w-4 mr-2" />
                View School
              </Button>
              <Button variant="outline" className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics Panel
              </Button>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Team Management</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tech Team</span>
                    <span className="text-gray-900 font-medium">12</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Design Team</span>
                    <span className="text-gray-900 font-medium">8</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Content Team</span>
                    <span className="text-gray-900 font-medium">15</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Outreach Team</span>
                    <span className="text-gray-900 font-medium">20</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Events */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
          <Button variant="ghost">View all events</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentEvents.length > 0 ? (
            recentEvents.map((event: any) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" 
                  alt="Event" 
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{event.programType}</Badge>
                    <div className="flex items-center text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{event.rating}</span>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{event.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{event.participantCount} participants</span>
                    </div>
                    <span>{new Date(event.dateTime).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
              <p className="text-gray-500 mb-4">Start by creating your first event to see it here.</p>
              <Button onClick={() => setShowEventModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Event
              </Button>
            </div>
          )}
        </div>
      </div>

      <EventUploadModal 
        open={showEventModal} 
        onOpenChange={setShowEventModal}
      />
    </div>
  );
}
