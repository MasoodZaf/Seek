import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Minimal test components
const MinimalPlayground = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Nuclear Test - Playground</h1>
    <p>This is a minimal playground page to test for rendering errors.</p>
    <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
      Test Button
    </button>
  </div>
);

const MinimalLogin = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Nuclear Test - Login</h1>
    <p>This is a minimal login page.</p>
    <input className="border p-2 mr-2" placeholder="Test input" />
    <button className="bg-green-500 text-white px-4 py-2 rounded">Login</button>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<MinimalLogin />} />
          <Route path="/playground" element={<MinimalPlayground />} />
          <Route path="/" element={<MinimalPlayground />} />
          <Route path="*" element={<MinimalLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;