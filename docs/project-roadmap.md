Project Roadmap for Daily Well-being Tracker
The Daily Well-being Tracker is a MERN stack application. This roadmap outlines the milestones and timeline for completing the project, covering planning, development, testing, deployment, and documentation. The timeline spans 10 weeks, starting July 24, 2025, and ending September 30, 2025.
Milestones and Timeline
Week 1: Project Setup and Planning (July 24 - July 30, 2025)

Tasks:
Set up project repository via GitHub Classroom.
Initialize Node.js project for backend and React project for frontend.
Install dependencies (Express, MongoDB, React, Tailwind CSS, etc.).
Complete Task 1: Finalize project idea, wireframes, database schema, API endpoints, and roadmap.


Deliverables:
GitHub repository with README.md, wireframes, and documentation in /docs folder.
Initial project structure with backend and frontend folders.


Completion Date: July 30, 2025

Week 2: Backend Setup and Database Integration (July 31 - August 6, 2025)

Tasks:
Set up MongoDB database and connect with Mongoose.
Implement Users, WellBeings, and Logs schemas with validation.
Create initial backend routes for user authentication (/api/users/signup, /api/users/login).
Set up JWT authentication middleware.


Deliverables:
Working MongoDB connection.
User and well-being schemas implemented.
Basic authentication endpoints tested locally.


Completion Date: August 6, 2025

Week 3: Backend Development - Authentication and Well-beings (August 7 - August 13, 2025)

Tasks:
Complete authentication endpoints (/api/users/forgot-password, /api/users/profile).
Implement well-being endpoints (/api/wellbeings, /api/wellbeings/:id).
Add logic to create default well-beings (General, Mental, Physical, Social, Financial) on signup.
Write unit tests for authentication and well-being endpoints.


Deliverables:
Fully functional authentication and well-being APIs.
Unit tests for backend routes.


Completion Date: August 13, 2025

Week 4: Backend Development - Logs and Testing (August 14 - August 20, 2025)

Tasks:
Implement log endpoints (/api/logs/:date, /api/logs, /api/logs/:id).
Add overwrite logic for logs (unique index on userId, wellBeingId, date).
Write integration tests for log endpoints and authentication.
Set up error handling and logging middleware.


Deliverables:
Complete log management APIs.
Integration tests for backend functionality.
Error handling middleware implemented.


Completion Date: August 20, 2025

Week 5: Frontend Setup and Basic UI (August 21 - August 27, 2025)

Tasks:
Set up React Router for client-side navigation.
Create reusable components (buttons, forms, dropdowns) with Tailwind CSS.
Build static UI for Landing, SignUp, LogIn, and Forgot Password pages.
Implement form validation for SignUp and LogIn pages.


Deliverables:
Basic frontend structure with routing.
Responsive UI for authentication pages.
Client-side form validation.


Completion Date: August 27, 2025

Week 6: Frontend Development - Dashboard and Overview Pages (August 28 - September 3, 2025)

Tasks:
Build Dashboard Page UI with well-being cards, dropdowns, and text areas.
Connect Dashboard to /api/wellbeings and /api/logs/:date for real-time data.
Implement Overview Page with calendar picker and log display.
Add edit and delete functionality for logs in Overview Page.


Deliverables:
Functional Dashboard and Overview pages.
Real-time date display and log updates.


Completion Date: September 3, 2025

Week 7: Frontend Development - Profile Page and Polish (September 4 - September 10, 2025)

Tasks:
Build Profile Page with user info, well-being management, and logout.
Connect Profile Page to /api/users/profile and /api/wellbeings endpoints.
Polish UI for responsiveness and accessibility (e.g., screen reader support).
Implement client-side error handling for all pages.


Deliverables:
Fully functional Profile Page.
Responsive and accessible UI across all pages.


Completion Date: September 10, 2025

Week 8: Testing and Quality Assurance (September 11 - September 17, 2025)

Tasks:
Write unit tests for frontend components.
Write end-to-end tests for user flows (signup, login, logging, editing).
Perform manual testing on different devices and browsers (Chrome, Firefox, Edge).
Refactor code based on test results and code reviews.


Deliverables:
Comprehensive test suite (unit, integration, end-to-end).
Bug-free application across devices.


Completion Date: September 17, 2025

Week 9: Deployment and CI/CD Setup (September 18 - September 24, 2025)

Tasks:
Deploy backend to Heroku and frontend to Netlify.
Set up MongoDB Atlas for production database.
Configure CI/CD pipeline (e.g., GitHub Actions) for automated testing and deployment.
Add monitoring (e.g., Heroku logs) and error tracking.


Deliverables:
Live application accessible online.
Automated CI/CD pipeline.
Monitoring setup.


Completion Date: September 24, 2025

Week 10: Documentation and Presentation (September 25 - September 30, 2025)

Tasks:
Write comprehensive README with setup instructions and project overview.
Document API endpoints in /docs/api-endpoints.md (already done).
Create user guide for navigating the app.
Record a 5-10 minute video demo showcasing key features.
Prepare a presentation summarizing the project.


Deliverables:
Complete documentation in repository.
Video demo and presentation slides.
Final submission via GitHub Classroom.


Completion Date: September 30, 2025

Notes

Start Date: July 24, 2025
End Date: September 30, 2025
Assumptions: Development is part-time (20-25 hours/week), suitable for a Capstone Project.
Flexibility: Milestones can shift slightly if unexpected issues arise, but aim to stay on schedule.
Regular Commits: Commit changes daily to GitHub to track progress.
