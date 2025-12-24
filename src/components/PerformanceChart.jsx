import React, { useMemo } from 'react';
import { Activity, Clock, TrendingUp, CheckCircle, Cpu, HardDrive, Download, Upload, MemoryStick } from 'lucide-react';
import { useTheme } from '../App';
import { formatDateTimeDMY } from '../api/netrum';

function PerformanceChart({ nodeInfo, tokenData }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const node = nodeInfo?.node || {};
  const metrics = node.nodeMetrics || {};
  const syncHistory = node.syncHistory || [];

  // Get last claim time from tokenData (same source as Last Claim card)
  const lastClaimTime = useMemo(() => {
    if (tokenData?.recentClaims?.length > 0) {
      const sortedClaims = [...tokenData.recentClaims].sort((a, b) => 
        parseInt(b.timeStamp) - parseInt(a.timeStamp)
      );
      return new Date(parseInt(sortedClaims[0].timeStamp) * 1000);
    }
    return null;
  }, [tokenData]);

  const healthScore = useMemo(() => {
    let score = 0;
    if (node.nodeStatus === 'Active') score += 25;
    if (node.syncStatus === 'Active') score += 25;
    if (metrics.cpu >= 2) score += 10;
    if (metrics.ram >= 4096) score += 10;
    if (metrics.disk >= 50) score += 10;
    if (metrics.speed >= 5) score += 10;
    if (metrics.uploadSpeed >= 5) score += 10;
    return score;
  }, [node, metrics]);

  const recentSyncs = syncHistory.slice(-10);
  const activeCount = recentSyncs.filter(s => s.status === 'Active' || s.meetsRequirements).length;
  const uptimePercent = recentSyncs.length > 0 ? ((activeCount / recentSyncs.length) * 100).toFixed(0) : 0;

  const requirements = [
    { label: 'CPU', icon: Cpu, required: '2 cores', actual: metrics.cpu || 0, unit: ' cores', ok: metrics.cpu >= 2 },
    { label: 'RAM', icon: MemoryStick, required: '4 GB', actual: metrics.ram ? (metrics.ram / 1024).toFixed(1) : 0, unit: ' GB', ok: metrics.ram >= 4096 },
    { label: 'Disk', icon: HardDrive, required: '50 GB', actual: metrics.disk || 0, unit: ' GB', ok: metrics.disk >= 50 },
    { label: 'Download', icon: Download, required: '5 Mbps', actual: metrics.speed ? metrics.speed.toFixed(0) : 0, unit: ' Mbps', ok: metrics.speed >= 5 },
    { label: 'Upload', icon: Upload, required: '5 Mbps', actual: metrics.uploadSpeed ? metrics.uploadSpeed.toFixed(0) : 0, unit: ' Mbps', ok: metrics.uploadSpeed >= 5 }
  ];

  const recentEvents = useMemo(() => {
    const events = [];
    if (node.lastPolledAt) {
      events.push({ type: 'sync', time: node.lastPolledAt, label: 'Last Sync' });
    }
    // Use lastClaimTime from tokenData for NPT Claimed
    if (lastClaimTime) {
      events.push({ type: 'claim', time: lastClaimTime.toISOString(), label: 'NPT Claimed' });
    }
    if (node.lastMiningStart) {
      events.push({ type: 'mining', time: node.lastMiningStart, label: 'First Mining Started' });
    }
    return events.sort((a, b) => new Date(b.time) - new Date(a.time));
  }, [node, lastClaimTime]);

  return (
    <div className={isDark ? 'card card-hover' : 'card card-hover bg-white border-gray-200'}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-netrum-500/10 border border-netrum-500/30">
          <Activity className="w-5 h-5 text-netrum-400" />
        </div>
        <div>
          <h3 className={isDark ? 'font-display font-semibold text-white' : 'font-display font-semibold text-gray-900'}>Performance Analytics</h3>
          <p className={isDark ? 'text-sm text-dark-400' : 'text-sm text-gray-500'}>Node health and system metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Health Score */}
        <div className={isDark ? 'bg-dark-800/50 rounded-xl p-4' : 'bg-gray-50 rounded-xl p-4'}>
          <div className="flex items-center justify-between mb-2">
            <span className={isDark ? 'text-sm text-dark-400' : 'text-sm text-gray-500'}>Health Score</span>
            <TrendingUp className={healthScore >= 80 ? 'w-4 h-4 text-emerald-400' : healthScore >= 50 ? 'w-4 h-4 text-amber-400' : 'w-4 h-4 text-red-400'} />
          </div>
          <div className="flex items-end gap-2">
            <span className={`text-2xl font-display font-bold ${healthScore >= 80 ? 'text-emerald-400' : healthScore >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{healthScore}</span>
            <span className={isDark ? 'text-sm text-dark-400 mb-1' : 'text-sm text-gray-500 mb-1'}>/100</span>
          </div>
          <div className={isDark ? 'h-1.5 bg-dark-700 rounded-full mt-2 overflow-hidden' : 'h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden'}>
            <div className={`h-full rounded-full ${healthScore >= 80 ? 'bg-emerald-400' : healthScore >= 50 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: healthScore + '%' }} />
          </div>
        </div>

        {/* Total Syncs */}
        <div className={isDark ? 'bg-dark-800/50 rounded-xl p-4' : 'bg-gray-50 rounded-xl p-4'}>
          <div className="flex items-center justify-between mb-2">
            <span className={isDark ? 'text-sm text-dark-400' : 'text-sm text-gray-500'}>Total Syncs</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <span className={isDark ? 'text-2xl font-display font-bold text-white' : 'text-2xl font-display font-bold text-gray-900'}>{node.syncCount?.toLocaleString() || '0'}</span>
        </div>

        {/* Uptime */}
        <div className={isDark ? 'bg-dark-800/50 rounded-xl p-4' : 'bg-gray-50 rounded-xl p-4'}>
          <div className="flex items-center justify-between mb-2">
            <span className={isDark ? 'text-sm text-dark-400' : 'text-sm text-gray-500'}>Uptime (Recent)</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-display font-bold text-emerald-400">{uptimePercent}%</span>
        </div>

        {/* Status */}
        <div className={isDark ? 'bg-dark-800/50 rounded-xl p-4' : 'bg-gray-50 rounded-xl p-4'}>
          <div className="flex items-center justify-between mb-2">
            <span className={isDark ? 'text-sm text-dark-400' : 'text-sm text-gray-500'}>Node Status</span>
            <div className={node.nodeStatus === 'Active' ? 'w-2 h-2 bg-emerald-400 rounded-full animate-pulse' : 'w-2 h-2 bg-red-400 rounded-full'} />
          </div>
          <span className={node.nodeStatus === 'Active' ? 'text-2xl font-display font-bold text-emerald-400' : 'text-2xl font-display font-bold text-red-400'}>{node.nodeStatus || 'Unknown'}</span>
        </div>
      </div>

      {/* Requirements Status */}
      <div className="mb-6">
        <h4 className={isDark ? 'text-sm font-medium text-dark-300 mb-3' : 'text-sm font-medium text-gray-600 mb-3'}>Requirements Status</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {requirements.map((req, i) => (
            <div key={i} className={isDark ? 'bg-dark-800/30 rounded-lg p-3' : 'bg-gray-100 rounded-lg p-3'}>
              <div className="flex items-center gap-2 mb-2">
                <req.icon className={isDark ? 'w-4 h-4 text-dark-400' : 'w-4 h-4 text-gray-400'} />
                <span className={isDark ? 'text-xs text-dark-400' : 'text-xs text-gray-500'}>{req.label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isDark ? 'text-sm font-medium text-white' : 'text-sm font-medium text-gray-900'}>{req.actual}{req.unit}</span>
                <span className={req.ok ? 'text-xs px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded' : 'text-xs px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded'}>{req.ok ? 'OK' : 'LOW'}</span>
              </div>
              <p className={isDark ? 'text-[10px] text-dark-500 mt-1' : 'text-[10px] text-gray-400 mt-1'}>Required: {req.required}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h4 className={isDark ? 'text-sm font-medium text-dark-300 mb-3' : 'text-sm font-medium text-gray-600 mb-3'}>Recent Activity</h4>
        <div className={isDark ? 'bg-dark-800/30 rounded-lg p-3' : 'bg-gray-100 rounded-lg p-3'}>
          {recentEvents.length > 0 ? (
            <div className="space-y-2">
              {recentEvents.map((event, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={event.type === 'claim' ? 'w-2 h-2 bg-netrum-400 rounded-full' : event.type === 'sync' ? 'w-2 h-2 bg-blue-400 rounded-full' : 'w-2 h-2 bg-emerald-400 rounded-full'} />
                    <span className={isDark ? 'text-sm text-dark-300' : 'text-sm text-gray-600'}>{event.label}</span>
                  </div>
                  <span className={isDark ? 'text-xs text-dark-400 font-mono' : 'text-xs text-gray-500 font-mono'}>{formatDateTimeDMY(event.time)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className={isDark ? 'text-sm text-dark-400 text-center py-2' : 'text-sm text-gray-500 text-center py-2'}>No recent activity</p>
          )}
          <div className={isDark ? 'mt-3 pt-3 border-t border-dark-700 flex justify-between text-xs text-dark-500' : 'mt-3 pt-3 border-t border-gray-200 flex justify-between text-xs text-gray-400'}>
            <span>● Live updates enabled</span>
            <span>Cooldown: 13 minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformanceChart;
