import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

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

  // ✅ Connect socket
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
      // Emit clear event to server
      socket.current.emit('clear-canvas', { roomId });
      // Clear the canvas immediately for better UX
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  return (
    <div className="relative w-screen h-screen bg-gray-100 overflow-hidden">
      {/* Toolbar with color, stroke, clear */}
     <Toolbar
      color={color}
      setColor={setColor}
      strokeWidth={strokeWidth}
      setStrokeWidth={setStrokeWidth}
      onClear={handleClearCanvas}
    />

      {/* Drawing canvas */}
      <DrawingCanvas
        socket={socket.current}
        roomId={roomId}
        color={color}
        strokeWidth={strokeWidth}
      />

      {/* Real-time user cursors */}
      {socket.current && (
        <UserCursors socket={socket.current} roomId={roomId} />
      )}

      {/* Room info and user count */}
      <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded shadow text-sm z-20">
        <div className="font-semibold">Room: {roomId}</div>
        <div>Users: {connectedUsers}</div>
        <button
          onClick={() => navigate('/')}
          className="mt-2 text-blue-600 hover:underline"
        >
          Leave Room
        </button>
      </div>
    </div>
  );
};

export default Whiteboard;
