const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const cors = require('cors');
const Room = require('./models/roomModel.js');
const setupSocket = require('./socket/roomSocket.js');


const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/rooms', require('./routes/roomRoutes'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"));

// Socket setup
setupSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
