Technical Architecture Documentation for Daily Well-being Tracker
The Daily Well-being Tracker is a full-stack MERN application designed to help users track their daily well-being across multiple categories. This document outlines the technical architecture and justifies the choice of tools and technologies to meet the project’s requirements.
1. Overview
The application uses the MERN stack (MongoDB, Express.js, React, Node.js) to deliver a responsive, scalable, and maintainable solution. It includes user authentication, well-being management, daily logging, and historical data viewing, deployed as a web application with a RESTful API.
2. Technology Stack
Backend

Node.js:
Purpose: Runtime environment for the server-side application.
Reason: JavaScript-based, enabling code consistency with the frontend. Lightweight and efficient for handling asynchronous operations like API requests.


Express.js:
Purpose: Web framework for building the RESTful API.
Reason: Simplifies routing, middleware integration, and HTTP request handling. Widely used with Node.js, ensuring robust community support.


MongoDB:
Purpose: NoSQL database for storing users, well-beings, and logs.
Reason: Flexible schema supports dynamic well-being categories and logs. Scales well for user data and integrates seamlessly with Node.js via Mongoose.


Mongoose:
Purpose: Object Data Modeling (ODM) library for MongoDB.
Reason: Provides schema validation, relationships, and query building, ensuring data integrity (e.g., unique email, valid well-being states).


JSON Web Tokens (JWT):
Purpose: Secure user authentication.
Reason: Lightweight and stateless, enabling secure access to protected routes (e.g., profile, logs) without server-side session storage.



Frontend

React:
Purpose: Library for building the user interface.
Reason: Component-based architecture supports reusable UI elements (e.g., buttons, forms). Efficient for dynamic updates like real-time log display.


React Router:
Purpose: Client-side routing for navigation.
Reason: Enables seamless page transitions (e.g., from Dashboard to Profile) without full page reloads, improving user experience.


Tailwind CSS:
Purpose: Styling framework for responsive UI.
Reason: Utility-first approach speeds up development and ensures consistent, responsive designs across devices (e.g., phones, desktops).


Axios:
Purpose: HTTP client for API requests.
Reason: Simplifies async requests to the backend and handles responses/errors efficiently.



Deployment

Heroku:
Purpose: Hosting the backend API.
Reason: Easy deployment, auto-scaling, and integration with MongoDB Atlas. Simplifies server management for Node.js applications.


Netlify:
Purpose: Hosting the React frontend.
Reason: Optimized for static site deployment, supports React builds, and offers simple CI/CD integration.


MongoDB Atlas:
Purpose: Cloud-hosted MongoDB database.
Reason: Managed service with scalability, backups, and easy integration with Heroku and Node.js.



Testing

Jest:
Purpose: Testing framework for unit and integration tests.
Reason: Native support for JavaScript and React, widely used for testing MERN applications.


Cypress:
Purpose: End-to-end testing framework.
Reason: Simulates real user interactions (e.g., signup, logging), ensuring the full application flow works as expected.


ESLint and Prettier:
Purpose: Code linting and formatting.
Reason: Enforce consistent code style and catch errors early, improving maintainability.



CI/CD

GitHub Actions:
Purpose: Automate testing and deployment.
Reason: Integrates with GitHub repository, enabling automated testing on commits and deployment to Heroku/Netlify on successful builds.



3. Architectural Decisions
Why MERN Stack?

Unified JavaScript: Using JavaScript across the stack (Node.js, Express.js, React, MongoDB) simplifies development and reduces context-switching.
Scalability: MongoDB’s NoSQL structure and Node.js’s non-blocking I/O handle growing user data and requests efficiently.
Community Support: MERN is widely adopted, with extensive libraries and documentation, reducing development time.

Database Design

Three Collections: Users, WellBeings, and Logs support all features (authentication, well-being management, daily logging).
Flexible Schema: MongoDB’s schema-less nature allows adding custom well-beings without structural changes.
Unique Index for Logs: Ensures one log per well-being per user per day, supporting overwrite functionality for Dashboard and Overview pages.
Preservation of Logs: Logs remain in the database even after well-being removal, enabling historical viewing in the Overview Page.

API Design

RESTful Architecture: Follows standard HTTP methods (GET, POST, PUT, DELETE) for predictable, stateless communication.
JWT Authentication: Secures endpoints like /api/logs and /api/wellbeings, ensuring only authorized users access their data.
Overwrite Logic: POST /api/logs uses MongoDB’s upsert to overwrite logs for the same user, well-being, and date, meeting the overwrite requirement.

Frontend Design

Component-Based: Reusable components (e.g., WellBeingCard, FormInput) reduce code duplication and simplify maintenance.
Responsive UI: Tailwind CSS ensures the app works on all devices, critical for accessibility and user adoption.
Client-Side Date Handling: Real-time date display in Dashboard is handled by JavaScript (e.g., Date object), avoiding unnecessary backend calls.

Deployment Strategy

Separated Frontend/Backend: Hosting the frontend on Netlify and backend on Heroku allows independent scaling and optimization.
MongoDB Atlas: Cloud hosting simplifies database management and ensures reliability for production.
CI/CD with GitHub Actions: Automates testing and deployment, reducing manual errors and speeding up updates.

Testing Strategy

Comprehensive Testing: Unit tests (Jest) for components and APIs, integration tests for data flow, and end-to-end tests (Cypress) for user flows ensure reliability.
Accessibility: Manual testing and tools like Lighthouse verify screen reader support and WCAG compliance.

4. Data Flow

Frontend to Backend: React uses Axios to send HTTP requests to Express.js endpoints (e.g., /api/logs/:date for Overview Page).
Backend to Database: Express.js uses Mongoose to query MongoDB, ensuring data validation and integrity.
Real-Time Features: Client-side JavaScript handles real-time date display; API-driven updates ensure immediate log reflection.

5. Conclusion
The MERN stack, combined with Tailwind CSS, JWT, and deployment on Heroku/Netlify, provides a robust, scalable, and user-friendly architecture for the Daily Well-being Tracker. These choices align with the project’s requirements for flexibility, security, responsiveness, and maintainability.