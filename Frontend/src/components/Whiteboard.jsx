import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { motion } from 'framer-motion';

import Toolbar from './Toolbar';
import DrawingCanvas from './DrawingCanvas';
import UserCursors from './UserCursors';

const Whiteboard = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const socket = useRef(null);

  const [color, setColor] = useState('black');
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [connectedUsers, setConnectedUsers] = useState(1);

  // ✅ Connect to socket
  useEffect(() => {
    socket.current = io('http://localhost:3000');
    socket.current.emit('join-room', { roomId });

    socket.current.on('user-count', (count) => {
      setConnectedUsers(count);
    });

    return () => {
      socket.current.emit('leave-room', { roomId });
      socket.current.disconnect();
    };
  }, [roomId]);

  const handleClearCanvas = () => {
    if (socket.current) {
      socket.current.emit('clear-canvas', { roomId });

      const canvas = document.querySelector('canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  return (
    <motion.div
      className="relative w-screen h-screen bg-gradient-to-tr from-gray-100 to-blue-100 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Toolbar with animation */}
      <motion.div
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 60 }}
        className="z-30"
      >
        <Toolbar
          color={color}
          setColor={setColor}
          strokeWidth={strokeWidth}
          setStrokeWidth={setStrokeWidth}
          onClear={handleClearCanvas}
        />
      </motion.div>

      {/* Drawing Canvas */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="z-10"
      >
        <DrawingCanvas
          socket={socket.current}
          roomId={roomId}
          color={color}
          strokeWidth={strokeWidth}
        />
      </motion.div>

      {/* Real-time user cursors */}
      {socket.current && (
        <UserCursors socket={socket.current} roomId={roomId} />
      )}

      {/* Room info panel */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="absolute top-4 right-4 backdrop-blur-sm bg-white/80 px-4 py-3 rounded-2xl shadow-lg text-sm z-20"
      >
        <div className="font-semibold text-gray-800">Room: {roomId}</div>
        <div className="text-gray-600">Users: {connectedUsers}</div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="mt-2 text-blue-600 hover:underline"
        >
          Leave Room
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Whiteboard;
