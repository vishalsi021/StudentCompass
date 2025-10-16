# WhatToBuild College Edition

## Overview

WhatToBuild College Edition is a student-focused SaaS platform that provides AI-powered project recommendations to help college students build portfolios, track learning progress, and develop career-ready skills. The platform analyzes student profiles (branch, skills, interests) and suggests personalized projects from a curated database, complete with difficulty ratings, skill requirements, and resume-worthy outcomes.

**Core Features:**
- AI-powered project recommendations based on student skills and academic branch
- Progress tracking with step-by-step completion monitoring
- Student comparison tool for collaborative learning
- GitHub repository analysis for skill validation
- Dashboard with learning metrics and streaks

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling:**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server
- **Wouter** for lightweight client-side routing
- **TanStack Query (React Query)** for server state management with automatic caching and refetching

**UI Design System:**
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom design tokens
- **Design Philosophy:** Productivity-focused design inspired by Linear's clean aesthetics combined with Notion's educational warmth
- **Theme Support:** Built-in dark/light mode with custom color palettes optimized for data visualization
- **Typography:** Inter for UI/body text, JetBrains Mono for code/data display

**State Management:**
- Authentication state managed via React Context (`AuthProvider`)
- Server state cached and synchronized with TanStack Query
- Form state handled by React Hook Form with Zod validation

**Key UI Patterns:**
- Sidebar navigation with collapsible state persistence
- Protected routes with authentication guards
- Toast notifications for user feedback
- Skeleton loaders for async content

### Backend Architecture

**Runtime & Framework:**
- **Node.js** with TypeScript (ESM modules)
- **Express.js** for HTTP server and RESTful API endpoints
- **Session-based authentication** using Passport.js with local strategy

**API Design:**
- RESTful endpoints under `/api/*` namespace
- Session cookies for authentication (secure, HTTP-only)
- JSON request/response format
- Error handling middleware for consistent error responses

**Key API Endpoints:**
- `GET/POST /api/user` - User authentication and profile
- `GET /api/projects` - Retrieve all available projects
- `POST /api/recommend` - Generate AI recommendations
- `GET /api/progress` - Student progress tracking
- `POST /api/compare` - Compare two students
- `POST /api/analyze` - Analyze GitHub repositories

### Data Storage

**Database:**
- **PostgreSQL** via Neon serverless driver
- **Drizzle ORM** for type-safe database queries and schema management
- **Connection Pooling** using `@neondatabase/serverless` with WebSocket support

**Schema Design:**
- `users` - Student profiles with skills array, branch, GitHub username
- `projects` - Curated projects with difficulty, required skills, descriptions
- `progress` - Step-by-step tracking of student work on projects
- `recommendations` - AI-generated project suggestions with match percentages and resume points
- `comparisons` - Student comparison results
- `enrollments` - Project enrollment tracking

**Data Patterns:**
- Arrays stored as PostgreSQL array types for skills
- JSON fields for flexible metadata storage
- Cascade deletes for referential integrity
- Timestamps for audit trails

**Session Storage:**
- PostgreSQL-backed sessions using `connect-pg-simple`
- Session data persisted in database for horizontal scaling

### AI Integration

**AI Provider:**
- **OpenAI API** (GPT-5 model as of August 2025)
- API key configured via environment variables

**AI Capabilities:**
1. **Project Recommendations:**
   - Analyzes student skills vs. project requirements
   - Calculates match percentages (0-100)
   - Generates resume bullet points for each project
   - Provides reasoning for recommendations

2. **Repository Analysis:**
   - Extracts skills from GitHub repositories
   - Assesses code complexity (Low/Medium/High)
   - Provides learning insights and portfolio impact analysis

**AI Service Architecture:**
- Centralized AI service module (`server/ai-service.ts`)
- Structured prompts with JSON response formatting
- Error handling for API failures
- Type-safe input/output interfaces

### Authentication & Security

**Authentication Strategy:**
- **Passport.js** with LocalStrategy for username/password authentication
- **Password Security:** Scrypt hashing with random salts
- **Session Management:** Express-session with PostgreSQL store
- **CSRF Protection:** Trust proxy configuration for secure cookies

**Security Measures:**
- Password hashing with timing-safe comparison
- Session secrets from environment variables
- Protected API routes with authentication middleware
- Client-side route guards for protected pages

### Development & Deployment

**Development Environment:**
- Hot module replacement (HMR) via Vite
- Development-only Replit plugins (cartographer, dev banner, runtime error overlay)
- TypeScript strict mode with path aliases (`@/*`, `@shared/*`)

**Build Process:**
- Frontend: Vite builds React app to `dist/public`
- Backend: esbuild bundles Node.js server to `dist`
- Database migrations via Drizzle Kit

**Environment Configuration:**
- `DATABASE_URL` - PostgreSQL connection string (required)
- `OPENAI_API_KEY` - OpenAI API authentication (required)
- `SESSION_SECRET` - Session encryption key (required)
- `NODE_ENV` - Environment flag (development/production)

**Deployment Strategy:**
- Single-server architecture with Express serving both API and static files
- Production mode serves pre-built Vite assets
- Database migrations run via `npm run db:push`

## External Dependencies

### Third-Party Services

**AI & Machine Learning:**
- **OpenAI** - GPT-5 API for project recommendations and repository analysis
  - Used for natural language processing and intelligent matching
  - Requires API key configuration

**Database:**
- **Neon (PostgreSQL)** - Serverless PostgreSQL database
  - Provides scalable, managed database infrastructure
  - WebSocket connections for real-time capabilities
  - Connection pooling for performance

### Key NPM Packages

**Frontend Core:**
- `react` & `react-dom` - UI framework
- `@tanstack/react-query` - Server state management
- `wouter` - Lightweight routing
- `react-hook-form` - Form management
- `zod` - Schema validation

**UI Components:**
- `@radix-ui/*` - Headless UI primitives (accordion, dialog, dropdown, etc.)
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` - Component variant management
- `lucide-react` - Icon library

**Backend Core:**
- `express` - Web server framework
- `passport` & `passport-local` - Authentication
- `express-session` - Session middleware
- `connect-pg-simple` - PostgreSQL session store

**Database & ORM:**
- `drizzle-orm` - Type-safe ORM
- `drizzle-zod` - Zod schema generation
- `@neondatabase/serverless` - Neon PostgreSQL driver

**AI Integration:**
- `openai` - Official OpenAI SDK

**Development Tools:**
- `vite` - Build tool and dev server
- `typescript` - Type system
- `tsx` - TypeScript execution
- `esbuild` - JavaScript bundler