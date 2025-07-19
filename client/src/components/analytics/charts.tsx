import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

interface EventType {
  type: string;
  count: number;
}

interface MonthlyData {
  month: string;
  participants: number;
}

interface AnalyticsChartsProps {
  eventTypes: EventType[];
  monthlyData: MonthlyData[];
}

const COLORS = {
  Talk: "#3B82F6",
  Workshop: "#10B981",
  Hackathon: "#8B5CF6",
  Networking: "#F59E0B",
  Seminar: "#EF4444",
};

export default function AnalyticsCharts({ eventTypes, monthlyData }: AnalyticsChartsProps) {
  const pieData = eventTypes.map(item => ({
    name: item.type,
    value: item.count,
    color: COLORS[item.type as keyof typeof COLORS] || "#6B7280"
  }));

  const barData = monthlyData.map(item => ({
    month: item.month.substring(0, 3), // Abbreviate month names
    participants: item.participants
  }));

  return (
    <>
      {/* Event Types Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Event Types Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} events`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p>No event data available</p>
                <p className="text-sm">Create events to see distribution</p>
              </div>
            </div>
          )}
          
          {/* Legend */}
          {pieData.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-gray-600">
                    {entry.name} ({entry.value})
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Participation Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Participation</CardTitle>
        </CardHeader>
        <CardContent>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} participants`, "Participants"]}
                />
                <Bar dataKey="participants" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p>No participation data available</p>
                <p className="text-sm">Event participation will appear here</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
