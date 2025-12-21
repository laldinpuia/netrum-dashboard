import React from 'react';
import { Cpu, Coins, Clock, Zap, CheckCircle, XCircle } from 'lucide-react';

function StatCard({ icon: Icon, label, value, subValue, status, delay = 0 }) {
  const statusColors = {
    online: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    offline: 'text-red-400 bg-red-400/10 border-red-400/30',
    pending: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    default: 'text-netrum-400 bg-netrum-400/10 border-netrum-400/30'
  };

  return (
    <div 
      className="card card-hover animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${statusColors[status] || statusColors.default} border`}>
          <Icon className="w-5 h-5" />
        </div>
        {status && (
          <div className="flex items-center gap-1.5">
            {status === 'online' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : status === 'offline' ? (
              <XCircle className="w-4 h-4 text-red-400" />
            ) : null}
          </div>
        )}
      </div>
      
      <div>
        <p className="stat-label mb-1">{label}</p>
        <p className="stat-value text-white">
          {value ?? '--'}
        </p>
        {subValue && (
          <p className="text-sm text-dark-400 mt-1">{subValue}</p>
        )}
      </div>
    </div>
  );
}

function StatsGrid({ data }) {
  const { miningStatus, claimStatus, metricsStatus } = data;

  // Parse mining data
  const isMining = miningStatus?.mining || miningStatus?.status === 'active';
  const miningRate = miningStatus?.rate || miningStatus?.mining_rate || '0.5';
  
  // Parse claim data
  const pendingRewards = claimStatus?.pending || claimStatus?.claimable || '0';
  const totalClaimed = claimStatus?.total_claimed || claimStatus?.totalClaimed || '0';
  
  // Parse node status
  const nodeStatus = metricsStatus?.status || (isMining ? 'online' : 'offline');
  const uptime = metricsStatus?.uptime || '0';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={Cpu}
        label="Node Status"
        value={nodeStatus.charAt(0).toUpperCase() + nodeStatus.slice(1)}
        status={nodeStatus === 'active' || nodeStatus === 'online' ? 'online' : 'offline'}
        delay={0}
      />
      
      <StatCard
        icon={Zap}
        label="Mining Status"
        value={isMining ? 'Active' : 'Inactive'}
        subValue={`Rate: ${miningRate} NPT/day`}
        status={isMining ? 'online' : 'pending'}
        delay={100}
      />
      
      <StatCard
        icon={Coins}
        label="Pending Rewards"
        value={`${parseFloat(pendingRewards).toFixed(4)} NPT`}
        subValue={`Total: ${parseFloat(totalClaimed).toFixed(2)} NPT`}
        status="default"
        delay={200}
      />
      
      <StatCard
        icon={Clock}
        label="Uptime"
        value={formatUptime(uptime)}
        status="default"
        delay={300}
      />
    </div>
  );
}

function formatUptime(seconds) {
  if (!seconds || seconds === '0') return '--';
  
  const num = parseFloat(seconds);
  if (isNaN(num)) return '--';
  
  const days = Math.floor(num / 86400);
  const hours = Math.floor((num % 86400) / 3600);
  const minutes = Math.floor((num % 3600) / 60);
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default StatsGrid;
