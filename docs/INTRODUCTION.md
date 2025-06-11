# ODR India - Full-Stack Application

## Project Overview
An Online Dispute Resolution (ODR) platform where users can submit ideas, collaborate with mentors, and access ODR resources and tools.

## Project Structure

### Backend (`/backend`)
- **Technology**: Express.js/Node.js API with TypeScript
- **Database**: Prisma ORM
- **Authentication**: JWT with role-based access control
- **API Routes**:
    - `/api/auth` - Authentication (login, signup, Google OAuth)
    - `/api/ideas` - Idea management and submissions
    - `/api/chat` - AI chatbot integration (Together AI)
    - `/api/admin` - Admin panel for idea approval
    - `/api/mentors` - Mentor management
    - `/api/meetings` - Meeting/collaboration features
    - `/api/odrlabs` - ODR Lab functionality
    - `/api/discussion` - Discussion forums

### Frontend (`/odrindia`)
- **Framework**: Next.js 13+ with App Router
- **Stack**: TypeScript, Tailwind CSS, Framer Motion, Radix UI
- **Key Features**:
    - Authentication with Google OAuth
    - Idea submission and approval workflow
    - AI-powered chatbot
    - Mentor directory
    - Video conferencing (Jitsi Meet)
    - Admin dashboard
    - Discussion boards

## Key Technologies

### Backend
- Express.js + TypeScript
- Prisma ORM
- JWT authentication
- Together AI for chatbot
- CORS configuration for production

### Frontend
- Next.js 13+ (App Router)
- React with TypeScript
- Tailwind CSS
- Framer Motion
- Radix UI components
- Custom auth context/hooks

## Notable Features
- **Role-based Access Control**: ADMIN, MENTOR, INNOVATOR roles
- **Idea Submission Workflow**: Submit → Admin Review → Publish
- **AI Chatbot**: Legal assistant using Together AI
- **Video Collaboration**: Jitsi Meet integration
- **Responsive Design**: Mobile-first approach
- **Authentication Guards**: Protected routes and components
