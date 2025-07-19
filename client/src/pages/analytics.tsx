import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { BarChart3, PieChart, TrendingUp, Star } from "lucide-react";
import AnalyticsCharts from "@/components/analytics/charts";

export default function Analytics() {
  const { user } = useAuth();

  const { data: eventTypes = [], isLoading: loadingTypes } = useQuery({
    queryKey: ["/api/analytics/event-types", user?.campusId],
    enabled: !!user?.campusId,
  });

  const { data: monthlyData = [], isLoading: loadingMonthly } = useQuery({
    queryKey: ["/api/analytics/monthly-participation", user?.campusId],
    queryFn: () => fetch(`/api/analytics/monthly-participation/${user?.campusId}?year=${new Date().getFullYear()}`).then(res => res.json()),
    enabled: !!user?.campusId,
  });

  const { data: topRatedEvents = [], isLoading: loadingTopRated } = useQuery({
    queryKey: ["/api/analytics/top-rated", user?.campusId],
    enabled: !!user?.campusId,
  });

  const isLoading = loadingTypes || loadingMonthly || loadingTopRated;

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  const totalEvents = eventTypes.reduce((sum: number, type: any) => sum + type.count, 0);
  const totalParticipants = monthlyData.reduce((sum: number, month: any) => sum + month.participants, 0);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-500 mt-1">Insights into your community's event performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{totalEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-emerald-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Participants</p>
                <p className="text-2xl font-bold text-gray-900">{totalParticipants.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <PieChart className="h-8 w-8 text-secondary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Participation</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalEvents > 0 ? Math.round(totalParticipants / totalEvents) : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-amber-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {topRatedEvents.length > 0 
                    ? (topRatedEvents.reduce((sum: number, event: any) => sum + event.rating, 0) / topRatedEvents.length).toFixed(1)
                    : "N/A"
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AnalyticsCharts 
          eventTypes={eventTypes}
          monthlyData={monthlyData}
        />
      </div>

      {/* Top Rated Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 text-amber-500 mr-2" />
            Top Rated Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topRatedEvents.length > 0 ? (
            <div className="space-y-4">
              {topRatedEvents.map((event: any, index: number) => (
                <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-700">#{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{event.name}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(event.dateTime).toLocaleDateString()} • {event.programType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{event.participantCount} participants</p>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-amber-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900 ml-1">{event.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No rated events yet</h3>
              <p className="text-gray-500">Events with ratings will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
