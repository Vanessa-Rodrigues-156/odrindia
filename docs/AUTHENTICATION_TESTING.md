# Authentication Testing Guide

This guide helps test and troubleshoot the authentication flow in the ODR LAB platform, including both token-based auth and integrations like Jitsi Meet.

## Authentication System Overview

The ODR LAB platform uses JWT (JSON Web Token) based authentication:

- Tokens are stored in browser's localStorage
- API requests use Bearer token authentication
- Protected routes are guarded on both client and server sides

## Prerequisites

- Next.js application running on development or production server
- Backend API server running
- Access to browser developer tools
- A test user account in the system

## Testing Steps

### 1. Basic Authentication Flow

1. **Log out to start fresh**
   - Click the logout button or manually remove token:
     - Open browser dev tools → Application → Local Storage
     - Delete the "token" entry
   - Verify localStorage no longer has the token

2. **Sign in**
   - Visit `/signin` and log in with test credentials
   - Verify successful login redirect
   - Check that token is properly set in localStorage
   - Open the debug page at `/debug/auth-test` to verify token and user details

3. **Session persistence**
   - Refresh the page
   - Verify user remains logged in
   - Access a protected route like `/odrlabs` or `/discussion/[ideaId]` and ensure it loads correctly
   - Check network requests to ensure Authorization headers are being sent

### 2. API Authentication Testing

Run these checks using browser DevTools on the Network tab:

1. **Check API requests**
   - Navigate to a protected page (like `/odrlabs` or admin pages)
   - Monitor network requests to backend API endpoints
   - Verify requests include the Authorization header with Bearer token
   - Verify responses have 200 status (not 401)
   - Check the `/api/auth/debug` endpoint (in development) for detailed token info

2. **Test Admin Access**
   - Log in as an admin user
   - Navigate to `/admin/idea-approval` 
   - Verify the page loads with idea submissions
   - Check that API requests include proper authorization

3. **Test Jitsi Integration**
   - Navigate to meeting pages that use JitsiMeetContainer
   - Join a meeting
   - Monitor API calls from the JitsiMeetContainer component
   - Verify all API calls include proper authentication headers
   - Check meeting joins/leaves are recorded properly

4. **Test Protected Operations**
   - Submit a new idea at `/submit-idea`
   - Review an idea as admin
   - Verify all operations work with the authentication system
   - Check that unauthorized users can't access protected operations

### 3. Edge Cases and Security Testing

1. **Expired tokens**
   - Create a test token with an immediate expiration
   - Try to access protected route
   - Verify redirect to login page occurs
   - Check server logs for proper expiration handling

2. **Invalid token data**
   - Manually edit localStorage token to be invalid
   - Try to access protected route
   - Verify authentication fails appropriately with proper error message

3. **Role-based access control**
   - Login as a regular user (non-admin)
   - Try to access admin routes (e.g., `/admin/idea-approval`)
   - Verify access is denied with appropriate messages
   - Check that attempt is properly logged

4. **Cross-Site Request Forgery protection**
   - Verify that API endpoints that change data require proper authentication
   - Test that requests from other origins are handled correctly

### 4. New Authentication Debug Tool

A special debug tool has been added at `/debug/auth-test` that shows:
- Current authentication state from React context
- Token validation status
- Detailed user information
- Authentication header information

This tool is extremely valuable for diagnosing auth issues in development.

### 5. Troubleshooting Common Issues

1. **Login doesn't work:**
   - Check browser console for API errors
   - Verify credentials in database
   - Test with the debug tool to see detailed error info
   
2. **Infinite redirect loops:**
   - Clear browser storage completely
   - Check routing guards for proper redirect handling
   - Verify PageGuard component is checking current path

3. **Token validation issues:**
   - Check JWT_SECRET in backend .env file
   - Verify token format in localStorage
   - Manually decode token at jwt.io to check claims

## Manual Testing Checklist

- [ ] Login works properly with JWT token auth
- [ ] Protected routes require authentication
- [ ] Admin routes require admin role
- [ ] Idea submission workflow functions correctly
- [ ] Idea approval workflow functions for admins
- [ ] Session persists between page refreshes
- [ ] Logout clears token properly
- [ ] Invalid tokens are rejected with proper messages
- [ ] Expired tokens prompt re-authentication
- [ ] Authentication debug tool shows correct information
