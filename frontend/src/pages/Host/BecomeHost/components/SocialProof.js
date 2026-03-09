import React, { useState, useEffect } from 'react';

const SocialProof = () => {
  const [stats, setStats] = useState({
    activeHosts: 10234,
    creatingNow: 234,
    bookingsToday: 1847,
    earningsThisWeek: 125000
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats(prev => ({
        activeHosts: prev.activeHosts + Math.floor(Math.random() * 3),
        creatingNow: 200 + Math.floor(Math.random() * 100),
        bookingsToday: prev.bookingsToday + Math.floor(Math.random() * 5),
        earningsThisWeek: prev.earningsThisWeek + Math.floor(Math.random() * 1000)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6 shadow-md">
      <div className="text-center mb-4">
        <div className="text-3xl mb-2">🔥</div>
        <h3 className="text-xl font-bold text-gray-900">
          Join {stats.activeHosts.toLocaleString()}+ Successful Hosts
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {stats.creatingNow}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            hosts creating listings now
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {stats.bookingsToday.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            bookings made today
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 text-center col-span-2">
          <div className="text-3xl font-bold text-green-600">
            ${stats.earningsThisWeek.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            earned by hosts this week
          </div>
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-gray-600">
        You're in good company! 🌟
      </div>
    </div>
  );
};

export default SocialProof;
