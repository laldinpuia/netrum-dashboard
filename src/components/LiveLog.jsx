import React from 'react';
import { Activity, Clock, CheckCircle, Timer } from 'lucide-react';
import { useTheme } from '../App';
import { formatDateTimeDMY } from '../api/netrum';

function LiveLog({ nodeInfo, miningStatus }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const node = nodeInfo && nodeInfo.node ? nodeInfo.node : {};
  const mining = miningStatus || {};
  const miningInfo = mining.miningStatus || {};
  const contractDetails = mining.contractDetails || {};
  const miningData = contractDetails.miningInfo || {};

  const isReady = miningData.percentComplete >= 10000 || miningData.percentComplete >= 100;
  const isActive = miningData.isActive || miningInfo.canStartMining;

  const events = [];
  if (node.lastPolledAt) {
    events.push({ type: 'sync', time: node.lastPolledAt, label: 'Node Synced' });
  }
  if (node.lastClaimTime) {
    events.push({ type: 'claim', time: node.lastClaimTime, label: 'NPT Claimed' });
  }
  if (node.lastMiningStart) {
    events.push({ type: 'mining', time: node.lastMiningStart, label: 'First Mining Started' });
  }
  events.sort((a, b) => new Date(b.time) - new Date(a.time));

  return (
    <div className={isDark ? 'card card-hover' : 'card card-hover bg-white border-gray-200'}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className={isDark ? 'font-display font-semibold text-white' : 'font-display font-semibold text-gray-900'}>Live Activity Log</h3>
            <p className={isDark ? 'text-sm text-dark-400' : 'text-sm text-gray-500'}>Real-time node events</p>
          </div>
        </div>

        <div className={isReady ? 'flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30' : 'flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30'}>
          {isReady ? (
            <>
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-400">Ready</span>
            </>
          ) : (
            <>
              <Timer className="w-3 h-3 text-amber-400" />
              <span className="text-xs font-medium text-amber-400">Cooldown</span>
            </>
          )}
        </div>
      </div>

      <div className={isDark ? 'bg-dark-800/50 rounded-xl p-6 mb-4' : 'bg-gray-50 rounded-xl p-6 mb-4'}>
        <div className="flex items-center justify-center mb-4">
          <div className={isReady ? 'w-20 h-20 rounded-full border-4 border-emerald-500/30 flex items-center justify-center' : 'w-20 h-20 rounded-full border-4 border-amber-500/30 flex items-center justify-center'}>
            <Clock className={isReady ? 'w-10 h-10 text-emerald-400' : 'w-10 h-10 text-amber-400'} />
          </div>
        </div>
        <p className={isDark ? 'text-center text-lg font-semibold text-white mb-2' : 'text-center text-lg font-semibold text-gray-900 mb-2'}>
          {isReady ? 'Ready to Claim!' : 'Cooling Down'}
        </p>
        <p className={isDark ? 'text-center text-sm text-dark-400' : 'text-center text-sm text-gray-500'}>
          {isActive ? '● Live updates enabled' : '○ Node inactive'}
        </p>
      </div>

      {events.length > 0 ? (
        <div className="space-y-2">
          {events.map((event, i) => (
            <div key={i} className={isDark ? 'flex items-center gap-3 p-3 bg-dark-800/30 rounded-lg' : 'flex items-center gap-3 p-3 bg-gray-50 rounded-lg'}>
              <div className={event.type === 'claim' ? 'w-2 h-2 rounded-full bg-netrum-400' : event.type === 'sync' ? 'w-2 h-2 rounded-full bg-emerald-400' : 'w-2 h-2 rounded-full bg-blue-400'} />
              <div className="flex-1">
                <p className={isDark ? 'text-sm text-white' : 'text-sm text-gray-900'}>{event.label}</p>
                <p className={isDark ? 'text-xs text-dark-400' : 'text-xs text-gray-500'}>{formatDateTimeDMY(event.time)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={isDark ? 'text-sm text-dark-400 text-center py-4' : 'text-sm text-gray-500 text-center py-4'}>
          Waiting for activity...
        </p>
      )}

      <div className={isDark ? 'mt-4 pt-4 border-t border-dark-800 flex justify-between text-xs text-dark-400' : 'mt-4 pt-4 border-t border-gray-200 flex justify-between text-xs text-gray-500'}>
        <span>● Live updates enabled</span>
        <span>Cooldown: 5 minutes</span>
      </div>
    </div>
  );
}

export default LiveLog;
