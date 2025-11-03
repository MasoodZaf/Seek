# Feedback and Bug Report System

## Overview
A comprehensive feedback and bug reporting system with admin dashboard for managing user submissions.

## Features Implemented

### Backend (SQLite + Express)
1. **Database Models**
   - `Feedback` model - `/backend/models/Feedback.js`
   - `BugReport` model - `/backend/models/BugReport.js`

2. **API Endpoints**
   - **Feedback Routes** (`/api/v1/feedback`)
     - `POST /` - Submit feedback (Public)
     - `GET /` - Get all feedback (Admin only)
     - `GET /stats` - Get feedback statistics (Admin only)
     - `GET /:id` - Get single feedback (Admin only)
     - `PUT /:id` - Update feedback (Admin only)
     - `DELETE /:id` - Delete feedback (Admin only)

   - **Bug Report Routes** (`/api/v1/bug-reports`)
     - `POST /` - Submit bug report (Public)
     - `GET /` - Get all bug reports (Admin only)
     - `GET /stats` - Get bug report statistics (Admin only)
     - `GET /:id` - Get single bug report (Admin only)
     - `PUT /:id` - Update bug report (Admin only)
     - `DELETE /:id` - Delete bug report (Admin only)

### Frontend Components (To be completed)
1. **Feedback Form** - `/frontend/src/components/Feedback/FeedbackForm.js` ✅
2. **Bug Report Form** - Needs to be created
3. **Admin Dashboard** - Needs to be created

## Database Schema

### Feedback Table
- id (PRIMARY KEY)
- userId (FOREIGN KEY to Users)
- name, email
- type (feature_request, improvement, general, praise, other)
- category
- subject, message
- rating (1-5)
- page (where feedback was submitted)
- status (new, reviewed, in_progress, completed, rejected)
- priority (low, medium, high, urgent)
- adminNotes
- resolvedBy, resolvedAt
- userAgent, ipAddress
- timestamps

### Bug Reports Table
- id (PRIMARY KEY)
- userId (FOREIGN KEY to Users)
- name, email
- severity (critical, high, medium, low)
- bugType (functionality, ui, performance, security, compatibility, other)
- page, title, description
- stepsToReproduce, expectedBehavior, actualBehavior
- browser, browserVersion, os, device, screenResolution
- status (new, confirmed, in_progress, fixed, wont_fix, duplicate, cannot_reproduce)
- priority (low, medium, high, urgent)
- assignedTo, fixedBy, fixedAt, fixVersion
- adminNotes
- screenshots (JSON array)
- consoleErrors
- userAgent, ipAddress
- timestamps

## Next Steps

### Immediate Tasks:
1. Create CSS styles for FeedbackForm
2. Create BugReportForm component
3. Create Admin Dashboard components:
   - FeedbackList
   - BugReportList
   - FeedbackDetail
   - BugReportDetail
   - Statistics Dashboard
4. Add routes in App.js
5. Restart server to apply changes
6. Test all functionality

### Frontend Routes to Add:
```javascript
<Route path="/feedback" element={<FeedbackForm />} />
<Route path="/report-bug" element={<BugReportForm />} />
<Route path="/admin/feedback" element={<AdminFeedback />} />
<Route path="/admin/bug-reports" element={<AdminBugReports />} />
<Route path="/admin/dashboard" element={<AdminDashboard />} />
```

### Admin Dashboard Features:
- View all feedback/bug reports in table format
- Filter by status, priority, type, severity
- Sort by date, priority
- Search functionality
- Quick status update
- View detailed information
- Add admin notes
- Assign bugs to team members
- Mark as resolved/fixed
- Statistics and analytics
- Export to CSV

## API Usage Examples

### Submit Feedback
```javascript
POST /api/v1/feedback
{
  "name": "John Doe",
  "email": "john@example.com",
  "type": "feature_request",
  "subject": "Add dark mode",
  "message": "It would be great to have a dark mode option",
  "rating": 5,
  "page": "/tutorials"
}
```

### Submit Bug Report
```javascript
POST /api/v1/bug-reports
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "severity": "high",
  "bugType": "functionality",
  "page": "/challenges/1",
  "title": "Code editor not saving",
  "description": "When I click save, nothing happens",
  "stepsToReproduce": "1. Open challenge\n2. Write code\n3. Click save",
  "browser": "Chrome",
  "browserVersion": "120.0",
  "os": "macOS"
}
```

### Get Feedback Statistics (Admin)
```javascript
GET /api/v1/feedback/stats
Authorization: Bearer <admin-token>

Response:
{
  "total": 150,
  "byStatus": {
    "new": 45,
    "reviewed": 30,
    "in_progress": 25,
    "completed": 40,
    "rejected": 10
  },
  "byType": {
    "feature_request": 60,
    "improvement": 40,
    "general": 30,
    "praise": 15,
    "other": 5
  },
  "averageRating": "4.2"
}
```

## Access Control
- **Public**: Can submit feedback and bug reports
- **Admin**: Can view, update, delete, and manage all submissions

## Status
✅ Backend API complete
✅ Database models complete
🔄 Frontend forms in progress
⏳ Admin dashboard pending
⏳ Testing pending
