import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RoomJoin() {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!roomId) return;
    await axios.post('http://localhost:3000/api/rooms/join', { roomId });
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Join Whiteboard Room</h1>
      <input
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="px-4 py-2 border rounded-md mb-2 text-center"
        placeholder="Enter Room Code"
      />
      <button
        onClick={handleJoin}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Join Room
      </button>
    </div>
  );
}
