import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Events from "@/pages/events";
import Calendar from "@/pages/calendar";
import Analytics from "@/pages/analytics";
import Community from "@/pages/community";
import Login from "@/pages/login";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import AIChatbot from "@/components/chat/ai-chatbot";
import { useAuth } from "@/lib/auth";

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      {/* Main content with proper responsive margins */}
      <div className="md:pl-64">
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 overflow-y-auto bg-gray-50 pt-16 md:pt-0">
            {children}
          </main>
        </div>
      </div>
      <AIChatbot />
    </div>
  );
}

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <AuthenticatedLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/events" component={Events} />
        <Route path="/calendar" component={Calendar} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/community" component={Community} />
        <Route component={NotFound} />
      </Switch>
    </AuthenticatedLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
