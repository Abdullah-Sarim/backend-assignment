# Task Manager API

A minimal, scalable REST API with authentication, role-based access, and a simple React frontend.

## Assignment Completion Checklist

| Requirement | Status |
|------------|--------|
| User registration & login APIs with password hashing | ✅ |
| JWT authentication | ✅ |
| Role-based access (user vs admin) | ✅ |
| CRUD APIs for tasks entity | ✅ |
| API versioning (/api/v1/) | ✅ |
| Error handling middleware | ✅ |
| Input validation | ✅ |
| API documentation (Swagger) | ✅ |
| Database schema (MongoDB) | ✅ |
| React.js frontend | ✅ |
| Register & login UI | ✅ |
| Protected dashboard | ✅ |
| CRUD actions on tasks | ✅ |
| Error/success messages | ✅ |
| Secure JWT handling | ✅ |
| Input sanitization | ✅ |
| Scalable project structure | ✅ |

## Features

- **Authentication**: Register/Login with JWT tokens (bcrypt password hashing)
- **Role-Based Access**: Admin and User roles
  - Admin: Can access all tasks
  - User: Can only access own tasks
- **CRUD Operations**: Create, Read, Update, Delete tasks
- **Demo Accounts**: Pre-configured admin and user accounts

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime |
| Express | Web Framework |
| MongoDB | Database (Mongoose ODM) |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| React | Frontend Framework |
| Vite | Build Tool |
| Zustand | State Management |
| Tailwind CSS | Styling |

## Project Structure

```
Auth/
├── backend/
│   ├── src/
│   │   ├── config/        # Database config
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/   # Auth & error middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Utilities
│   │   └── server.js      # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/    # UI components
    │   ├── pages/         # Page components
    │   ├── routes/        # Router config
    │   ├── store/         # Zustand stores
    │   └── App.jsx        # Main app
    └── package.json
```

## API Endpoints

### Authentication (Public)
| Method | Endpoint | Description |
|--------|---------|------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login, returns JWT |

### Authentication (Protected)
| Method | Endpoint | Description |
|--------|---------|------------|
| GET | `/api/v1/auth/me` | Get current user |

### Tasks (Protected - JWT Required)
| Method | Endpoint | Description |
|--------|---------|------------|
| GET | `/api/v1/tasks` | Get all tasks (own tasks only, admin sees all) |
| POST | `/api/v1/tasks` | Create new task |
| GET | `/api/v1/tasks/:id` | Get single task |
| PUT | `/api/v1/tasks/:id` | Update task |
| DELETE | `/api/v1/tasks/:id` | Delete task |

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | admin123 |
| User | user@demo.com | user123 |

## Database Schema

### Users Collection
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: user/admin, default: user),
  createdAt: Date,
  updatedAt: Date
}
```

### Tasks Collection
```javascript
{
  title: String (required),
  description: String,
  status: String (enum: pending/completed, default: pending),
  userId: ObjectId (ref: User, required),
  createdAt: Date,
  updatedAt: Date
}
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (or use cloud MongoDB Atlas)

### Installation

1. **Backend**
   ```bash
   cd backend
   npm install
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm install
   ```

### Environment Variables

Backend (.env):
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

### Run the Application

```bash
# Terminal 1 - Backend (port 5000)
cd backend
npm run dev

# Terminal 2 - Frontend (port 5173)
cd frontend
npm run dev
```

### Access
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/v1

## Usage Flow

1. **Login Page**: Use demo accounts or register new user
2. **Dashboard**: View and manage tasks
3. **Create Task**: Add new tasks with title, description, status
4. **Admin View**: Login as admin to see all users' tasks

## Testing with Postman/cURL

### Register
```bash
POST /api/v1/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```bash
POST /api/v1/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Task (with JWT)
```bash
POST /api/v1/tasks
Authorization: Bearer <token>

{
  "title": "Complete assignment",
  "description": "Finish backend API",
  "status": "pending"
}
```

## Role-Based Access

- **Regular User**: Can only access/manage their own tasks
- **Admin**: Can access all users' tasks

## Best Practices Implemented

1. **Modular Architecture**: Controllers, models, middleware separated
2. **Input Validation**: All inputs validated before processing
3. **Error Handling**: Centralized middleware with proper HTTP codes
4. **Security**: Passwords hashed with bcrypt, JWT for auth
5. **API Versioning**: /api/v1/ prefix for future updates
6. **State Management**: Proper cleanup on logout/switch users

## Scalability Notes

This project is designed with scalability in mind:

### Current Architecture
- **Modular Structure**: Controllers, models, middleware separated by domain
- **Layered Design**: Request → Middleware → Controller → Model → Database

### Future Scalability Options
1. **Microservices**: Auth service and Task service can be split into separate services
2. **Caching**: Add Redis for caching frequently accessed tasks
3. **Load Balancing**: Deploy multiple instances behind nginx
4. **Database Sharding**: Shard users/tasks across multiple MongoDB instances
5. **Rate Limiting**: Add express-rate-limit to prevent abuse
6. **Logging**: Add morgan/winston for request logging
7. **Docker**: Containerize both frontend and backend

### Quick Docker Setup (Optional)
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]
```

## API Documentation

Swagger UI available at: **http://localhost:5000/api-docs**

## License

ISC