Here’s your complete `README.md` file tailored to your **Collaborative Whiteboard** project using the MERN stack and Socket.io.

# 🖊️ Real-Time Collaborative Whiteboard

A real-time collaborative whiteboard built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and Socket.io. Multiple users can join a shared room and draw on the same canvas simultaneously with live cursor tracking and synchronized drawing.

---

## 🚀 Features

- Join or create a room using a simple alphanumeric room code
- Real-time collaborative drawing on a shared whiteboard
- Live cursor tracking for all connected users
- Adjustable stroke width and basic color selection
- Clear canvas option that syncs across all users
- Active user count display
- Clean, responsive, and minimal UI using Tailwind CSS
- Drawing data persistence in MongoDB

---

## 🧰 Tech Stack

- **Frontend**: React.js, Tailwind CSS, Socket.io-client
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: MongoDB
- **WebSocket**: Socket.io for real-time communication

---

## 📁 Project Structure

```bash
project-root/
├── client/                 # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/             # Mongoose schemas
│   ├── routes/             # Express routes
│   ├── socket/             # WebSocket event handlers
│   └── server.js           # Main server entry point
├── .env                    # Environment variables
├── README.md
└── package.json
```

## 🔧 Environment Variables

Create a `.env` file in the `server/` directory with the following content:


MONGODB\_URI=your\_mongodb\_connection\_string
PORT=3000

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/whiteboard-app.git
cd whiteboard-app
````

### 2. Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd ../client
npm install
```

### 3. Run the Application

#### Backend

```bash
cd server
npm run dev
```

#### Frontend

```bash
cd client
npm start
```

The frontend will run on [http://localhost:5173](http://localhost:5173) (or port shown in terminal), and the backend will run on [http://localhost:3000](http://localhost:3000).

---

## 🔌 Socket.io Events

| Event Name     | Direction       | Payload                         | Description                     |
| -------------- | --------------- | ------------------------------- | ------------------------------- |
| `join-room`    | client → server | `{ roomId }`                    | Join or create a room           |
| `load-drawing` | server → client | `[ { type, data, timestamp } ]` | Sends stored drawing commands   |
| `draw-start`   | client → server | `{ x, y }`                      | Begin drawing stroke            |
| `draw-move`    | client → server | `{ x, y }`                      | Update stroke position          |
| `draw-end`     | client → server | `{}`                            | End drawing stroke              |
| `clear-canvas` | both ways       | `roomId`                        | Clear the canvas in all clients |
| `cursor-move`  | client → server | `{ x, y }`                      | Cursor position                 |
| `user-count`   | server → client | `count`                         | Active users in the room        |

---

## 🧱 Architecture Overview

* **Client**:

  * React-based UI for drawing, cursor movement, and toolbar
  * Communicates drawing/cursor data over WebSockets
* **Server**:

  * Express REST API to join or fetch rooms
  * Socket.io for real-time event handling
  * MongoDB stores persistent drawing commands

---

## 📡 REST API Endpoints

| Method | Endpoint             | Description                      |
| ------ | -------------------- | -------------------------------- |
| POST   | `/api/rooms/join`    | Join or create a whiteboard room |
| GET    | `/api/rooms/:roomId` | Get info about a specific room   |

---

## 📦 Deployment Guide

### Prerequisites

* Node.js and npm
* MongoDB (Atlas or local)
* Hosting platform like Render, Railway, or VPS

### Steps

1. Set environment variables (`MONGODB_URI`, `PORT`)
2. Build frontend:

```bash
cd client
npm run build
```

3. Serve frontend from Express:

In `server.js`

4. Start server:

```bash
cd server
npm run dev
```

5. Use PM2 or similar to keep the server alive in production.

---

## 🙋‍♂️ Contributing

Contributions are welcome! Please fork the repo, make changes, and open a pull request.


## 🙌 Acknowledgements

Built with ❤️ using the MERN stack and Socket.io


---
