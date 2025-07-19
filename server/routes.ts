import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertEventSchema, insertChatSessionSchema } from "@shared/schema";
import { z } from "zod";
import { summarizeArticle, generateEventSuggestions, analyzeEventData, planEventStructure } from "./services/gemini";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const chatMessageSchema = z.object({
  message: z.string().min(1),
  userId: z.number(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, you'd use proper session management
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.status(201).json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  // Campus routes
  app.get("/api/campuses", async (req, res) => {
    try {
      const campuses = await storage.getAllCampuses();
      res.json(campuses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campuses" });
    }
  });

  app.get("/api/campuses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const campus = await storage.getCampus(id);
      
      if (!campus) {
        return res.status(404).json({ message: "Campus not found" });
      }
      
      res.json(campus);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campus" });
    }
  });

  // Event routes
  app.get("/api/events", async (req, res) => {
    try {
      const campusId = parseInt(req.query.campusId as string);
      if (!campusId) {
        return res.status(400).json({ message: "Campus ID is required" });
      }
      
      const events = await storage.getEventsByCampus(campusId);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.post("/api/events", async (req, res) => {
    console.log(process.env.DATABASE_URL)
    try {
      const eventData = insertEventSchema.parse(req.body);
      
      // Check for date conflicts
      const startDate = new Date(eventData.dateTime);
      const endDate = eventData.endDateTime ? new Date(eventData.endDateTime) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours
      
      const conflictingEvents = await storage.getEventsInDateRange(
        eventData.campusId,
        new Date(startDate.getTime() - 60 * 60 * 1000), // 1 hour buffer
        new Date(endDate.getTime() + 60 * 60 * 1000)
      );
      
      if (conflictingEvents.length > 0) {
        return res.status(409).json({ 
          message: "Event conflicts with existing events",
          conflicts: conflictingEvents
        });
      }
      
      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      res.status(400).json({ message: "Invalid event data" });
    }
  });

  app.put("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertEventSchema.partial().parse(req.body);
      
      const event = await storage.updateEvent(id, updates);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteEvent(id);
      
      if (!success) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/event-types/:campusId", async (req, res) => {
    try {
      const campusId = parseInt(req.params.campusId);
      const distribution = await storage.getEventTypeDistribution(campusId);
      res.json(distribution);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.get("/api/analytics/monthly-participation/:campusId", async (req, res) => {
    try {
      const campusId = parseInt(req.params.campusId);
      const year = parseInt(req.query.year as string) || new Date().getFullYear();
      const data = await storage.getMonthlyParticipation(campusId, year);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch participation data" });
    }
  });

  app.get("/api/analytics/top-rated/:campusId", async (req, res) => {
    try {
      const campusId = parseInt(req.params.campusId);
      const limit = parseInt(req.query.limit as string) || 5;
      const events = await storage.getTopRatedEvents(campusId, limit);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top rated events" });
    }
  });

  // AI Chat routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, userId } = chatMessageSchema.parse(req.body);
      
      // Get user's campus for context
      const user = await storage.getUser(userId);
      const campusEvents = user?.campusId ? await storage.getEventsByCampus(user.campusId) : [];
      
      let aiResponse: string;
      
      // Determine the type of request and use appropriate AI function
      if (message.toLowerCase().includes("plan") && (message.toLowerCase().includes("hackathon") || message.toLowerCase().includes("workshop") || message.toLowerCase().includes("event"))) {
        // Event planning request
        const eventType = message.toLowerCase().includes("hackathon") ? "hackathon" : 
                         message.toLowerCase().includes("workshop") ? "workshop" : "event";
        const duration = message.toLowerCase().includes("day") ? message.match(/(\d+)\s*day/i)?.[1] + " day" || "1 day" : "1 day";
        aiResponse = await planEventStructure(eventType, duration, 50);
      } else if (message.toLowerCase().includes("suggest") || message.toLowerCase().includes("recommend")) {
        // Event suggestion request
        const month = new Date().toLocaleString('default', { month: 'long' });
        aiResponse = await generateEventSuggestions(campusEvents, month);
      } else if (message.toLowerCase().includes("analyz") || message.toLowerCase().includes("data") || message.toLowerCase().includes("insight")) {
        // Data analysis request
        aiResponse = await analyzeEventData(campusEvents);
      } else {
        // General event planning advice
        aiResponse = await summarizeArticle(`User message about event planning: ${message}. Provide helpful suggestions for student community event planning.`);
      }
      
      // Save chat session
      await storage.createChatSession({
        userId,
        message,
        response: aiResponse,
      });
      
      res.json({ response: aiResponse });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  app.get("/api/chat/history/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = parseInt(req.query.limit as string) || 10;
      const history = await storage.getChatHistory(userId, limit);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
