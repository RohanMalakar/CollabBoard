const express = require('express');
const router = express.Router();
const Room = require('../models/roomModel.js');

// Join/Create Room
router.post('/join', async (req, res) => {
  const { roomId } = req.body;
  let room = await Room.findOne({ roomId });
  if (!room) {
    room = new Room({ roomId });
    await room.save();
  }
  res.json(room);
});

// Get Room Info
router.get('/:roomId', async (req, res) => {
  const room = await Room.findOne({ roomId: req.params.roomId });
  res.json(room);
});

module.exports = router;
