import { Button } from "@/components/ui/button";
import { Bell, Plus } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import EventUploadModal from "@/components/events/event-upload-modal";

const pagetitles: Record<string, string> = {
  "/": "Community Dashboard",
  "/dashboard": "Community Dashboard",
  "/events": "Events",
  "/calendar": "Event Calendar",
  "/analytics": "Analytics Dashboard",
  "/community": "Community Management",
};

export default function Header() {
  const [location] = useLocation();
  const [showEventModal, setShowEventModal] = useState(false);
  
  const currentTitle = pagetitles[location] || "TinkerPulse";

  return (
    <>
      <div className="bg-white shadow-sm border-b border-gray-200 fixed md:relative top-0 left-0 right-0 z-30 md:z-auto">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center pl-12 md:pl-0">
              <h2 className="text-lg font-semibold text-gray-900">{currentTitle}</h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <Button onClick={() => setShowEventModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Event
              </Button>
            </div>
          </div>
        </div>
      </div>

      <EventUploadModal 
        open={showEventModal} 
        onOpenChange={setShowEventModal}
      />
    </>
  );
}
