# Jitsi Meet Integration Documentation

## Overview

This document provides details about the Jitsi Meet integration in the ODR India application, focusing on the authentication flow, database connection handling, and navigation between pages.

## Authentication Flow

### Cookie-based Authentication

The application uses cookie-based authentication for secure user sessions. The authentication flow works as follows:

1. User logs in via `/api/auth/login` endpoint
2. Server creates a session and sets the `odrindia_session` cookie
3. All subsequent API requests include this cookie automatically with `credentials: 'include'`
4. Server-side APIs validate the cookie using `getJwtUser()` in `auth-server.ts`

#### Key Benefits of Cookie-based Authentication:

- **Security**: Cookies can be set as HTTP-only, preventing JavaScript access
- **CSRF Protection**: When properly configured with SameSite attribute
- **Simplicity**: Automatically included in requests to the same domain
- **Production Ready**: Stateless when using JWT in cookies

### Implementation Details

All components have been updated to use cookie-based authentication instead of header-based authentication (`x-auth-user`):

- Removed all instances of `'x-auth-user': encodeURIComponent(JSON.stringify(user))`
- Added `credentials: 'include'` to all fetch requests
- Updated server-side authentication to prioritize cookie-based authentication

## Database Connection Handling

The application uses Prisma as an ORM to connect to the database. The following improvements have been made:

1. **Connection Pooling**: Prisma client is configured as a singleton to prevent connection exhaustion
2. **Error Handling**: Added robust error handling for database connection issues
3. **Retry Logic**: Implemented retry mechanisms for transient connection failures
4. **Graceful Degradation**: The application provides meaningful feedback when the database is unavailable

## Navigation and Page Structure

### Meeting Flow

1. **Workplace Page**: Shows all meetings for an idea
   - Path: `/discussion/[ideaId]/workplace`
   - Component: `MeetingLogs.tsx` for displaying meetings list

2. **Meeting Detail Page**: Shows a specific meeting with Jitsi integration
   - Path: `/discussion/[ideaId]/meetings/[meetingId]`
   - Components: 
     - `JitsiMeetContainer.tsx` for video conferencing
     - `MeetingNotes.tsx` for collaborative note-taking
   
3. **Authentication**: All meeting pages are protected and require authentication

## Troubleshooting

### Authentication Issues

If authentication issues occur, check:

1. Cookie configuration in `login/route.ts`
2. Server-side authentication in `auth-server.ts`
3. Client requests include `credentials: 'include'`

### Jitsi Connection Issues

If Jitsi meetings don't connect:

1. Check network connectivity to Jitsi server
2. Ensure the `NEXT_PUBLIC_JITSI_SERVER` environment variable is correctly set
3. Check browser permissions for camera and microphone
4. Verify that the meeting room is correctly created in the database

## Production Considerations

For production deployments:

1. Configure secure cookies with appropriate domain and path
2. Set up proper CORS headers for API routes
3. Consider rate limiting for meeting creation
4. Monitor database connection pool health
5. Set up error tracking and logging
6. Consider using a CDN for static assets
7. Implement HTTPS for all connections
