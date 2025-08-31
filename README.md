# Daily Well-being Tracker

## Project Idea

The **Daily Well-being Tracker** is a full-stack MERN application designed to help users monitor and reflect on their daily well-being across multiple categories. It addresses the real-world problem of maintaining self-awareness and personal growth by enabling users to log, track, and review their well-being states (e.g., Very Bad, Good) and notes for categories like General, Mental, Physical, Social, Financial, and custom user-defined categories.

### Key Features

- **Multiple Well-being Categories**: Predefined categories (General, Mental, Physical, Social, Financial) with unique accent colors, plus user-defined categories.
- **Daily Logging**: Users log a state and note for each well-being category daily, with data persisting for the day and clearing for the next day.
- **User Authentication**: Sign-up, login, password reset, and profile management.
- **Overview Page**: View, edit, and delete logged well-being data for specific dates using a calendar picker.
- **Profile Management**: Edit personal info, add/remove well-being categories, and log out.
- **Real-Time Features**: Display current day/date and immediate updates for logged data.

### Problem Solved

The application promotes mental and personal well-being by providing a structured, customizable way to track and reflect on various aspects of life, helping users identify patterns and improve their daily experience.

## Wireframes and Mockups

Wireframes and mockups for the Daily Well-being Tracker are located in the `/wireframes` folder. These include designs for the following pages:

- **Landing Page**: Welcomes users and describes the application.
- **SignUp Page**: Allows new users to register with full name, email, and password.
- **LogIn Page**: Enables existing users to log in with email and password.
- **Forgot Password Page**: Facilitates password reset with email, old password, new password, and confirmation.
- **Dashboard Page**: Displays well-being categories for daily logging with states, notes, and an add well-being feature.
- **Overview Page**: Shows logged well-being data by date with edit and delete options.
- **Profile Page**: Displays user info, allows editing, well-being management, and logout.

## Database Schema

The MongoDB database schema is documented in `/docs/database-schema.md`. It includes three collections: `Users` (user account info), `WellBeings` (well-being categories with accent colors), and `Logs` (daily well-being logs with states and notes). The schema supports all application features, including user management, well-being customization, and daily logging with overwrite functionality.

## API Endpoints and Data Flow

The RESTful API endpoints and data flow for the application are documented in `/docs/api-endpoints.md`. This includes endpoints for user authentication, profile management, well-being management, and daily logs, along with the data flow between the React frontend and Express.js backend.

## Project Roadmap

The project roadmap with milestones is documented in `/docs/project-roadmap.md`. It outlines a 10-week timeline  covering setup, backend, frontend, testing, deployment, and documentation.

## Technical Architecture

The technical architecture decisions for the application are documented in `/docs/technical-architecture.md`. This includes the choice of MERN stack, Tailwind CSS, JWT, and deployment tools, with justifications for meeting project requirements.

## Backend Setup

The backend is set up with Node.js, Express.js, and MongoDB using Mongoose. Schemas for `Users`, `WellBeings`, and `Logs` are implemented in the `/backend/models` folder with validation to support authentication, well-being management, and daily logging. The MongoDB connection is configured via MongoDB Atlas, with credentials stored in `/backend/.env`.

## RESTful API Implementation

The RESTful API is implemented in the `/backend` folder using Express.js. It includes routes for user authentication (`/api/users`), well-being management (`/api/wellbeings`), and log management (`/api/logs`), with middleware for JWT authentication and error handling. See `/docs/api-endpoints.md` for details.

## Authentication and Authorization

Authentication is implemented using JWT in `/backend/middleware/auth.js`, securing endpoints like `/api/users/profile`, `/api/wellbeings`, and `/api/logs`. Authorization ensures users only access or modify their own data (via `userId` checks) and prevents deletion of non-removable well-beings (e.g., General). Default well-beings are securely created during signup with error handling.

## Middleware for Logging, Validation, and Security
Middleware for logging (`logger.js`), validation (`validate.js`), and security (`security.js`) is implemented in `/backend/middleware`. Logging tracks API requests and responses, validation centralizes input checks, and security includes Helmet for HTTP headers and rate limiting to prevent abuse.

## Frontend Setup
The frontend is set up in `/frontend` using React, Vite, and Tailwind CSS. Vite is configured to proxy API requests to the backend (`http://localhost:5000`). 