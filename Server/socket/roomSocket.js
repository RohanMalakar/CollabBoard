const Room = require('../models/roomModel.js');

module.exports = function(io) {
  io.on('connection', (socket) => {
    socket.on('join-room', async ({ roomId }) => {
      try {
        socket.join(roomId);

        const room = await Room.findOne({ roomId });

        // If room doesn't exist, create it
        if (!room) {
          const newRoom = await Room.create({ 
            roomId, 
            createdAt: new Date(), 
            drawingData: [] 
          });
          socket.emit('load-drawing', []);
        } else {
          // Send existing drawing data to the user who just joined
          // Sort drawing data by timestamp to ensure correct order
          const sortedDrawingData = room.drawingData.sort((a, b) => a.timestamp - b.timestamp);
          socket.emit('load-drawing', sortedDrawingData);
        }
        // Update user count for all
        io.to(roomId).emit('user-count', io.sockets.adapter.rooms.get(roomId)?.size || 1);
      } catch (error) {
        console.error('Error in join-room:', error);
      }
    });

    socket.on('cursor-move', ({ roomId, x, y, userId }) => {
      socket.to(roomId).emit('cursor-update', { x, y, userId });
    });

    socket.on('draw-start', (data) => {
      // Broadcast to all users in the room except sender
      socket.to(data.roomId).emit('draw-start', data);
    });

    socket.on('draw-move', async ({ roomId, x, y, color, strokeWidth, lastX, lastY }) => {
      try {
        // Broadcast to all users in the room except sender
        socket.to(roomId).emit('draw-move', { x, y, color, strokeWidth, lastX, lastY });

        // Save to DB
        await Room.updateOne(
          { roomId },
          {
            $push: {
              drawingData: {
                type: 'stroke',
                data: { x, y, color, strokeWidth, lastX, lastY },
                timestamp: new Date()
              }
            },
            $set: { lastActivity: new Date() }
          }
        );
      } catch (error) {
        console.error('Error in draw-move:', error);
      }
    });

    socket.on('draw-end', (data) => {
      // Broadcast to all users in the room except sender
      socket.to(data.roomId).emit('draw-end', data);
    });

    socket.on('clear-canvas', async ({ roomId }) => {
      try {
        // Broadcast clear event to all users in the room
        io.to(roomId).emit('clear-canvas');
        
        // Update the room's drawing data
        await Room.updateOne(
          { roomId },
          {
            $set: {
              drawingData: [{ type: 'clear', timestamp: new Date() }],
              lastActivity: new Date()
            }
          }
        );
      } catch (error) {
        console.error('Error in clear-canvas:', error);
      }
    });

    socket.on('leave-room', ({ roomId }) => {
      socket.leave(roomId);
      io.to(roomId).emit('user-count', io.sockets.adapter.rooms.get(roomId)?.size || 0);
    });

    socket.on('disconnect', () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
