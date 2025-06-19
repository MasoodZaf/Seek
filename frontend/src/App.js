import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Playground from './pages/Playground';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Playground />} />
      </Routes>
    </div>
  );
}

export default App;
