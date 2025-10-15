# Backend Server - Placement Portal

This is the backend server for the Placement Portal application built with Node.js, Express, and MongoDB Atlas.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- MongoDB Atlas account (no local MongoDB installation needed)

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

The `.env` file is already configured with MongoDB Atlas connection:

```env
MONGO_URI=mongodb+srv://tutorial:abcd@cluster0.u3fh2yj.mongodb.net/placement-portal?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

**Important**:
- Change the `JWT_SECRET` in production!
- The MongoDB Atlas cluster is already provisioned and accessible

### 3. Create Admin Account

You need to manually create an admin account in MongoDB Atlas. You can do this in two ways:

#### Option A: Using MongoDB Atlas Web Interface

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to your cluster (Cluster0)
3. Click "Collections"
4. Select database `placement-portal`
5. Create collection `users` (if not exists)
6. Insert a new document:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "$2a$10$YourHashedPasswordHere",
  "phone": "1234567890",
  "role": "admin",
  "createdAt": {"$date": "2024-01-15T10:00:00.000Z"},
  "updatedAt": {"$date": "2024-01-15T10:00:00.000Z"}
}
```

#### Option B: Using MongoDB Compass or mongosh

Connect to your Atlas cluster:

```bash
mongosh "mongodb+srv://tutorial:abcd@cluster0.u3fh2yj.mongodb.net/placement-portal"
```

Then run:

```javascript
use placement-portal

db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$10$YourHashedPasswordHere",
  phone: "1234567890",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

#### Hashing a Password

To hash a password (e.g., "admin123"), create a temporary file `hash.js`:

```javascript
import bcrypt from 'bcryptjs';

const password = 'admin123';
const hash = await bcrypt.hash(password, 10);
console.log('Hashed password:', hash);
```

Run it:
```bash
node hash.js
```

Copy the hashed password and use it in your admin user document.

### 4. Start the Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:5000`

You should see:
```
🚀 Server running on http://localhost:5000
📝 Environment: development
✅ MongoDB Connected
```

## API Endpoints

### Authentication

#### POST `/api/auth/signup`
Create a new student account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "student@example.com",
  "password": "password123",
  "phone": "1234567890",
  "role": "student"
}
```

**Response:**
```json
{
  "message": "Student account created successfully",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "student@example.com",
    "phone": "1234567890",
    "role": "student"
  }
}
```

#### POST `/api/auth/login`
Sign in with email, password, and role.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "student"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "1234567890",
    "role": "student"
  }
}
```

#### GET `/api/auth/me`
Get current user information (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "1234567890",
    "role": "student"
  }
}
```

### Health Check

#### GET `/api/health`
Check server and database status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "database": "connected"
}
```

## User Roles & Redirects

| Role       | Sign Up | Sign In | Redirect Path              |
|------------|---------|---------|----------------------------|
| Student    | ✅      | ✅      | `/student/dashboard`       |
| Recruiter  | ❌      | ✅      | `/recruiter/dashboard`     |
| Admin      | ❌      | ✅      | `/admin/dashboard`         |

## Security Features

- Password hashing with bcryptjs (10 salt rounds)
- JWT token authentication (7-day expiration)
- Input validation using express-validator
- CORS configured for frontend (http://localhost:5173)
- Role-based access control
- Secure connection to MongoDB Atlas with SSL/TLS

## MongoDB Atlas Connection

The backend connects to MongoDB Atlas cloud database:
- **Cluster**: Cluster0
- **Database**: placement-portal
- **Connection**: Secure SSL/TLS connection
- **Network Access**: Configured to allow connections

No local MongoDB installation is required. The database is hosted on MongoDB Atlas cloud.

## Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error message here",
  "errors": []
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials or token)
- `403` - Forbidden (insufficient permissions)
- `500` - Internal Server Error

## Development Notes

- The server uses CORS to allow requests from `http://localhost:5173` (frontend)
- JWT tokens are valid for 7 days
- Passwords must be at least 6 characters
- Only students can sign up through the API
- Recruiters and admins must be created directly in MongoDB Atlas
- Database operations are handled automatically by MongoDB Atlas

## Frontend Integration

The frontend uses Axios with base URL `http://localhost:5000/api`:

```typescript
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

After successful login, JWT token is stored in `localStorage` and included in all subsequent requests.

## Troubleshooting

### MongoDB Connection Error

If you see `MongoDB connection error`:
1. Check that the `MONGO_URI` in `.env` is correct
2. Verify MongoDB Atlas cluster is running
3. Ensure network access is configured in MongoDB Atlas
4. Check that your IP is whitelisted in MongoDB Atlas Network Access

### Port Already in Use

If port 5000 is in use:
1. Change `PORT` in `.env` file
2. Update frontend axios configuration in `src/api/axiosInstance.ts`

### CORS Errors

If you get CORS errors:
1. Check the frontend URL in `server.js` (line 13)
2. Ensure it matches your frontend dev server URL
3. Verify the frontend is running on `http://localhost:5173`

### Authentication Errors

If login/signup fails:
1. Check backend server is running
2. Verify MongoDB Atlas connection is successful
3. Check browser console for detailed error messages
4. Ensure JWT_SECRET is set in `.env`

## Running the Complete Application

1. **Start Backend** (Terminal 1):
```bash
cd backend
npm install
npm start
```

2. **Start Frontend** (Terminal 2):
```bash
npm install
npm run dev
```

3. **Access Application**:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

The application is now ready to use with MongoDB Atlas!
