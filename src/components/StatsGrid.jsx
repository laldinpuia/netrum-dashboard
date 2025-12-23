import React, { useState, useEffect } from 'react';
import { Server, Zap, RefreshCw, Clock, XCircle } from 'lucide-react';
import { useTheme } from '../App';
import { fetchEthPrice, formatDateDMY } from '../api/netrum';

function StatsGrid(props) {
  var nodeInfo = props.nodeInfo;
  var claimHistory = props.claimHistory;
  var tokenData = props.tokenData;
  var theme = useTheme().theme;
  var isDark = theme === 'dark';
  var [ethPrice, setEthPrice] = useState(null);

  useEffect(function() {
    fetchEthPrice().then(setEthPrice);
  }, []);

  var node = nodeInfo && nodeInfo.node ? nodeInfo.node : {};
  var history = claimHistory || {};
  var lastClaim = history.lastClaim || {};
  var totalClaims = tokenData && tokenData.totalClaims ? tokenData.totalClaims : (history.totalClaims || 0);

  var isActive = node.nodeStatus === 'Active';
  var syncStatus = node.syncStatus || 'Unknown';
  var syncCount = node.syncCount || 0;
  var taskCount = node.taskCount || 0;
  var lastClaimDate = lastClaim.timestamp ? formatDateDMY(lastClaim.timestamp) : '--';

  var stats = [
    {
      label: 'Node Status',
      value: node.nodeStatus || 'Unknown',
      icon: Server,
      color: isActive ? 'emerald' : 'red',
      badge: isActive ? null : React.createElement(XCircle, { className: 'w-4 h-4 text-red-400' })
    },
    {
      label: 'Sync Status',
      value: syncStatus,
      subValue: 'Tasks: ' + taskCount.toLocaleString(),
      icon: Zap,
      color: syncStatus === 'Active' ? 'emerald' : 'amber'
    },
    {
      label: 'Sync Count',
      value: syncCount.toLocaleString(),
      subValue: 'Total syncs',
      icon: RefreshCw,
      color: 'blue'
    },
    {
      label: 'Last Claim',
      value: lastClaimDate,
      subValue: totalClaims > 0 ? totalClaims + ' total claims' : null,
      icon: Clock,
      color: 'netrum'
    }
  ];

  return React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4' },
    stats.map(function(stat, index) {
      var Icon = stat.icon;
      var colorClasses = {
        emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        red: 'bg-red-500/10 border-red-500/30 text-red-400',
        amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
        netrum: 'bg-netrum-500/10 border-netrum-500/30 text-netrum-400'
      };
      var iconClass = colorClasses[stat.color] || colorClasses.netrum;

      return React.createElement('div', { key: index, className: isDark ? 'card card-hover' : 'card card-hover bg-white border-gray-200' },
        React.createElement('div', { className: 'flex items-start justify-between mb-4' },
          React.createElement('div', { className: 'p-3 rounded-xl border ' + iconClass },
            React.createElement(Icon, { className: 'w-5 h-5' })
          ),
          stat.badge
        ),
        React.createElement('p', { className: isDark ? 'text-xs uppercase tracking-wider text-dark-400 mb-1' : 'text-xs uppercase tracking-wider text-gray-500 mb-1' }, stat.label),
        React.createElement('p', { className: isDark ? 'text-2xl font-display font-bold text-white' : 'text-2xl font-display font-bold text-gray-900' }, stat.value),
        stat.subValue && React.createElement('p', { className: isDark ? 'text-sm text-dark-400 mt-1' : 'text-sm text-gray-500 mt-1' }, stat.subValue)
      );
    })
  );
}

export default StatsGrid;
