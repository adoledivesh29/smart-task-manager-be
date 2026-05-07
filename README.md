# Smart Task Manager Backend

A modern backend API for a smart task management application built with Node.js, Express, and MongoDB. This application uses Google Gemini AI to analyze task descriptions and automatically categorize them with difficulty scores.

## Features

-   **User Authentication**: Register and login with email and password.
-   **Task Management**: Create, view, update, and delete tasks.
-   **AI-Powered Categorization**: Uses Google Gemini to analyze task descriptions and suggest categories and difficulty levels.
-   **Dashboard Analytics**: View statistics on task completion, pending tasks, and average difficulty.
-   **Role-Based Access**: Simple role management system.
-   **Secure**: Implements JWT for authentication and bcrypt for password hashing.
-   **Real-time**: Supports WebSocket for real-time notifications.

## Tech Stack

-   **Node.js**: JavaScript runtime
-   **Express**: Web framework
-   **MongoDB**: Database
-   **Mongoose**: ODM
-   **JWT**: Authentication
-   **Bcrypt**: Password hashing
-   **WebSocket (Socket.IO)**: Real-time communication
-   **Google Gemini API**: AI-powered task analysis

## Prerequisites

-   **Node.js** (v16 or higher)
-   **MongoDB** (local or Atlas)
-   **Gemini API Key**

## Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd smart-task-manager-be
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure environment variables:
    Copy `.env.example` to `.env` and fill in the required values:
    ```bash
    cp .env.example .env
    ```

    **`.env` Configuration:**
    ```env
    NODE_ENV=dev
    PORT=3013
    BASE_URL=http://localhost:3013
    DB_URL="your_mongodb_connection_string"
    GEMINI_API_KEY="your_gemini_api_key"
    JWT_SECRET="your_jwt_secret"
    ```

## Usage

1.  Start the server in development mode:
    ```bash
    npm run dev
    ```

2.  Start the server in production mode:
    ```bash
    npm run start
    ```

## API Documentation

### Authentication

-   `POST /api/v1/user/auth/register` - Register a new user
-   `POST /api/v1/user/auth/login` - User login

### Tasks

All task routes require authentication.

-   `GET /api/v1/user/tasks` - Get all tasks
-   `POST /api/v1/user/tasks` - Create a new task
    ```json
    {
        "sTitle": "Task Title",
        "sDescription": "Task Description"
    }
    ```
-   `PUT /api/v1/user/tasks/:id/complete` - Toggle task completion status
-   `DELETE /api/v1/user/tasks/:id` - Delete a task

### Dashboard

-   `GET /api/v1/user/dashboard` - Get dashboard statistics

### Profile

-   `GET /api/v1/user/profile` - Get user profile
-   `PUT /api/v1/user/profile` - Update user profile

### Middleware

-   `isAuthenticated` - Authenticates user requests

## Directory Structure

```
smart-task-manager-be/
├── app/
│   ├── middleware/        # Custom middleware (auth, upload, etc.)
│   ├── models/            # Mongoose schemas
│   ├── routers/           # API routes organized by role
│   ├── services/          # Business logic and external services
│   ├── utils/             # Utility functions (helpers, constants, etc.)
│   └── app.js             # Express app configuration
├── config/                # Configuration files
├── seeds/                 # Database seed scripts
├── public/                # Publicly accessible files
├── index.js               # Application entry point
├── package.json
└── .env.example           # Environment variable template
```

## WebSocket

Real-time notifications are implemented using Socket.IO.

**Events:**
-   `task_created` - When a task is created
-   `task_completed` - When a task is completed
-   `task_deleted` - When a task is deleted

## Development

### Running Tests

```bash
npm run test
```

### Seeding the Database

```bash
npm run seed
```

### Resetting the Database

```bash
npm run reset
```

## License

MIT
