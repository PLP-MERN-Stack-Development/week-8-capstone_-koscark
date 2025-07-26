Database Schema Design for Daily Well-being Tracker
The Daily Well-being Tracker uses MongoDB to store user data, well-being categories, and daily logs. Below are the collections and their schemas, designed to support all application requirements.
Collections
1. Users
Stores user account information for authentication and profile management.

_id: ObjectId (auto-generated unique identifier)
fullName: String (required, user's full name, editable)
email: String (required, unique, validated as email format)
password: String (required, hashed for security)
createdAt: Date (timestamp of account creation)
updatedAt: Date (timestamp of last update)

Example:
{
  "_id": "ObjectId(123)",
  "fullName": "Tom Smith",
  "email": "tom@example.com",
  "password": "$2b$10$hashedPassword",
  "createdAt": "2025-07-24T17:00:00Z",
  "updatedAt": "2025-07-24T17:00:00Z"
}

2. WellBeings
Stores the well-being categories available to each user, including pre-added and user-defined ones.

_id: ObjectId (auto-generated unique identifier)
userId: ObjectId (references Users._id, links to the user)
name: String (required, unique per user, e.g., "General", "Mental", "Spiritual")
accentColor: String (hex color code, e.g., "#3F48CC")
isRemovable: Boolean (true for all except "General", which is false)

Pre-added Well-beings (created for each new user):

General (#3F48CC, isRemovable: false)
Mental (#764986, isRemovable: true)
Physical (#0F7D97, isRemovable: true)
Social (#E55118, isRemovable: true)
Financial (#379587, isRemovable: true)
User-added well-beings (#915941, isRemovable: true)

Example:
[
  {
    "_id": "ObjectId(456)",
    "userId": "ObjectId(123)",
    "name": "General",
    "accentColor": "#3F48CC",
    "isRemovable": false
  },
  {
    "_id": "ObjectId(457)",
    "userId": "ObjectId(123)",
    "name": "Spiritual",
    "accentColor": "#915941",
    "isRemovable": true
  }
]

3. Logs
Stores daily well-being logs, with one log per well-being per user per date. Edits overwrite the state and note for the same date.

_id: ObjectId (auto-generated unique identifier)
userId: ObjectId (references Users._id, links to the user)
wellBeingId: ObjectId (references WellBeings._id, links to the well-being)
date: Date (stores only the date, e.g., "2025-07-24")
state: String (required, one of: "Very Bad", "Bad", "Slightly Bad", "Okay", "Slightly Good", "Good", "Very Good")
note: String (optional, user’s description of their state)
createdAt: Date (timestamp of log creation)
updatedAt: Date (timestamp of last update)

Constraints:

Unique index on userId, wellBeingId, and date to ensure only one log per well-being per user per day (edits overwrite existing log).
Logs persist in the database even if the associated well-being is removed from WellBeings collection.

Example:
{
  "_id": "ObjectId(789)",
  "userId": "ObjectId(123)",
  "wellBeingId": "ObjectId(456)",
  "date": "2025-07-24",
  "state": "Good",
  "note": "Feeling great today!",
  "createdAt": "2025-07-24T10:00:00Z",
  "updatedAt": "2025-07-24T14:00:00Z"
}

Relationships

Users to WellBeings: One-to-Many (one user has many well-beings).
WellBeings.userId references Users._id.


Users to Logs: One-to-Many (one user has many logs).
Logs.userId references Users._id.


WellBeings to Logs: One-to-Many (one well-being has many logs across dates).
Logs.wellBeingId references WellBeings._id.


Logs Behavior:
Logs are tied to a specific user, well-being, and date.
Removing a well-being from WellBeings does not delete associated logs in Logs.
Editing a log for a specific well-being and date overwrites the existing state and note for that userId, wellBeingId, and date combination.



Notes

Pre-added Well-beings: Automatically created for each new user in the WellBeings collection with the specified accent colors and isRemovable settings.
Accent Colors: Stored in WellBeings to apply to UI elements for each well-being.
Overwrite Mechanism: The unique index on Logs (userId, wellBeingId, date) ensures only the latest state and note are stored for a given day.
Data Persistence: Logs remain in the database for historical viewing (Overview Page) even if a well-being is removed.
Validation:
Users.email is unique and validated as an email format.
WellBeings.name is unique per user to prevent duplicates.
Logs.state is restricted to the predefined list of states.


