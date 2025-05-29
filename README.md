# Employee Feedback Portal

A full-stack web application for collecting and managing employee feedback.

## Features

### Employee Portal
- Anonymous feedback submission
- Category selection (Work Environment, Leadership, Growth, Others)
- Real-time feedback submission
- Success notifications

### Admin Dashboard
- View all feedback entries
- Filter feedback by category
- Mark feedback as reviewed
- Delete feedback entries
- Real-time updates using WebSocket

## Tech Stack

### Frontend
- Next.js (JavaScript)
- Material UI
- SWR for data fetching
- Socket.io-client for real-time updates
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.io for real-time updates
- CORS for cross-origin requests

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local instance running on default port 27017)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file in the backend directory with the following content:
   ```
   MONGODB_URI=mongodb://localhost:27017/employee-feedback
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Access the application:
   - Employee Portal: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin

## API Documentation

### Endpoints

#### POST /api/feedback
Submit new feedback
- Body: `{ text: string, category: string }`
- Response: Created feedback object

#### GET /api/feedback
Get all feedback entries
- Query params: `category` (optional)
- Response: Array of feedback objects

#### PATCH /api/feedback/:id/reviewed
Update feedback review status
- Params: `id` (feedback ID)
- Body: `{ reviewed: boolean }`
- Response: Updated feedback object

#### DELETE /api/feedback/:id
Delete feedback entry
- Params: `id` (feedback ID)
- Response: Success message

### WebSocket Events
- `newFeedback`: Emitted when new feedback is submitted
- `feedbackUpdated`: Emitted when feedback review status is updated
- `feedbackDeleted`: Emitted when feedback is deleted

## Assumptions and Implementation Notes

1. No authentication required for simplicity
2. Using local MongoDB instance
3. Real-time updates implemented using Socket.io
4. Responsive design for all screen sizes
5. Form validation on both frontend and backend
6. Error handling and user notifications
7. Optimistic UI updates using SWR 