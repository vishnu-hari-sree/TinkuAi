<img width="2048" height="1152" alt="image" src="https://github.com/user-attachments/assets/dfe5f484-aa90-4411-a148-8ecb214e95f3" />


# TinkerPulse - Campus Event Management Platform

A modern, AI-powered event management platform designed for student communities and campus organizations. Built with React, TypeScript, Express.js, and PostgreSQL, featuring an intelligent AI chatbot for event planning assistance.

## 🚀 Features

### Core Functionality
- **Event Management**: Create, edit, and manage campus events with detailed information
- **Calendar Integration**: Visual calendar interface with month/week/day views
- **Analytics Dashboard**: Comprehensive insights into event performance and participation
- **Community Management**: Campus information and team structure management
- **AI-Powered Assistant**: Intelligent chatbot for event planning and suggestions

### Event Types Supported
- **Talks**: Guest lectures, presentations, and knowledge sharing sessions
- **Workshops**: Hands-on learning and skill development sessions
- **Hackathons**: Coding competitions and innovation challenges
- **Networking**: Professional networking and community building events
- **Seminars**: Educational and training sessions

### AI Assistant Capabilities
- Event structure planning and logistics
- Event timing recommendations based on student schedules
- Data analysis and performance insights
- Event suggestions based on past success patterns
- Budget estimation and resource planning

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling and development
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Query** for data fetching and caching
- **Wouter** for routing
- **Framer Motion** for animations
- **Recharts** for data visualization

### Development Tools
- **TypeScript** for type safety
- **ESBuild** for production builds
- **Drizzle Kit** for database migrations
- **Zod** for schema validation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TinkuAi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   PORT=5000
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

### Production Build

```bash
npm run build
npm start
```

### Key Features
- Role-based access control
- Event conflict detection
- Comprehensive analytics tracking
- AI conversation persistence


### Events
- `GET /api/events` - Get events by campus
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Analytics
- `GET /api/analytics/event-types/:campusId` - Event type distribution
- `GET /api/analytics/monthly-participation/:campusId` - Monthly participation data
- `GET /api/analytics/top-rated/:campusId` - Top rated events

### AI Chat
- `POST /api/chat` - Send message to AI assistant
- `GET /api/chat/history/:userId` - Get chat history

### Campuses
- `GET /api/campuses` - Get all campuses
- `GET /api/campuses/:id` - Get specific campus

## 🎨 UI Components

The application uses a comprehensive set of UI components built with Radix UI and styled with Tailwind CSS:

- **Layout Components**: Header, sidebar, navigation
- **Data Display**: Cards, tables, badges, avatars
- **Forms**: Inputs, selects, textareas, checkboxes
- **Feedback**: Toasts, alerts, progress indicators
- **Navigation**: Breadcrumbs, pagination, tabs
- **Overlays**: Modals, popovers, tooltips

## 🤖 AI Integration

The platform integrates Google Gemini AI for intelligent event planning assistance:

- **Event Planning**: Structured event planning with timelines and resources
- **Data Analysis**: Insights from past event performance
- **Suggestions**: AI-powered event recommendations
- **General Assistance**: Event planning advice and best practices

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile devices

## Screenshots
   ![WhatsApp Image 2025-07-20 at 06 36 21_6c03eadf](https://github.com/user-attachments/assets/b350270c-21ed-4877-a404-b103cba54b28)

## Demo
   https://www.youtube.com/watch?v=a3azO3YRU1E

## 🔒 Security Features

- Input validation with Zod schemas
- SQL injection prevention with Drizzle ORM
- Role-based access control
- Secure session management

## 🚀 Deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

---

**Built with ❤️ for student communities**
