import React from 'react';
import { Globe, Users, Coins, TrendingUp, Activity } from 'lucide-react';

function NetworkStats({ data }) {
  const stats = [
    {
      icon: Users,
      label: 'Total Nodes',
      value: data?.total_nodes || data?.totalNodes || '--',
      change: data?.nodes_change,
      color: 'netrum'
    },
    {
      icon: Activity,
      label: 'Active Nodes',
      value: data?.active_nodes || data?.activeNodes || '--',
      change: data?.active_change,
      color: 'emerald'
    },
    {
      icon: Coins,
      label: 'Total NPT Mined',
      value: formatNumber(data?.total_mined || data?.totalMined),
      suffix: 'NPT',
      color: 'purple'
    },
    {
      icon: TrendingUp,
      label: 'Network Hash Rate',
      value: data?.hash_rate || data?.hashRate || '--',
      suffix: data?.hash_unit || '',
      color: 'blue'
    }
  ];

  return (
    <div className="card card-hover">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-netrum-500/20 to-netrum-700/20 border border-netrum-500/30">
          <Globe className="w-5 h-5 text-netrum-400" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-white">Network Overview</h3>
          <p className="text-sm text-dark-400">Global Netrum network statistics</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <NetworkStatCard key={index} {...stat} delay={index * 100} />
        ))}
      </div>
    </div>
  );
}

function NetworkStatCard({ icon: Icon, label, value, suffix, change, color, delay }) {
  const colorClasses = {
    netrum: 'from-netrum-500/10 to-netrum-600/10 border-netrum-500/20 text-netrum-400',
    emerald: 'from-emerald-500/10 to-emerald-600/10 border-emerald-500/20 text-emerald-400',
    purple: 'from-purple-500/10 to-purple-600/10 border-purple-500/20 text-purple-400',
    blue: 'from-blue-500/10 to-blue-600/10 border-blue-500/20 text-blue-400'
  };

  const classes = colorClasses[color] || colorClasses.netrum;

  return (
    <div 
      className={`bg-gradient-to-br ${classes} border rounded-xl p-4 animate-slide-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 opacity-80" />
        <span className="text-xs uppercase tracking-wider opacity-80">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-display font-bold text-white">{value}</span>
        {suffix && <span className="text-sm text-dark-400">{suffix}</span>}
      </div>
      {change !== undefined && change !== null && (
        <div className={`text-xs mt-2 ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {change >= 0 ? '+' : ''}{change}% from yesterday
        </div>
      )}
    </div>
  );
}

function formatNumber(num) {
  if (num === null || num === undefined) return '--';
  
  const n = parseFloat(num);
  if (isNaN(n)) return '--';
  
  if (n >= 1000000) return `${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(2)}K`;
  return n.toFixed(2);
}

export default NetworkStats;
