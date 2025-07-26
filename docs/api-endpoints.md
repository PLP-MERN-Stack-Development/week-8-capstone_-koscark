API Endpoints and Data Flow for Daily Well-being Tracker
The Daily Well-being Tracker uses a RESTful API built with Express.js to handle communication between the React frontend and MongoDB backend. Below are the API endpoints and the data flow describing how the frontend interacts with the backend to support all application features.
API Endpoints
Base URL
All endpoints are prefixed with /api.
1. Authentication Endpoints
Handle user registration, login, and password reset.

POST /api/users/signup

Description: Register a new user and create default well-beings (General, Mental, Physical, Social, Financial).
Request Body:{
  "fullName": String (required),
  "email": String (required, valid email),
  "password": String (required, min 6 characters)
}


Response (201 Created):{
  "user": {
    "_id": String,
    "fullName": String,
    "email": String
  },
  "token": String (JWT for authentication)
}


Error (400 Bad Request): Invalid input or email already exists.


POST /api/users/login

Description: Authenticate an existing user and return a JWT.
Request Body:{
  "email": String (required),
  "password": String (required)
}


Response (200 OK):{
  "user": {
    "_id": String,
    "fullName": String,
    "email": String
  },
  "token": String
}


Error (401 Unauthorized): Invalid credentials.


POST /api/users/forgot-password

Description: Verify user email and old password, then update to a new password.
Request Body:{
  "email": String (required),
  "oldPassword": String (required),
  "newPassword": String (required, min 6 characters, not same as old),
  "confirmPassword": String (required, must match newPassword)
}


Response (200 OK):{ "message": "Password updated successfully" }


Error (400 Bad Request): Invalid input, email not found, or passwords don’t match.



2. User Management Endpoints
Handle user profile updates (protected by JWT authentication).

GET /api/users/profile

Description: Retrieve the authenticated user’s profile information.
Headers: Authorization: Bearer 
Response (200 OK):{
  "_id": String,
  "fullName": String,
  "email": String
}


Error (401 Unauthorized): Invalid or missing token.


PUT /api/users/profile

Description: Update the user’s full name or password.
Headers: Authorization: Bearer 
Request Body:{
  "fullName": String (optional),
  "oldPassword": String (optional, required if updating password),
  "newPassword": String (optional, min 6 characters),
  "confirmPassword": String (optional, must match newPassword)
}


Response (200 OK):{
  "_id": String,
  "fullName": String,
  "email": String
}


Error (400 Bad Request): Invalid input or passwords don’t match; (401 Unauthorized): Invalid token or old password.



3. Well-being Management Endpoints
Handle creation, retrieval, and deletion of well-being categories (protected by JWT).

GET /api/wellbeings

Description: Retrieve all well-beings for the authenticated user.
Headers: Authorization: Bearer 
Response (200 OK):[
  {
    "_id": String,
    "name": String,
    "accentColor": String,
    "isRemovable": Boolean
  },
  ...
]


Error (401 Unauthorized): Invalid token.


POST /api/wellbeings

Description: Add a new user-defined well-being.
Headers: Authorization: Bearer 
Request Body:{
  "name": String (required, unique per user)
}


Response (201 Created):{
  "_id": String,
  "userId": String,
  "name": String,
  "accentColor": "#915941",
  "isRemovable": true
}


Error (400 Bad Request): Invalid or duplicate name; (401 Unauthorized): Invalid token.


DELETE /api/wellbeings/:id

Description: Remove a well-being (if isRemovable: true).
Headers: Authorization: Bearer 
Parameters: id (wellBeingId)
Response (200 OK):{ "message": "Well-being removed successfully" }


Error (400 Bad Request): Well-being is not removable; (401 Unauthorized): Invalid token; (404 Not Found): Well-being not found.



4. Log Management Endpoints
Handle creation, retrieval, updating, and deletion of daily well-being logs (protected by JWT).

GET /api/logs/:date

Description: Retrieve all logs for the authenticated user for a specific date.
Headers: Authorization: Bearer 
Parameters: date (format: YYYY-MM-DD, e.g., "2025-07-24")
Response (200 OK):[
  {
    "_id": String,
    "wellBeingId": String,
    "date": String,
    "state": String,
    "note": String
  },
  ...
]


Error (401 Unauthorized): Invalid token; (400 Bad Request): Invalid date format.


POST /api/logs

