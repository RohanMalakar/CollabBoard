import React, { useEffect, useRef } from 'react';

const DrawingCanvas = ({ socket, roomId, color, strokeWidth }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPosition = useRef(null);

  // Clear canvas function
  const clearCanvas = () => {
    console.log('Clearing canvas');
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Draw line on canvas
  const drawLine = (x1, y1, x2, y2, color, width) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
  };

  // Handle mouse down / start drawing
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    isDrawing.current = true;
    lastPosition.current = { x: offsetX, y: offsetY };
    socket?.emit('draw-start', { roomId, x: offsetX, y: offsetY });
  };

  // Handle mouse move / drawing
  const draw = ({ nativeEvent }) => {
    if (!isDrawing.current) return;

    const { offsetX, offsetY } = nativeEvent;
    const newPos = { x: offsetX, y: offsetY };
    const lastPos = lastPosition.current;

    // Draw locally
    drawLine(lastPos.x, lastPos.y, newPos.x, newPos.y, color, strokeWidth);

    // Emit drawing data to other users
    socket?.emit('draw-move', {
      roomId,
      x: newPos.x,
      y: newPos.y,
      color,
      strokeWidth,
      lastX: lastPos.x,
      lastY: lastPos.y
    });

    lastPosition.current = newPos;
  };

  // Handle mouse up / stop drawing
  const stopDrawing = () => {
    isDrawing.current = false;
    lastPosition.current = null;
    socket?.emit('draw-end', { roomId });
  };

  // Setup canvas and socket listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;

    if (!socket) return;

    // Socket listeners for drawing synchronization
    socket.on('draw-start', ({ x, y }) => {
      lastPosition.current = { x, y };
    });

    socket.on('draw-move', ({ x, y, color, strokeWidth, lastX, lastY }) => {
      if (lastX !== undefined && lastY !== undefined) {
        drawLine(lastX, lastY, x, y, color, strokeWidth);
      }
      lastPosition.current = { x, y };
    });

    socket.on('draw-end', () => {
      lastPosition.current = null;
    });

    // Handle clear canvas event
    socket.on('clear-canvas', () => {
      clearCanvas();
    });

    // Load existing drawing data when joining
    const handleLoadDrawing = (drawingData) => {
      console.log('Loading drawing data:', drawingData);
      if (!drawingData || drawingData.length === 0) {
        console.log('No drawing data to load');
        return;
      }
      
      // Clear canvas first
      clearCanvas();
      
      let currentPosition = null;
      
      // Replay all drawing commands in order
      drawingData.forEach((command, index) => {
        console.log(`Replaying command ${index}:`, command);
        if (command.type === 'stroke') {
          const { x, y, color, strokeWidth, lastX, lastY } = command.data;
          if (lastX !== undefined && lastY !== undefined) {
            drawLine(lastX, lastY, x, y, color, strokeWidth);
          } else if (currentPosition) {
            drawLine(currentPosition.x, currentPosition.y, x, y, color, strokeWidth);
          }
          currentPosition = { x, y };
        } else if (command.type === 'clear') {
          clearCanvas();
          currentPosition = null;
        }
      });
      lastPosition.current = currentPosition;
      console.log('Finished loading drawing data');
    };

    // Register the load-drawing event handler
    socket.on('load-drawing', handleLoadDrawing);

    // Request drawing data when component mounts
    socket.emit('join-room', { roomId });

    return () => {
      socket.off('draw-start');
      socket.off('draw-move');
      socket.off('draw-end');
      socket.off('clear-canvas');
      socket.off('load-drawing');
    };
  }, [socket, roomId]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-10 cursor-crosshair"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    />
  );
};

export default DrawingCanvas;
