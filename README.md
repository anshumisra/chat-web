

# Real-Time Web Chat Application

A real-time chat application built with React, Socket.IO, and Express that allows users to create and join chat rooms for seamless communication.

## Features

* Real-time messaging using Socket.IO
* Create and join custom chat rooms
* User name customization
* Modern and responsive UI with Tailwind CSS
* Server-side notifications for user join/leave events

## Tech Stack

### Frontend
* React
* Socket.IO Client
* React Router DOM
* Tailwind CSS
* Lucide React (for icons)
* Framer Motion
* Vite (build tool)

### Backend
* Node.js
* Express
* Socket.IO
* CORS

## Prerequisites

* Node.js (v18 or higher recommended)
* npm or yarn package manager

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install dependencies for both frontend and backend:

   ```bash
   # Install frontend dependencies
   cd web-chat
   npm install

   # Install backend dependencies
   cd ../server
   npm install
   ```

## Running the Application

1. Start the backend server:

   ```bash
   cd server
   npm run dev
   ```

   The server will start on `http://localhost:3000`

2. Start the frontend development server:

   ```bash
   cd web-chat
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## Usage

1. Open the application in your browser
2. Enter your username on the home page
3. Click the "Chat" button to enter the chat interface
4. Join a room by entering a room name and clicking "Join Room"
5. Start chatting with other users in the same room