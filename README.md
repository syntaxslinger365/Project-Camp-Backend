# Project Camp Backend

A RESTful backend API for collaborative project management, built with Node.js, Express.js, and MongoDB. Project Camp enables users to create projects, manage team members, organize tasks and subtasks, maintain project notes, and securely access resources through JWT authentication and role-based authorization.

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Environment Variables](#environment-variables)
* [Running the Application](#running-the-application)
* [API Endpoints](#api-endpoints)
* [User Roles and Permissions](#user-roles-and-permissions)
* [Task Status](#task-status)
* [Testing with Postman](#testing-with-postman)
* [Security](#security)
* [Future Improvements](#future-improvements)
* [Author](#author)
* [License](#license)

## Features

### Authentication and Authorization

* User registration and email verification
* Secure login and logout
* JWT-based access and refresh tokens
* Password change and password reset
* Resend email verification
* Role-based access control

### Project Management

* Create, view, update, and delete projects
* Retrieve projects accessible to the authenticated user
* Manage project team members
* Add members using their email addresses
* Update member roles and remove members

### Task Management

* Create, view, update, and delete tasks
* Assign tasks to users
* Track task status
* Support multiple file attachments
* Organize work using subtasks

### Subtask Management

* Create subtasks for existing tasks
* Update subtask information and completion status
* Delete subtasks according to user permissions

### Project Notes

* Create and view project notes
* Retrieve individual notes
* Update and delete notes according to user permissions

### Additional Features

* Request validation
* Centralized error handling
* CORS configuration
* API health-check endpoint
* File upload support using Multer

## Tech Stack

| Technology                             | Purpose                                            |
| -------------------------------------- | -------------------------------------------------- |
| Node.js                                | JavaScript runtime                                 |
| Express.js                             | Backend web framework                              |
| MongoDB                                | NoSQL database                                     |
| Mongoose                               | MongoDB object modeling                            |
| JSON Web Token (JWT)                   | Authentication                                     |
| bcrypt                                 | Password hashing, if configured in the application |
| express-validator                      | Request validation                                 |
| Multer                                 | File upload handling                               |
| Nodemailer or configured email service | Email delivery                                     |
| Postman                                | API testing                                        |
| Git and GitHub                         | Version control                                    |

> The technologies listed above should be adjusted to match the dependencies actually installed and used in the project.

## Project Structure

```text
projectManagement/
├── docs/
│   └── PRD.md
├── public/
│   └── images/
├── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── validators/
│   └── index.js
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

The exact structure may vary as the project develops.

## Prerequisites

Before running the application, install:

* Node.js
* npm
* MongoDB or a MongoDB Atlas database
* Git
* Postman (optional, for API testing)

## Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the project directory

```bash
cd projectManagement
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root.

Use `.env.example` as a reference if it is included in the repository. Add the environment variables required by your application.

Never commit your actual `.env` file to GitHub.

## Environment Variables

The application may require environment variables similar to the following:

```env
PORT=
MONGODB_URI=
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=
CORS_ORIGIN=
SERVER_URL=
NODE_ENV=
```

Email-related variables may also be required depending on your email service configuration.

Set the actual values in your local `.env` file. The names above are examples; verify them against the variables used in your source code.

**Important:** Never publish database credentials, JWT secrets, email passwords, API keys, or other sensitive values.

## Running the Application

Start the development server:

```bash
npm run dev
```

If the development script is not configured in `package.json`, check the available scripts and use the appropriate command.

When the server starts successfully, use the configured port and base URL to send requests.

For example, if your application uses port `8000`, the local base URL would be:

```text
http://localhost:8000
```

Replace the port with the value configured in your environment.

## API Endpoints

The following endpoints describe the planned API structure. Confirm the route prefixes and available functionality against the implementation.

### Authentication

Base path: `/api/v1/auth`

| Method | Endpoint                           | Description               |
| ------ | ---------------------------------- | ------------------------- |
| POST   | `/register`                        | Register a user           |
| POST   | `/login`                           | Log in                    |
| POST   | `/logout`                          | Log out                   |
| GET    | `/current-user`                    | Get the current user      |
| POST   | `/change-password`                 | Change password           |
| POST   | `/refresh-token`                   | Refresh access token      |
| GET    | `/verify-email/:verificationToken` | Verify email              |
| POST   | `/forgot-password`                 | Request password reset    |
| POST   | `/reset-password/:resetToken`      | Reset password            |
| POST   | `/resend-email-verification`       | Resend verification email |

### Projects

Base path: `/api/v1/projects`

| Method | Endpoint                      | Description              |
| ------ | ----------------------------- | ------------------------ |
| GET    | `/`                           | List accessible projects |
| POST   | `/`                           | Create a project         |
| GET    | `/:projectId`                 | Get project details      |
| PUT    | `/:projectId`                 | Update a project         |
| DELETE | `/:projectId`                 | Delete a project         |
| GET    | `/:projectId/members`         | List project members     |
| POST   | `/:projectId/members`         | Add a project member     |
| PUT    | `/:projectId/members/:userId` | Update a member's role   |
| DELETE | `/:projectId/members/:userId` | Remove a project member  |

### Tasks and Subtasks

Base path: `/api/v1/tasks`

| Method | Endpoint                         | Description        |
| ------ | -------------------------------- | ------------------ |
| GET    | `/:projectId`                    | List project tasks |
| POST   | `/:projectId`                    | Create a task      |
| GET    | `/:projectId/t/:taskId`          | Get task details   |
| PUT    | `/:projectId/t/:taskId`          | Update a task      |
| DELETE | `/:projectId/t/:taskId`          | Delete a task      |
| POST   | `/:projectId/t/:taskId/subtasks` | Create a subtask   |
| PUT    | `/:projectId/st/:subTaskId`      | Update a subtask   |
| DELETE | `/:projectId/st/:subTaskId`      | Delete a subtask   |

### Project Notes

Base path: `/api/v1/notes`

| Method | Endpoint                | Description        |
| ------ | ----------------------- | ------------------ |
| GET    | `/:projectId`           | List project notes |
| POST   | `/:projectId`           | Create a note      |
| GET    | `/:projectId/n/:noteId` | Get note details   |
| PUT    | `/:projectId/n/:noteId` | Update a note      |
| DELETE | `/:projectId/n/:noteId` | Delete a note      |

### Health Check

Base path: `/api/v1/healthcheck`

| Method | Endpoint | Description      |
| ------ | -------- | ---------------- |
| GET    | `/`      | Check API health |

### Example Request

Create a task:

```http
POST /api/v1/tasks/PROJECT_ID
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Example JSON body:

```json
{
  "title": "Implement User Authentication",
  "description": "Develop user registration, login, and password reset functionality.",
  "status": "todo"
}
```

Replace `PROJECT_ID` with a valid project ID. Include the authentication token required by the endpoint.

## User Roles and Permissions

The application defines three user roles:

| Feature                    | Admin | Project Admin | Member |
| -------------------------- | ----- | ------------- | ------ |
| Create projects            | Yes   | No            | No     |
| Update/delete projects     | Yes   | No            | No     |
| Manage project members     | Yes   | No            | No     |
| Create/update/delete tasks | Yes   | Yes           | No     |
| View tasks                 | Yes   | Yes           | Yes    |
| Update subtask status      | Yes   | Yes           | Yes    |
| Create/delete subtasks     | Yes   | Yes           | No     |
| Create/update/delete notes | Yes   | No            | No     |
| View notes                 | Yes   | Yes           | Yes    |

The effective permissions depend on the authorization middleware and controller logic implemented in the application.

## Task Status

Tasks support the following statuses:

| Status        | Description             |
| ------------- | ----------------------- |
| `todo`        | Task has not started    |
| `in_progress` | Task is being worked on |
| `done`        | Task is completed       |

## Testing with Postman

To test the API:

1. Start the backend server.
2. Create or import a Postman collection.
3. Configure a base URL variable, such as `baseUrl`.
4. Register a user and complete email verification if required.
5. Log in and obtain the required access token.
6. Set the `Authorization` header to `Bearer YOUR_ACCESS_TOKEN` for secured endpoints.
7. Create a project and use its ID when testing task, subtask, and note endpoints.
8. Check response status codes and error messages.

Use valid MongoDB IDs and existing users when testing project membership and task assignments.

## Security

* Store secrets in environment variables.
* Keep `.env` out of version control.
* Validate incoming request data.
* Hash user passwords securely.
* Protect private routes with authentication middleware.
* Apply authorization checks to restricted operations.
* Validate file uploads and restrict permitted file types and sizes.
* Configure CORS for trusted origins.
* Avoid exposing internal stack traces in production responses.

## Future Improvements

Potential improvements include:

* Interactive API documentation with Swagger/OpenAPI
* Automated unit and integration tests
* Pagination, filtering, and sorting
* Improved logging and monitoring
* Docker-based development and deployment
* CI/CD automation
* Enhanced file storage and access control
* Email notifications for project and task events

## Author

**Your Name**

* GitHub: YOUR_GITHUB_USERNAME
* LinkedIn: YOUR_LINKEDIN_PROFILE

Replace the placeholders with your actual profile information.

## License

Choose and add an appropriate open-source license before distributing the project. If no license has been selected, the project's reuse permissions remain unspecified.
