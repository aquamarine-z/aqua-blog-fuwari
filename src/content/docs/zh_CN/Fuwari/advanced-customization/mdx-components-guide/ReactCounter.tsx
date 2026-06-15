import React, { useState } from 'react';

export default function ReactCounter() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4 border-2 border-blue-500 rounded-xl bg-blue-500/10 mb-4">
      <h3 className="text-blue-600 font-bold mb-2">⚛️ React Counter (Interactive)</h3>
      <p className="mb-4 text-sm opacity-80">This component is built with React and hydrated via <code className="text-blue-500">client:load</code>.</p>
      <button 
        className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors active:scale-95"
        onClick={() => setCount(count + 1)}
      >
        React Count: {count}
      </button>
    </div>
  );
}
