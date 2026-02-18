import React, { useState, useEffect } from 'react';

export default function DigitalClock({ isDarkMode }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className={`flex items-center gap-3 ${isDarkMode ? 'text-slate-400 bg-slate-900/50 border-slate-800/50' : 'text-slate-600 bg-white border-slate-200'} backdrop-blur-md px-6 py-2.5 rounded-full border shadow-lg font-mono text-sm tracking-widest`}>
      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
      <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{time.toLocaleTimeString('pt-PT')}</span>
    </div>
  );
}