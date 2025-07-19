# TinkerPulse - Student Community Event Management Platform

## Overview

TinkerPulse is a comprehensive web application designed to empower student-led communities by streamlining event planning, avoiding scheduling conflicts, analyzing participation trends, and using AI to improve event organization. The platform serves as a centralized hub for campus organizations to manage events, track analytics, and leverage AI-powered insights for better event planning.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack React Query for server state management
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (via Neon Database serverless)
- **AI Integration**: Google Gemini API for event planning assistance
- **Session Storage**: Connect-pg-simple for PostgreSQL session storage

### Key Components

#### Authentication System
- Simple email/password authentication
- Role-based access control (member, campus_lead, admin)
- Session-based authentication with localStorage fallback
- Campus lead permissions for event management

#### Event Management
- Comprehensive event creation with rich metadata
- Support for multiple event types (Talk, Workshop, Hackathon, Networking, Seminar)
- Event modes (Online, Offline, Hybrid)
- Image upload capabilities via Supabase storage
- Participant tracking and expense management
- Rating system for event feedback

#### Calendar Integration
- Interactive calendar views (month, week, day)
- Event scheduling and conflict detection
- Date range filtering and navigation
- Visual event representation with type-based color coding

#### Analytics Dashboard
- Event type distribution analytics
- Monthly participation trends
- Top-rated events tracking
- Campus-wide metrics and insights
- Visual charts using Recharts library

#### AI-Powered Chatbot
- Integration with Google Gemini 2.5 Flash model
- Event planning assistance and recommendations
- Context-aware responses based on past events
- Real-time chat interface with message history

## Data Flow

### Database Schema
- **Users**: Authentication and role management
- **Campuses**: Multi-campus support with customizable branding
- **Events**: Comprehensive event data with rich metadata
- **Chat Sessions**: AI interaction history and context

### API Architecture
- RESTful API endpoints under `/api` namespace
- Consistent error handling and response formatting
- Request logging and performance monitoring
- Type-safe request/response validation using Zod schemas

### State Management Flow
1. Client requests data via React Query
2. API routes handle business logic and database operations
3. Drizzle ORM manages database interactions
4. Response data cached and managed by React Query
5. UI components reactively update based on state changes

## External Dependencies

### Core Dependencies
- **Database**: Neon Database (PostgreSQL serverless)
- **AI Service**: Google Gemini API for chat functionality
- **File Storage**: Supabase for event image uploads
- **UI Components**: Radix UI primitives with shadcn/ui styling

### Development Tools
- **TypeScript**: Type safety across the entire stack
- **ESLint/Prettier**: Code formatting and linting
- **Vite**: Development server and build optimization
- **Drizzle Kit**: Database schema management and migrations

## Deployment Strategy

### Build Process
1. Frontend build via Vite (outputs to `dist/public`)
2. Backend build via esbuild (outputs to `dist/index.js`)
3. Static assets served from build directory
4. Environment variable configuration for production

### Environment Configuration
- Database connection via `DATABASE_URL`
- Gemini API key for AI functionality
- Supabase credentials for file storage
- Session configuration for authentication

### Development vs Production
- Development: Vite dev server with HMR and middleware mode
- Production: Express serves static files and API routes
- Database migrations managed via Drizzle Kit
- Replit-specific optimizations and banner injection

The application follows a modern full-stack architecture with clear separation of concerns, type safety throughout, and scalable patterns for growth. The AI integration and comprehensive analytics make it particularly suited for data-driven event planning in student communities.