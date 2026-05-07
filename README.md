# Smart Task Manager Backend 🚀

Backend API for an AI-powered smart task manager built with **Node.js, Express, MongoDB, and Gemini AI**.

This backend handles authentication, profile management, task CRUD operations, and AI-generated task enrichment including difficulty scoring, category classification, dynamic color generation, and icon metadata for frontend rendering.

---

# ✨ Features

- User authentication with JWT
- Secure profile management
- Task creation, update, toggle, and deletion
- AI-generated task difficulty scoring
- AI-generated task category classification
- Dynamic task color generation
- Backend-controlled icon mapping and fallback handling
- Task analytics and completion summary
- Gemini-powered task enrichment workflow
- Health monitoring route

---

# 🛠 Tech Stack

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Google Gemini API
- Helmet
- Morgan
- Compression
- CORS

---

# 📂 Project Structure

```text
smart-task-manager-be/
│
├── app/
│   ├── models/
│   ├── routers/
│   │   ├── middleware/
│   │   └── user/
│   │       ├── auth/
│   │       ├── profile/
│   │       └── tasks/
│   ├── services/
│   └── utils/
│
├── globals/
│
├── index.js
├── package.json
└── README.md
```

---

# ⚙️ Environment Variables

Create a `.env` file in the root directory.

```env
NODE_ENV=development
PORT=3013

DB_URL=mongodb://127.0.0.1:27017/smart-task-manager

JWT_SECRET=replace_with_secure_secret

GEMINI_API_KEY=replace_with_gemini_api_key
```

---

# 🚀 Installation

## Install Dependencies

```bash
npm install
```

## Start Server

```bash
npm start
```

Server runs on:

```text
http://localhost:3013
```

---

# 🌐 Base URLs

```text
Health Check:
http://localhost:3013/ping

API Base URL:
http://localhost:3013/api/v1/user
```

---

# 🔐 Authentication

Protected routes require the `authorization` header.

Example:

```text
authorization: <jwt-token>
```

JWT token is returned in the response headers after successful login.

---

# 📡 API Endpoints

# Auth

## Register

```http
POST /auth/register
```

Request:

```json
{
  "sEmail": "demo@example.com",
  "sPassword": "secret123"
}
```

---

## Login

```http
POST /auth/login
```

Request:

```json
{
  "sEmail": "demo@example.com",
  "sPassword": "secret123"
}
```

---

# Profile

## Get Profile

```http
GET /profile
```

---

## Update Profile

```http
PUT /profile/update
```

Request:

```json
{
  "sUserName": "demo",
  "sEmail": "demo@example.com"
}
```

---

## Change Password

```http
POST /profile/change/password
```

Request:

```json
{
  "currentPassword": "old-pass",
  "newPassword": "new-pass"
}
```

---

## Logout

```http
POST /profile/logout
```

---

# Tasks

## Create Task

```http
POST /tasks
```

Request:

```json
{
  "sTitle": "Finish backend README",
  "sDescription": "Rewrite documentation clearly."
}
```

During task creation, Gemini AI generates:

- difficulty score
- category
- color metadata

---

## Get Tasks

```http
GET /tasks
```

Returns normalized task data including metadata fields.

---

## Task Analytics

```http
GET /tasks/metadata
```

Example Response:

```json
{
  "nTotalTasks": 8,
  "nCompletedTasks": 5,
  "nPendingTasks": 3,
  "nAverageDifficulty": 6.4,
  "nCompletionPercentage": 63
}
```

---

## Toggle Task

```http
POST /tasks/:id/toggle
```

---

## Delete Task

```http
DELETE /tasks/:id
```

---

# 🧠 AI Task Enrichment

When a task is created, the backend sends the task description to Gemini AI and expects structured metadata like:

```json
{
  "difficultyScore": 7,
  "category": "Work",
  "color": "#3B82F6"
}
```

The backend then:

- validates difficulty score
- validates category
- validates HEX color format
- maps category icons
- applies safe fallback values when needed

Fallback metadata:

```json
{
  "category": "Other",
  "color": "#9CA3AF",
  "icon": "tag"
}
```

---

# 🤖 AI-Assisted Development Workflow

This backend was built using an AI-assisted engineering workflow and completed in approximately **3 hours**.

AI tools were used to accelerate development, reduce boilerplate effort, improve debugging speed, and streamline implementation while keeping architecture and integration decisions manually controlled.

---

# 🛠 AI Tools Used

## Cursor

- Used to scaffold Express backend structure
- Assisted in route and controller generation
- Helped accelerate API integration workflows
- Used for rapid refactoring and debugging

## ChatGPT

- Used for backend architecture planning
- Assisted in MongoDB schema and API structure design
- Helped debug authentication, deployment, and MongoDB issues
- Assisted in Gemini integration workflows
- Helped refine project documentation

## Coded

- Used to accelerate reusable backend utility generation
- Assisted in rapid implementation iteration

## Antigravity

- Used to improve development workflow productivity
- Helped reduce repetitive backend setup effort


# 🏗 Current Capabilities

- Modular backend structure
- AI-enriched task metadata
- Backward-compatible task normalization
- Safe fallback handling
- JWT-secured routes
- User-level task analytics


# ❤️ Development Philosophy

This project demonstrates an **AI-augmented backend engineering workflow** where AI tools were used as development copilots to accelerate productivity while maintaining manual control over implementation, debugging, architecture, validation, and deployment decisions.

---

# 📄 License

ISC
