import React from 'react';

const Toolbar = ({ color, setColor, strokeWidth, setStrokeWidth, onClear }) => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 flex gap-4 items-center bg-white p-2 rounded-md shadow-md z-30">
      <select
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="border px-2 py-1 rounded"
      >
        <option value="black">Black</option>
        <option value="red">Red</option>
        <option value="blue">Blue</option>
        <option value="green">Green</option>
      </select>
      <input
        type="range"
        min="1"
        max="20"
        value={strokeWidth}
        onChange={(e) => setStrokeWidth(e.target.value)}
      />
      <button
        onClick={onClear}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Clear
      </button>
    </div>
  );
};

export default Toolbar;
