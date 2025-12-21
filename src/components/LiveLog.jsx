import React, { useState } from 'react';
import { Activity, Filter, ChevronDown, Circle } from 'lucide-react';

function LiveLog({ data }) {
  const [filter, setFilter] = useState('all');
  const events = data?.events || data?.logs || [];

  const eventTypes = {
    heartbeat: { color: 'text-emerald-400', bg: 'bg-emerald-400' },
    mining: { color: 'text-netrum-400', bg: 'bg-netrum-400' },
    claim: { color: 'text-purple-400', bg: 'bg-purple-400' },
    sync: { color: 'text-blue-400', bg: 'bg-blue-400' },
    error: { color: 'text-red-400', bg: 'bg-red-400' },
    default: { color: 'text-dark-400', bg: 'bg-dark-400' }
  };

  const filteredEvents = events.filter(event => 
    filter === 'all' || (event.type || event.event_type) === filter
  );

  const getEventStyle = (type) => eventTypes[type] || eventTypes.default;

  return (
    <div className="card card-hover">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-white">Live Activity Log</h3>
            <p className="text-sm text-dark-400">Real-time node events</p>
          </div>
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 pr-8 text-sm text-dark-200 focus:outline-none focus:border-netrum-500"
          >
            <option value="all">All Events</option>
            <option value="heartbeat">Heartbeats</option>
            <option value="mining">Mining</option>
            <option value="claim">Claims</option>
            <option value="sync">Sync</option>
            <option value="error">Errors</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 pointer-events-none" />
        </div>
      </div>

      {/* Log Entries */}
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => {
            const type = event.type || event.event_type || 'default';
            const style = getEventStyle(type);
            
            return (
              <div 
                key={index}
                className="flex items-start gap-3 py-3 px-3 bg-dark-800/30 rounded-lg hover:bg-dark-800/50 transition-colors"
              >
                <div className="mt-1">
                  <Circle className={`w-2 h-2 ${style.color} fill-current`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium uppercase tracking-wider ${style.color}`}>
                      {type}
                    </span>
                    <span className="text-xs text-dark-500">
                      {formatTimestamp(event.timestamp || event.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-dark-200 truncate">
                    {event.message || event.description || `${type} event recorded`}
                  </p>
                  {event.details && (
                    <p className="text-xs text-dark-400 mt-1 font-mono">
                      {typeof event.details === 'object' 
                        ? JSON.stringify(event.details) 
                        : event.details
                      }
                    </p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-dark-600 mx-auto mb-3" />
            <p className="text-dark-400 text-sm">No events recorded</p>
            <p className="text-dark-500 text-xs mt-1">Events will appear here in real-time</p>
          </div>
        )}
      </div>

      {/* Live Indicator */}
      <div className="mt-4 pt-4 border-t border-dark-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full live-indicator" />
          <span className="text-xs text-dark-400">Live updates enabled</span>
        </div>
        <span className="text-xs text-dark-500">
          {events.length} total events
        </span>
      </div>
    </div>
  );
}

function formatTimestamp(timestamp) {
  if (!timestamp) return '--';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  
  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  
  return date.toLocaleDateString();
}

export default LiveLog;
