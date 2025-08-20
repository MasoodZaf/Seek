import React from 'react';

const Playground = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Minimal Playground Test</h1>
      <p>This is a completely minimal playground to isolate the rendering error.</p>
      <div className="mt-4">
        <textarea 
          className="w-full h-32 border p-2"
          placeholder="Enter your code here..."
        />
      </div>
      <div className="mt-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Run Code
        </button>
      </div>
    </div>
  );
};

export default Playground;