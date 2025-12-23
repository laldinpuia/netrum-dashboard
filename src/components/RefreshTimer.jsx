import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RefreshCw, Pause, Play } from 'lucide-react';
import { useTheme } from '../App';

function RefreshTimer(props) {
  var onRefresh = props.onRefresh;
  var interval = props.interval || 69;
  var theme = useTheme().theme;
  var isDark = theme === 'dark';
  var [timeLeft, setTimeLeft] = useState(interval);
  var [isPaused, setIsPaused] = useState(false);
  var timerRef = useRef(null);
  var onRefreshRef = useRef(onRefresh);

  // Keep onRefresh ref updated
  useEffect(function() {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  useEffect(function() {
    if (isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(function() {
      setTimeLeft(function(prev) {
        if (prev <= 1) {
          // Call refresh without causing re-render loop
          setTimeout(function() {
            if (onRefreshRef.current) {
              onRefreshRef.current();
            }
          }, 0);
          return interval;
        }
        return prev - 1;
      });
    }, 1000);

    return function() {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPaused, interval]);

  var handleManualRefresh = useCallback(function() {
    if (onRefreshRef.current) {
      onRefreshRef.current();
    }
    setTimeLeft(interval);
  }, [interval]);

  var togglePause = useCallback(function() {
    setIsPaused(function(prev) { return !prev; });
  }, []);

  var progress = ((interval - timeLeft) / interval) * 100;

  return React.createElement('div', { className: isDark ? 'card mb-6' : 'card mb-6 bg-white border-gray-200' },
    React.createElement('div', { className: 'flex items-center justify-between' },
      React.createElement('div', { className: 'flex items-center gap-4' },
        React.createElement('div', { className: 'relative w-12 h-12' },
          React.createElement('svg', { className: 'w-12 h-12 transform -rotate-90' },
            React.createElement('circle', { cx: '24', cy: '24', r: '20', stroke: isDark ? '#1e293b' : '#e5e7eb', strokeWidth: '4', fill: 'none' }),
            React.createElement('circle', { cx: '24', cy: '24', r: '20', stroke: '#f97316', strokeWidth: '4', fill: 'none', strokeDasharray: 125.6, strokeDashoffset: 125.6 - (progress / 100) * 125.6, strokeLinecap: 'round', className: 'transition-all duration-1000' })
          ),
          React.createElement('div', { className: 'absolute inset-0 flex items-center justify-center' },
            React.createElement('span', { className: 'text-sm font-mono font-bold text-netrum-400' }, timeLeft)
          )
        ),
        React.createElement('div', null,
          React.createElement('p', { className: isDark ? 'text-sm font-medium text-white' : 'text-sm font-medium text-gray-900' }, isPaused ? 'Paused' : 'Refreshing in ' + timeLeft + 's'),
          React.createElement('p', { className: isDark ? 'text-xs text-dark-400' : 'text-xs text-gray-500' }, 'Auto-refresh every ' + interval + ' seconds')
        )
      ),
      React.createElement('div', { className: 'flex items-center gap-2' },
        React.createElement('button', { onClick: togglePause, className: isDark ? 'flex items-center gap-2 px-4 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors text-sm' : 'flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm' },
          isPaused ? React.createElement(Play, { className: 'w-4 h-4' }) : React.createElement(Pause, { className: 'w-4 h-4' }),
          isPaused ? 'Resume' : 'Pause'
        ),
        React.createElement('button', { onClick: handleManualRefresh, className: 'flex items-center gap-2 px-4 py-2 bg-netrum-500 hover:bg-netrum-600 text-white rounded-lg transition-colors text-sm' },
          React.createElement(RefreshCw, { className: 'w-4 h-4' }),
          'Refresh Now'
        )
      )
    )
  );
}

export default RefreshTimer;
