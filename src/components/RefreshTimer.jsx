import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Pause, Play, Clock } from 'lucide-react';

function RefreshTimer({ onRefresh, isRefreshing, lastUpdated, interval = 30 }) {
  const [countdown, setCountdown] = useState(interval);
  const [isPaused, setIsPaused] = useState(false);

  const handleRefresh = useCallback(() => {
    onRefresh();
    setCountdown(interval);
  }, [onRefresh, interval]);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          handleRefresh();
          return interval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, interval, handleRefresh]);

  const progressPercentage = ((interval - countdown) / interval) * 100;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-dark-900/50 border border-dark-800 rounded-xl">
      <div className="flex items-center gap-4">
        {/* Progress Ring */}
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-dark-700"
            />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${progressPercentage} 100`}
              strokeLinecap="round"
              className="text-netrum-500 transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-mono font-bold text-white">{countdown}</span>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-white">
            {isPaused ? 'Auto-refresh paused' : `Refreshing in ${countdown}s`}
          </p>
          {lastUpdated && (
            <p className="text-xs text-dark-400 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Pause/Resume Button */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="btn-secondary flex items-center gap-2"
        >
          {isPaused ? (
            <>
              <Play className="w-4 h-4" />
              Resume
            </>
          ) : (
            <>
              <Pause className="w-4 h-4" />
              Pause
            </>
          )}
        </button>

        {/* Manual Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Now
        </button>
      </div>
    </div>
  );
}

export default RefreshTimer;
