import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Ultra minimal components with NO context dependencies
const UltraLogin = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Ultra Test - Login</h1>
    <p>This is an ultra minimal login page with NO context dependencies.</p>
    <input className="border p-2 mr-2" placeholder="Email" />
    <input className="border p-2 mr-2" type="password" placeholder="Password" />
    <button className="bg-green-500 text-white px-4 py-2 rounded">Login</button>
  </div>
);

const UltraPlayground = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold mb-4">Ultra Test - Playground</h1>
    <p>This is an ultra minimal playground page with NO context dependencies.</p>
    <textarea className="w-full h-32 border p-2 mb-4" placeholder="Code here..."></textarea>
    <button className="bg-blue-500 text-white px-4 py-2 rounded">Run</button>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<UltraLogin />} />
          <Route path="/playground" element={<UltraPlayground />} />
          <Route path="/" element={<UltraPlayground />} />
          <Route path="*" element={<UltraLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;