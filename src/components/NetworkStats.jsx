import React from 'react';
import { Globe, Users, TrendingUp, Activity } from 'lucide-react';
import { useTheme } from '../App';

function NetworkStats({ stats, activeNodes }) {
  const { theme } = useTheme();
  const statsData = stats || {};

  const statItems = [
    { icon: Users, label: 'Total Nodes', value: statsData.totalNodes || '--', color: 'netrum' },
    { icon: Activity, label: 'Active Nodes', value: statsData.activeNodes || '--', color: 'emerald' },
    { icon: Users, label: 'Inactive Nodes', value: statsData.inactiveNodes || '--', color: 'purple' },
    { icon: TrendingUp, label: 'Total Tasks', value: formatNumber(statsData.totalTasks), color: 'blue' }
  ];

  return (
    <div className={`card card-hover ${theme === 'dark' ? '' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-netrum-500/20 to-netrum-700/20 border border-netrum-500/30">
          <Globe className="w-5 h-5 text-netrum-400" />
        </div>
        <div>
          <h3 className={`font-display font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Network Overview</h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-gray-500'}`}>Global Netrum network statistics</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((stat, index) => (
          <NetworkStatCard key={index} {...stat} delay={index * 100} theme={theme} />
        ))}
      </div>
    </div>
  );
}

function NetworkStatCard({ icon: Icon, label, value, color, delay, theme }) {
  const colorClasses = {
    netrum: 'from-netrum-500/10 to-netrum-600/10 border-netrum-500/20 text-netrum-400',
    emerald: 'from-emerald-500/10 to-emerald-600/10 border-emerald-500/20 text-emerald-400',
    purple: 'from-purple-500/10 to-purple-600/10 border-purple-500/20 text-purple-400',
    blue: 'from-blue-500/10 to-blue-600/10 border-blue-500/20 text-blue-400'
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-4 animate-slide-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 opacity-80" />
        <span className="text-xs uppercase tracking-wider opacity-80">{label}</span>
      </div>
      <span className={`text-2xl font-display font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{value}</span>
    </div>
  );
}

function formatNumber(num) {
  if (num === null || num === undefined) return '--';
  const n = parseFloat(num);
  if (isNaN(n)) return '--';
  if (n >= 1000000) return `${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

export default NetworkStats;
