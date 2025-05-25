# Authentication Test Script

This script helps test the authentication flow in the ODR India application, particularly focusing on the Jitsi Meet integration.

## Prerequisites

- Next.js application running on development or production server
- Access to browser developer tools
- A test user account in the system

## Testing Steps

### 1. Basic Authentication Flow

1. **Log out to start fresh**
   - Visit `/api/auth/logout` or click logout button
   - Verify cookie `odrindia_session` is removed (check Application tab in DevTools)

2. **Sign in**
   - Visit `/signin` and log in with test credentials
   - Verify successful login redirect
   - Check that cookie `odrindia_session` is properly set (in Application tab in DevTools)

3. **Session persistence**
   - Refresh the page
   - Verify user remains logged in
   - Access a protected route like `/discussion/[ideaId]` and ensure it loads correctly

### 2. API Authentication Testing

Run these checks using browser DevTools on the Network tab:

1. **Check API requests**
   - Navigate to a meeting page
   - Monitor network requests to endpoints like `/api/meetings/[meetingId]`
   - Verify requests include cookie (check "Request Headers")
   - Verify responses have 200 status (not 401)

2. **Test MeetingLogs component**
   - Navigate to `/discussion/[ideaId]/workplace`
   - Check network request for meetings list
   - Verify authentication works properly

3. **Test JitsiMeetContainer**
   - Join a meeting
   - Monitor API calls from the JitsiMeetContainer component
   - Verify all API calls include cookies for authentication
   - Check meeting joins/leaves are recorded properly

4. **Test meeting notes functionality**
   - Create a new note in a meeting
   - Verify the API call includes cookie-based authentication
   - Refresh and check the note persists

### 3. Edge Cases

1. **Expired sessions**
   - Manually edit cookie to have expired timestamp
   - Try to access protected route
   - Verify redirect to login page

2. **Invalid session data**
   - Manually edit cookie with invalid content
   - Try to access protected route
   - Verify authentication fails appropriately

### 4. Database Connection Tests

1. **Database connection error handling**
   - If possible, temporarily block database connections
   - Verify application shows appropriate error messages
   - Check logs for proper connection error handling

2. **Connection recovery**
   - Restore database connection
   - Verify application recovers gracefully
   - Check user experience during recovery

## Manual Testing Checklist

- [ ] Login works properly with cookie auth
- [ ] Protected routes require authentication
- [ ] Meeting list loads with proper authentication
- [ ] Creating meetings works correctly
- [ ] Joining meetings works correctly
- [ ] Meeting notes save properly
- [ ] Session persists between page refreshes
- [ ] Logout clears session properly
- [ ] Invalid sessions handled gracefully
- [ ] Database connection issues handled properly
