import React from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import RoomJoin from './components/RoomJoin';
import Whiteboard from './components/Whiteboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoomJoin />} />
        <Route path="/room/:roomId" element={<RoomWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

function RoomWrapper() {
  const { roomId } = useParams();
  return <Whiteboard roomId={roomId} />;
}

export default App;
