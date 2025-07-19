import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { Users, Settings, Camera, MapPin, School, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function Community() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const { data: campus, isLoading } = useQuery({
    queryKey: ["/api/campuses", user?.campusId],
    enabled: !!user?.campusId,
  });

  const { data: events = [] } = useQuery({
    queryKey: ["/api/events"],
    queryFn: () => fetch(`/api/events?campusId=${user?.campusId}`).then(res => res.json()),
    enabled: !!user?.campusId,
  });

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  const totalParticipants = events.reduce((sum: number, event: any) => sum + (event.participantCount || 0), 0);
  const thisMonth = events.filter((event: any) => {
    const eventDate = new Date(event.dateTime);
    const now = new Date();
    return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
  }).length;

  const teamData = [
    { name: "Tech Team", count: 12, color: "bg-blue-100 text-blue-700", description: "Full-stack developers, DevOps engineers" },
    { name: "Design Team", count: 8, color: "bg-purple-100 text-purple-700", description: "UI/UX designers, graphic artists" },
    { name: "Content Team", count: 15, color: "bg-green-100 text-green-700", description: "Technical writers, social media managers" },
    { name: "Outreach Team", count: 20, color: "bg-orange-100 text-orange-700", description: "Event coordinators, community managers" },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Community Management</h1>
          <p className="text-gray-500 mt-1">Manage campus information and team structure</p>
        </div>
        <Button 
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "default" : "outline"}
        >
          <Settings className="h-4 w-4 mr-2" />
          {isEditing ? "Save Changes" : "Edit Community"}
        </Button>
      </div>

      {/* Campus Information */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Campus Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Campus Banner */}
          <div 
            className="h-48 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg relative overflow-hidden"
            style={{
              backgroundImage: "url('https://www.nssce.ac.in/assets/images/dept_pe.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600/80 to-secondary-600/80" />
            <div className="relative p-6 text-white flex items-end h-full">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                  <School className="h-8 w-8 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{campus?.name || "Campus Name"}</h2>
                  <p className="text-primary-100">{campus?.description || "Campus description"}</p>
                </div>
              </div>
              {isEditing && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="absolute top-4 right-4"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Change Banner
                </Button>
              )}
            </div>
          </div>

          {/* Edit Form */}
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="campusName">Campus Name</Label>
                <Input 
                  id="campusName"
                  defaultValue={campus?.name || ""} 
                  placeholder="Enter campus name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="memberCount">Total Members</Label>
                <Input 
                  id="memberCount"
                  type="number"
                  defaultValue={campus?.memberCount || 0} 
                  placeholder="Number of members"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  defaultValue={campus?.description || ""} 
                  placeholder="Describe your campus community"
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">{events.length}</div>
                <div className="text-sm text-gray-500">Total Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">{totalParticipants}</div>
                <div className="text-sm text-gray-500">Total Participants</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-600">{campus?.memberCount || 0}</div>
                <div className="text-sm text-gray-500">Community Size</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">{thisMonth}</div>
                <div className="text-sm text-gray-500">This Month</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Team Management */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Team Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamData.map((team) => (
              <Card key={team.name} className="border-2 border-gray-100 hover:border-gray-200 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{team.name}</h3>
                      <p className="text-sm text-gray-500">{team.description}</p>
                    </div>
                    <Badge className={team.color}>
                      {team.count} members
                    </Badge>
                  </div>
                  
                  {isEditing && (
                    <div className="space-y-2">
                      <Input 
                        type="number" 
                        defaultValue={team.count}
                        placeholder="Number of members"
                        className="w-full"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {isEditing && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Add New Team</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input placeholder="Team name" />
                <Input type="number" placeholder="Member count" />
                <Button>Add Team</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.slice(0, 5).map((event: any) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">{event.name}</p>
                    <p className="text-sm text-gray-500">
                      {event.programType} • {new Date(event.dateTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge variant="outline">
                  {event.participantCount || 0} participants
                </Badge>
              </div>
            ))}
            
            {events.length === 0 && (
              <div className="text-center py-8">
                <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
                <p className="text-gray-500">Recent events and updates will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
