import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard - Minimal Version</h1>
      <p>This is a minimal dashboard to test for rendering errors.</p>
      <div className="mt-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Test Button
        </button>
      </div>
    </div>
  );
};

export default Dashboard;