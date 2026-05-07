# Smart Task Manager Backend

Backend API for a smart task manager built with Node.js, Express, MongoDB, and Google Gemini. Users can register, log in, manage their profile, create tasks, and get AI-generated task metadata such as category and difficulty score.

## What This Project Does

- Provides user authentication with token-based access control
- Stores users and tasks in MongoDB via Mongoose
- Uses Google Gemini to analyze task descriptions during task creation
- Tracks task completion and returns task summary metadata for the signed-in user

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- JSON Web Token
- Google Generative AI SDK
- Helmet, CORS, Compression, Morgan

## Current Features

- User registration
- User login
- Auth-protected profile routes
- Create, list, toggle, and delete tasks
- Task analytics:
  total tasks, completed tasks, pending tasks, average difficulty, and completion percentage
- AI-generated task category and difficulty score on create
- Simple `/ping` health route

## Project Structure

```text
smart-task-manager-be/
|-- app/
|   |-- models/
|   |   |-- lib/
|   |-- routers/
|   |   |-- middleware/
|   |   |-- user/
|   |       |-- auth/
|   |       |-- profile/
|   |       |-- tasks/
|   |-- utils/
|       |-- lib/
|-- globals/
|   |-- lib/
|-- index.js
|-- package.json
|-- README.md
```

## Environment Variables

Create a `.env` file in the project root with these values:

```env
NODE_ENV=development
PORT=3013
DB_URL=mongodb://127.0.0.1:27017/smart-task-manager
JWT_SECRET=replace_with_a_secure_secret
GEMINI_API_KEY=replace_with_your_gemini_api_key
```

## Installation

```bash
npm install
```

## Running Locally

Start the server:

```bash
node index.js
```

The server binds to `0.0.0.0` on the port from `PORT`.

## Base URL

```text
http://localhost:3013/api/v1/user
```

## Authentication

Protected routes require the `authorization` header.

On successful login, the API returns the token in the response header:

```text
authorization: <jwt-token>
```

## API Endpoints

### Auth

#### `POST /auth/register`

Create a user account.

Request body:

```json
{
  "sEmail": "demo@example.com",
  "sPassword": "secret123"
}
```

#### `POST /auth/login`

Log in and receive an auth token in the `authorization` response header.

Request body:

```json
{
  "sEmail": "demo@example.com",
  "sPassword": "secret123"
}
```

### Profile

#### `GET /profile`

Get the current user's profile.

#### `PUT /profile/update`

Update username or email.

Request body:

```json
{
  "sUserName": "demo",
  "sEmail": "demo@example.com"
}
```

#### `POST /profile/change/password`

Change the current user's password.

Accepted body fields:

```json
{
  "currentPassword": "old-pass",
  "newPassword": "new-pass"
}
```

This route also accepts legacy keys:

```json
{
  "sPassword": "old-pass",
  "sNewPassword": "new-pass"
}
```

#### `POST /profile/logout`

Clears the saved token for the current user.

### Tasks

#### `POST /tasks`

Create a task. The backend sends `sDescription` to Gemini and stores:

- `nDifficultyScore`
- `sCategory`

Request body:

```json
{
  "sTitle": "Finish backend README",
  "sDescription": "Rewrite the documentation so setup and endpoints are clear."
}
```

#### `GET /tasks`

Return all tasks for the current user, sorted by newest first.

#### `GET /tasks/metadata`

Return aggregate task stats for the current user.

Example response data:

```json
{
  "nTotalTasks": 8,
  "nCompletedTasks": 5,
  "nPendingTasks": 3,
  "nAverageDifficulty": 6.4,
  "nCompletionPercentage": 63,
  "sCompletionLabel": "5 of 8 tasks finished"
}
```

#### `POST /tasks/:id/toggle`

Toggle a task between complete and incomplete.

#### `DELETE /tasks/:id`

Delete a task owned by the current user.

## Health Check

#### `GET /ping`

Returns a simple HTML response confirming the server is running.

## Data Models

### User

- `sUserName`
- `sEmail`
- `sPassword`
- `sToken`
- `isEmailVerified`
- `sProfilePic`

### Task

- `sTitle`
- `sDescription`
- `nDifficultyScore`
- `sCategory`
- `bIsCompleted`
- `iUserId`
- `dCreatedAt`
- `dUpdatedAt`

## Gemini Integration

When a task is created, the backend asks Gemini to return JSON in this shape:

```json
{
  "difficultyScore": 7,
  "category": "Work"
}
```

If Gemini does not respond correctly, the task is not saved.

## Notes

- There is currently no `.env.example` file in the repo.
- There is currently no working development script like `npm run dev`.
- `npm test` is still the default placeholder script and does not run a real test suite.

## License

ISC
