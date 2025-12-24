import React from 'react';
import { Clock, Award, Coins, Activity, Loader } from 'lucide-react';
import { useTheme } from '../App';
import { formatDateTimeDMY } from '../api/netrum';

function StatsGrid({ nodeInfo, claimHistory, tokenData, claimLoading }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const node = nodeInfo?.node || {};
  const lastClaim = claimHistory?.lastClaim || {};
  const totalClaims = tokenData?.totalClaims || 0;
  const totalNpt = tokenData?.totalNptClaimed || 0;

  const stats = [
    {
      label: 'Total Tasks',
      value: node.taskCount ? node.taskCount.toLocaleString() : '0',
      icon: Activity,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    {
      label: 'Total Claims',
      value: claimLoading ? null : totalClaims.toString(),
      icon: Award,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      loading: claimLoading
    },
    {
      label: 'Total NPT Claimed',
      value: claimLoading ? null : totalNpt.toFixed(4) + ' NPT',
      icon: Coins,
      color: 'text-netrum-400',
      bgColor: 'bg-netrum-500/10',
      borderColor: 'border-netrum-500/30',
      loading: claimLoading
    },
    {
      label: 'Last Claim',
      value: claimLoading ? null : (lastClaim.timestamp ? formatDateTimeDMY(lastClaim.timestamp) : 'No claims yet'),
      icon: Clock,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      loading: claimLoading
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${isDark ? 'card' : 'card bg-white border-gray-200'} p-4`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${stat.bgColor} border ${stat.borderColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <span className={isDark ? 'text-sm text-dark-400' : 'text-sm text-gray-500'}>{stat.label}</span>
          </div>
          {stat.loading ? (
            <div className="flex items-center gap-2">
              <Loader className="w-4 h-4 animate-spin text-netrum-400" />
              <span className={isDark ? 'text-sm text-dark-500' : 'text-sm text-gray-400'}>Loading...</span>
            </div>
          ) : (
            <p className={`text-xl font-display font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {stat.value}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default StatsGrid;
