Note App Overview

## Installation:

Run
add the databse Connect link in database schema

{npm install }
{node Api.js}// please goto library first.

in both the backend and frontend folders.
In the frontend folder,
{npm install }

{npm install -g vite}

to Run Front end= {npm run dev}

---

Database & Storage:

A public MongoDB is currently used for data input and output.
Images and audio files are stored locally in the backend folder (upload).
User Workflow:

Sign Up:
The user must first sign up. (Note: Currently, there is no validation, but it can be added later.)

Sign In:
Sign in using the same email and password provided during sign-up. JWT authentication is used, so the user does not need to log in repeatedly—the system will automatically keep the user logged in.

Home Page:
After logging in, the user is directed to the home page, where all existing notes (if any) are displayed.

Creating a Note:

The user should provide a title and the note content.
Users can upload images and a voice note.
The transcription of the voice note will be displayed below the voice option, and the user can edit this transcription if needed.
Clicking on an existing note opens it in full view, allowing the user to edit any part of the note.
