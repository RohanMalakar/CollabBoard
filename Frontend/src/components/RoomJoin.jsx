import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function RoomJoin() {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!roomId.trim()) return;
    try {
      await axios.post('http://localhost:3000/api/rooms/join', { roomId });
      navigate(`/room/${roomId}`);
    } catch (err) {
      console.error('Failed to join room:', err);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-tr from-gray-100 to-blue-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
          Join Whiteboard Room
        </h1>

        <input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 text-center text-gray-700"
          placeholder="Enter Room Code"
        />

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleJoin}
          className="w-full py-2 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700 transition-colors"
        >
          Join Room
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
