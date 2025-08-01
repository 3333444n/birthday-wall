import React, { useState } from 'react';

const Controller: React.FC = () => {
  const [announcement, setAnnouncement] = useState('');
  const [isAnnouncementActive, setIsAnnouncementActive] = useState(false);

  const sendAnnouncement = () => {
    if (announcement.trim()) {
      // Placeholder for announcement logic
      alert(`Announcement sent: "${announcement}"`);
      setIsAnnouncementActive(true);
      setAnnouncement('');
      
      // Auto-clear after 10 seconds
      setTimeout(() => {
        setIsAnnouncementActive(false);
      }, 10000);
    }
  };

  const quickAnnouncements = [
    "🍰 Cake time in 5 minutes!",
    "📸 Group photo time!",
    "🎵 Dance party starting now!",
    "🍕 Pizza is here!",
    "🎁 Gift opening time!"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-party-accent to-party-purple p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-white mb-2">
          🎮 Host Controller
        </h1>
        <p className="text-white/90">
          Manage the party display and make announcements
        </p>
      </div>

      {/* Announcement Controls */}
      <div className="party-card mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          📢 Send Announcement
        </h3>
        
        {isAnnouncementActive && (
          <div className="bg-party-primary text-white p-3 rounded-lg mb-4">
            <div className="font-bold">🔴 LIVE ANNOUNCEMENT</div>
            <div className="text-sm">Currently showing on projector screen</div>
          </div>
        )}

        <textarea
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          placeholder="Type your announcement here..."
          className="w-full p-3 border rounded-lg mb-4 text-gray-800"
          rows={3}
        />
        
        <button 
          onClick={sendAnnouncement}
          disabled={!announcement.trim()}
          className="party-button w-full mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          📢 Send to Big Screen
        </button>

        {/* Quick Announcements */}
        <div>
          <h4 className="font-bold text-gray-700 mb-2">Quick Announcements:</h4>
          <div className="space-y-2">
            {quickAnnouncements.map((msg, index) => (
              <button
                key={index}
                onClick={() => setAnnouncement(msg)}
                className="w-full text-left p-2 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-700 transition-colors"
              >
                {msg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Display Controls */}
      <div className="party-card mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          🖥️ Display Controls
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg">
            ⏸️ Pause Slides
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg">
            ▶️ Resume Slides
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded">
            🎨 Show Drawing Slide
          </button>
          <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded">
            📸 Show Photo Slide
          </button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded">
            🏀 Show Bouncing Face
          </button>
          <button className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded">
            🌍 Show Messages
          </button>
        </div>
      </div>

      {/* Emergency Controls */}
      <div className="party-card mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          🚨 Emergency Controls
        </h3>
        <div className="space-y-3">
          <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg">
            🗑️ Clear All Drawings
          </button>
          <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg">
            💾 Save Current Canvas
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="party-card">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          📊 Party Stats
        </h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-2xl font-bold text-party-primary">0</div>
            <div className="text-sm text-gray-600">Active Drawers</div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-2xl font-bold text-party-secondary">0</div>
            <div className="text-sm text-gray-600">Photos Shared</div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center text-white/80 text-sm">
        <p>Keep this page open to control the party display</p>
        <p>All changes appear instantly on the projector screen</p>
      </div>
    </div>
  );
};

export default Controller;