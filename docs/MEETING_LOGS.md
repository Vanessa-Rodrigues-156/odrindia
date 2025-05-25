# Meeting Logs and Notes System

This module provides functionality to store and manage meeting logs and notes for workplace discussions in the ODR India platform.

## Features

- **Meeting Scheduling**: Create and schedule meetings with title, date, and time
- **Meeting Room Integration**: Integration with Jitsi Meet for video conferencing
- **Participant Tracking**: Record who joined and left the meeting, and when
- **Meeting Notes**: Collaborative note-taking during or after meetings
- **Meeting Summaries**: Add post-meeting summaries for reference
- **Meeting Control**: End meeting functionality for organizers and presenters
- **Authentication**: All features secured with proper authentication

## Database Schema

### MeetingLog
Stores information about meetings:
- `id`: Unique identifier
- `title`: Meeting title
- `startTime`: When the meeting starts/started
- `endTime`: When the meeting ended (if completed)
- `recordingUrl`: URL to recording (if available)
- `summary`: Summary of what was discussed
- `status`: SCHEDULED, IN_PROGRESS, COMPLETED, or CANCELLED
- `jitsiRoomName`: Unique room name for Jitsi

### MeetingParticipant
Tracks who participated in meetings:
- `id`: Unique identifier
- `userId`: Reference to User
- `meetingId`: Reference to MeetingLog
- `joinTime`: When participant joined
- `leaveTime`: When participant left
- `isPresenter`: Whether participant was a presenter

### MeetingNote
Stores notes taken during meetings:
- `id`: Unique identifier
- `content`: The note content
- `meetingId`: Reference to MeetingLog
- `authorId`: Reference to User who created note
- `lastEditedById`: Reference to User who last edited note

## API Endpoints

### Meetings

- `GET /api/meetings/[meetingId]`: Get meeting details
- `POST /api/meetings/create`: Create a new meeting
- `POST /api/meetings/update-status`: Update meeting status
- `POST /api/meetings/end-meeting`: End a meeting for all participants
- `GET /api/meetings/idea/[ideaId]`: Get all meetings for an idea

### Participants

- `POST /api/meetings/participant-joined`: Record participant join
- `POST /api/meetings/participant-left`: Record participant leave

### Notes

- `GET /api/meetings/[meetingId]/notes`: Get notes for a meeting
- `POST /api/meetings/[meetingId]/notes`: Add a note to a meeting

### Summary

- `POST /api/meetings/[meetingId]/summary`: Add/update meeting summary

## Components

### MeetingLogs
Displays list of meetings for an idea and allows scheduling new meetings

### MeetingNotes
Displays and manages notes for a specific meeting

### JitsiMeetContainer
Handles video conferencing and automatically tracks meeting activity:
- Controls for audio and video (mute/unmute)
- End meeting button for organizers and presenters
- Automatic participant tracking
- Connection status monitoring

## Authentication

All API endpoints are protected and require authentication. The system uses cookie-based authentication with the `odrindia_session` cookie. Requests must include `credentials: 'include'` to ensure cookies are sent with each request.

## How to Use

1. View meetings for an idea in the workspace page
2. Schedule a new meeting with title, date and time
3. Join a meeting when it's time
4. Take notes during the meeting
5. End the meeting by clicking the "End Meeting" button (requires presenter/organizer privileges)
6. Add a summary after the meeting ends

## Development

The database schema can be updated using:

```bash
npm run db:migrate
```

For production deployment:

```bash
npm run prisma:deploy
```
