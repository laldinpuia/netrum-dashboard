import React, { useMemo } from 'react';
import { BarChart3, Activity, Zap, Shield, Clock, Cpu, MemoryStick, HardDrive, Download, Upload, CheckCircle } from 'lucide-react';
import { useTheme } from '../App';
import { formatDateTimeDMY } from '../api/netrum';

function PerformanceChart({ nodeInfo }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const node = nodeInfo && nodeInfo.node ? nodeInfo.node : {};
  const metrics = node.nodeMetrics || {};
  const syncHistory = node.syncHistory || [];

  const activeCount = syncHistory.filter(s => s.status === 'Active' || s.meetsRequirements).length;
  const uptimeRate = syncHistory.length > 0 ? ((activeCount / syncHistory.length) * 100).toFixed(1) : 0;

  const healthScore = useMemo(() => {
    let score = 0;
    if (metrics.cpu >= 2) score += 20;
    if (metrics.ram >= 4096) score += 20;
    if (metrics.disk >= 50) score += 20;
    if (metrics.speed >= 5) score += 20;
    if (metrics.uploadSpeed >= 5) score += 20;
    return Math.min(100, score);
  }, [metrics]);

  const recentEvents = useMemo(() => {
    const events = [];
    if (node.lastClaimTime) {
      events.push({ type: 'claim', time: node.lastClaimTime, label: 'NPT Claimed' });
    }
    if (node.lastPolledAt) {
      events.push({ type: 'sync', time: node.lastPolledAt, label: 'Last Sync' });
    }
    if (metrics.lastMetricsUpdate) {
      events.push({ type: 'metrics', time: metrics.lastMetricsUpdate, label: 'Metrics Updated' });
    }
    return events.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);
  }, [node, metrics]);

  const minRequirements = [
    { label: 'CPU', icon: Cpu, value: '2 cores' },
    { label: 'RAM', icon: MemoryStick, value: '4 GB' },
    { label: 'Disk', icon: HardDrive, value: '50 GB' },
    { label: 'Down', icon: Download, value: '5 Mbps' },
    { label: 'Up', icon: Upload, value: '5 Mbps' }
  ];

  const actualSpecs = [
    { label: 'CPU', icon: Cpu, value: metrics.cpu || 0, unit: '', ok: metrics.cpu >= 2 },
    { label: 'RAM', icon: MemoryStick, value: metrics.ram ? (metrics.ram / 1024).toFixed(1) : 0, unit: ' GB', ok: metrics.ram >= 4096 },
    { label: 'Disk', icon: HardDrive, value: metrics.disk || 0, unit: ' GB', ok: metrics.disk >= 50 },
    { label: 'Down', icon: Download, value: metrics.speed ? metrics.speed.toFixed(0) : 0, unit: ' Mbps', ok: metrics.speed >= 5 },
    { label: 'Up', icon: Upload, value: metrics.uploadSpeed ? metrics.uploadSpeed.toFixed(0) : 0, unit: ' Mbps', ok: metrics.uploadSpeed >= 5 }
  ];

  return (
    <div className={isDark ? 'card card-hover' : 'card card-hover bg-white border-gray-200'}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-netrum-500/10 border border-netrum-500/30">
          <BarChart3 className="w-5 h-5 text-netrum-400" />
        </div>
        <div>
          <h3 className={isDark ? 'font-display font-semibold text-white' : 'font-display font-semibold text-gray-900'}>Performance Analytics</h3>
          <p className={isDark ? 'text-sm text-dark-400' : 'text-sm text-gray-500'}>Node health and activity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className={isDark ? 'bg-dark-800/50 rounded-xl p-4 text-center' : 'bg-gray-50 rounded-xl p-4 text-center'}>
          <Shield className={healthScore >= 80 ? 'w-8 h-8 mx-auto mb-2 text-emerald-400' : healthScore >= 50 ? 'w-8 h-8 mx-auto mb-2 text-amber-400' : 'w-8 h-8 mx-auto mb-2 text-red-400'} />
          <p className={isDark ? 'text-3xl font-display font-bold text-white' : 'text-3xl font-display font-bold text-gray-900'}>{healthScore}%</p>
          <p className={isDark ? 'text-xs text-dark-400' : 'text-xs text-gray-500'}>Health Score</p>
        </div>
        <div className={isDark ? 'bg-dark-800/50 rounded-xl p-4 text-center' : 'bg-gray-50 rounded-xl p-4 text-center'}>
          <Activity className="w-8 h-8 mx-auto mb-2 text-netrum-400" />
          <p className={isDark ? 'text-3xl font-display font-bold text-white' : 'text-3xl font-display font-bold text-gray-900'}>{node.syncCount ? node.syncCount.toLocaleString() : '0'}</p>
          <p className={isDark ? 'text-xs text-dark-400' : 'text-xs text-gray-500'}>Total Syncs</p>
        </div>
        <div className={isDark ? 'bg-dark-800/50 rounded-xl p-4 text-center' : 'bg-gray-50 rounded-xl p-4 text-center'}>
          <Zap className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
          <p className="text-3xl font-display font-bold text-emerald-400">{uptimeRate}%</p>
          <p className={isDark ? 'text-xs text-dark-400' : 'text-xs text-gray-500'}>Uptime Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <div className={isDark ? 'flex items-center gap-2 mb-3 text-dark-300' : 'flex items-center gap-2 mb-3 text-gray-600'}>
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Requirements Status</span>
          </div>
          
          {/* Min Requirements Box */}
          <div className={isDark ? 'bg-dark-800/30 rounded-lg p-3 mb-2' : 'bg-gray-50 rounded-lg p-3 mb-2'}>
            <p className={isDark ? 'text-xs text-dark-500 mb-2 uppercase tracking-wider' : 'text-xs text-gray-400 mb-2 uppercase tracking-wider'}>Min Requirements</p>
            <div className="grid grid-cols-5 gap-1">
              {minRequirements.map((req, i) => {
                const Icon = req.icon;
                return (
                  <div key={i} className="text-center">
                    <Icon className={isDark ? 'w-3 h-3 mx-auto mb-1 text-dark-500' : 'w-3 h-3 mx-auto mb-1 text-gray-400'} />
                    <p className={isDark ? 'text-[10px] text-dark-500' : 'text-[10px] text-gray-400'}>{req.label}</p>
                    <p className={isDark ? 'text-xs font-mono text-dark-400' : 'text-xs font-mono text-gray-500'}>{req.value}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actual Specs Box */}
          <div className={isDark ? 'bg-dark-800/30 rounded-lg p-3 flex-1' : 'bg-gray-50 rounded-lg p-3 flex-1'}>
            <p className={isDark ? 'text-xs text-dark-500 mb-2 uppercase tracking-wider' : 'text-xs text-gray-400 mb-2 uppercase tracking-wider'}>Actual Specs</p>
            <div className="grid grid-cols-5 gap-1">
              {actualSpecs.map((spec, i) => {
                const Icon = spec.icon;
                return (
                  <div key={i} className="text-center">
                    <Icon className={isDark ? 'w-3 h-3 mx-auto mb-1 text-dark-400' : 'w-3 h-3 mx-auto mb-1 text-gray-500'} />
                    <p className={isDark ? 'text-[10px] text-dark-500' : 'text-[10px] text-gray-400'}>{spec.label}</p>
                    <p className={isDark ? 'text-xs font-mono text-white' : 'text-xs font-mono text-gray-900'}>{spec.value}{spec.unit}</p>
                    {spec.ok ? (
                      <div className="w-3 h-3 mx-auto mt-1 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </div>
                    ) : (
                      <div className="w-3 h-3 mx-auto mt-1 rounded-full bg-red-500/20 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className={isDark ? 'flex items-center gap-2 mb-3 text-dark-300' : 'flex items-center gap-2 mb-3 text-gray-600'}>
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Recent Activity</span>
          </div>
          <div className={isDark ? 'bg-dark-800/30 rounded-lg p-3 flex-1' : 'bg-gray-50 rounded-lg p-3 flex-1'}>
            <div className="space-y-2">
              {recentEvents.length > 0 ? recentEvents.map((event, i) => (
                <div key={i} className={isDark ? 'flex items-center gap-3 p-2 bg-dark-800/50 rounded-lg' : 'flex items-center gap-3 p-2 bg-white rounded-lg'}>
                  <div className={event.type === 'claim' ? 'w-2 h-2 rounded-full bg-netrum-400' : event.type === 'sync' ? 'w-2 h-2 rounded-full bg-emerald-400' : 'w-2 h-2 rounded-full bg-blue-400'} />
                  <div className="flex-1">
                    <p className={isDark ? 'text-sm text-white' : 'text-sm text-gray-900'}>{event.label}</p>
                    <p className={isDark ? 'text-xs text-dark-400' : 'text-xs text-gray-500'}>{formatDateTimeDMY(event.time)}</p>
                  </div>
                </div>
              )) : (
                <p className={isDark ? 'text-sm text-dark-400 text-center py-4' : 'text-sm text-gray-500 text-center py-4'}>No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformanceChart;
