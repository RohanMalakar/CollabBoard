import React, { useEffect, useState, useRef } from 'react';

export default function UserCursors({ socket, roomId }) {
  const [cursors, setCursors] = useState({});
  const userId = socket?.id;
  const lastUpdateTime = useRef(0);
  const THROTTLE_MS = 50; // Update cursor position every 50ms

  useEffect(() => {
    if (!socket) return;

    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastUpdateTime.current >= THROTTLE_MS) {
        socket.emit('cursor-move', {
          roomId,
          userId,
          x: e.clientX,
          y: e.clientY,
        });
        lastUpdateTime.current = now;
      }
    };

    const handleCursorUpdate = ({ userId, x, y }) => {
      setCursors((prev) => ({
        ...prev,
        [userId]: { x, y, timestamp: Date.now() },
      }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    socket.on('cursor-update', handleCursorUpdate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      socket.off('cursor-update', handleCursorUpdate);
    };
  }, [socket, roomId]);

  // Clean up old cursors (remove cursors that haven't updated in 5 seconds)
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setCursors((prev) => {
        const newCursors = { ...prev };
        Object.entries(newCursors).forEach(([id, data]) => {
          if (now - data.timestamp > 5000) {
            delete newCursors[id];
          }
        });
        return newCursors;
      });
    }, 1000);

    return () => clearInterval(cleanupInterval);
  }, []);

  return (
    <>
      {Object.entries(cursors).map(([id, { x, y }]) =>
        id !== socket?.id ? (
          <div
            key={id}
            className="absolute z-50 w-4 h-4 bg-blue-500 rounded-full pointer-events-none"
            style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
          />
        ) : null
      )}
    </>
  );
}
