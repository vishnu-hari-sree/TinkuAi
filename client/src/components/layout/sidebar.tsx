import { useState } from "react";
import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarContent, AvatarFallback } from "@/components/ui/avatar";
import { 
  Bolt, 
  Home, 
  Calendar, 
  CalendarDays, 
  BarChart3, 
  Users, 
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/lib/auth";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Calendar", href: "/calendar", icon: CalendarDays },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Community", href: "/community", icon: Users },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Toggle mobile sidebar
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center px-4 py-5">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <Bolt className="h-5 w-5 text-white" />
        </div>
        <h1 className="ml-3 text-xl font-bold text-gray-900">TinkerPulse</h1>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-1">
        {navigation.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
              onClick={() => setIsMobileOpen(false)}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5",
                  isActive ? "text-primary-500" : "text-gray-400"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      {/* User Profile */}
      <div className="flex-shrink-0 px-2 pb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary-600 text-white text-sm">
                {user ? getInitials(user.name) : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role?.replace("_", " ") || "Member"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="w-full mt-2 text-xs"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleMobile}
          className="bg-white border-gray-300"
        >
          {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile sidebar overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <div className={cn(
        "md:hidden fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <SidebarContent />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r border-gray-200">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}