Description: Create or update a log for a specific well-being and date (overwrites existing log for the same user, well-being, and date).
Headers: Authorization: Bearer 
Request Body:{
  "wellBeingId": String (required),
  "date": String (required, YYYY-MM-DD),
  "state": String (required, one of: "Very Bad", "Bad", "Slightly Bad", "Okay", "Slightly Good", "Good", "Very Good"),
  "note": String (optional)
}


Response (201 Created or 200 OK):{
  "_id": String,
  "userId": String,
  "wellBeingId": String,
  "date": String,
  "state": String,
  "note": String
}


Error (400 Bad Request): Invalid input or well-being not found; (401 Unauthorized): Invalid token.


DELETE /api/logs/:id

Description: Delete a log for a specific well-being and date.
Headers: Authorization: Bearer 
Parameters: id (logId)
Response (200 OK):{ "message": "Log removed successfully" }


Error (401 Unauthorized): Invalid token; (404 Not Found): Log not found.



Data Flow
Overview
The frontend (React) communicates with the backend (Express.js) via HTTP requests to the API endpoints. The backend interacts with MongoDB to store and retrieve data. JWT authentication secures protected endpoints. The data flow ensures seamless user interaction across all pages.
Page-Specific Data Flow

Landing Page:

Frontend: Displays static content (no API calls).
Backend: No interaction.


SignUp Page:

Frontend: User enters full name, email, and password in a form. On submit, sends POST request to /api/users/signup.
Backend: Validates input, hashes password, creates user in Users collection, adds default well-beings (General, Mental, Physical, Social, Financial) to WellBeings collection, returns user data and JWT.
Frontend: Stores JWT in local storage, redirects to Dashboard Page.


LogIn Page:

Frontend: User enters email and password. Sends POST request to /api/users/login.
Backend: Validates credentials, returns user data and JWT.
Frontend: Stores JWT, redirects to Dashboard Page.


Forgot Password Page:

Frontend: User enters email, old password, new password, and confirm password. Sends POST request to /api/users/forgot-password.
Backend: Verifies email and old password, validates new password, updates password in Users collection, returns success message.
Frontend: Displays success message, redirects to LogIn Page.


Dashboard Page:

Frontend: On load, sends GET request to /api/wellbeings to fetch user’s well-beings and GET request to /api/logs/:date (current date) to fetch today’s logs. Displays well-beings with dropdowns (states), text areas (notes), and Log buttons. Displays current date/time (client-side). On Log button click, sends POST request to /api/logs with well-being ID, date, state, and note. On Add button click, sends POST request to /api/wellbeings.
Backend: Returns well-beings and logs, creates/updates logs (overwrites for same date and well-being), or adds new well-being. Validates inputs and ensures uniqueness.
Frontend: Updates UI with new log or well-being, refreshes logs for the current date.


Overview Page:

Frontend: Displays calendar picker (default: today). On date selection, sends GET request to /api/logs/:date. Displays logs with Edit and Remove buttons. On Edit, sends POST request to /api/logs to overwrite log. On Remove, sends DELETE request to /api/logs/:id. Sends GET request to count distinct log dates for total logged days.
Backend: Returns logs for the specified date, updates or deletes logs as requested.
Frontend: Updates UI with logs, total logged days, and reflects edits/deletions.


Profile Page:

Frontend: Sends GET request to /api/users/profile for user info and /api/wellbeings for well-beings. On Edit (name/password), sends PUT request to /api/users/profile. On Add well-being, sends POST request to /api/wellbeings. On Remove well-being, sends DELETE request to /api/wellbeings/:id. On Log Out, clears JWT and redirects to Landing Page.
Backend: Returns user and well-being data, updates user info, adds/removes well-beings (preserving logs).
Frontend: Updates UI with user info and well-beings, redirects on logout.



Notes

Authentication: All endpoints except /api/users/signup, /api/users/login, and /api/users/forgot-password require a JWT in the Authorization header.
Overwrite Mechanism: The POST /api/logs endpoint uses MongoDB’s upsert to overwrite logs for the same user, well-being, and date.
Real-Time: Current date/time is handled client-side. No Socket.io is needed, as log updates are immediate via API calls.
Error Handling: Backend returns appropriate status codes and messages for invalid inputs, unauthorized access, or missing resources.
Data Validation: Ensured at both frontend (form validation) and backend (schema validation).
