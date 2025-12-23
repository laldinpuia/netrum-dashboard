import React from 'react';
import { Server, Hash, Wallet, Calendar, CheckCircle, XCircle, Cpu, MemoryStick, HardDrive, Download, Upload, Zap, Copy, ExternalLink } from 'lucide-react';
import { useTheme } from '../App';
import { formatDateDMY } from '../api/netrum';

function NodeInfo({ nodeInfo }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const node = nodeInfo && nodeInfo.node ? nodeInfo.node : {};
  const metrics = node.nodeMetrics || {};

  const isActive = node.nodeStatus === 'Active';

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const truncateAddress = (address) => {
    if (!address) return '--';
    return address.slice(0, 6) + '...' + address.slice(-4);
  };

  return (
    <div className={isDark ? 'card card-hover' : 'card card-hover bg-white border-gray-200'}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={isActive ? 'p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30' : isDark ? 'p-3 rounded-xl bg-dark-700 border border-dark-600' : 'p-3 rounded-xl bg-gray-100 border border-gray-200'}>
            <Server className={isActive ? 'w-5 h-5 text-emerald-400' : isDark ? 'w-5 h-5 text-dark-400' : 'w-5 h-5 text-gray-400'} />
          </div>
          <div>
            <h3 className={isDark ? 'font-display font-semibold text-white' : 'font-display font-semibold text-gray-900'}>Node Information</h3>
            <p className={isDark ? 'text-sm text-dark-400' : 'text-sm text-gray-500'}>Basic node details</p>
          </div>
        </div>
        <div className={isActive ? 'flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full' : 'flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full'}>
          {isActive ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <XCircle className="w-3 h-3 text-red-400" />}
          <span className={isActive ? 'text-xs font-medium text-emerald-400' : 'text-xs font-medium text-red-400'}>{isActive ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className={isDark ? 'flex items-center justify-between py-3 border-b border-dark-800' : 'flex items-center justify-between py-3 border-b border-gray-100'}>
          <div className="flex items-center gap-3">
            <Hash className={isDark ? 'w-4 h-4 text-dark-400' : 'w-4 h-4 text-gray-400'} />
            <span className={isDark ? 'text-sm text-dark-400' : 'text-sm text-gray-500'}>Node ID</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={isDark ? 'text-sm font-mono text-white' : 'text-sm font-mono text-gray-900'}>{node.nodeId || '--'}</span>
            {node.nodeId && (
              <button onClick={() => copyToClipboard(node.nodeId)} className={isDark ? 'p-1 hover:bg-dark-700 rounded' : 'p-1 hover:bg-gray-100 rounded'}>
                <Copy className="w-3 h-3 text-dark-400" />
              </button>
            )}
          </div>
        </div>

        <div className={isDark ? 'flex items-center justify-between py-3 border-b border-dark-800' : 'flex items-center justify-between py-3 border-b border-gray-100'}>
          <div className="flex items-center gap-3">
            <Wallet className={isDark ? 'w-4 h-4 text-dark-400' : 'w-4 h-4 text-gray-400'} />
            <span className={isDark ? 'text-sm text-dark-400' : 'text-sm text-gray-500'}>Wallet Address</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={isDark ? 'text-sm font-mono text-white' : 'text-sm font-mono text-gray-900'}>{truncateAddress(node.wallet)}</span>
            {node.wallet && (
              <>
                <button onClick={() => copyToClipboard(node.wallet)} className={isDark ? 'p-1 hover:bg-dark-700 rounded' : 'p-1 hover:bg-gray-100 rounded'}>
                  <Copy className="w-3 h-3 text-dark-400" />
                </button>
                <a href={'https://basescan.org/address/' + node.wallet} target="_blank" rel="noopener noreferrer" className={isDark ? 'p-1 hover:bg-dark-700 rounded' : 'p-1 hover:bg-gray-100 rounded'}>
                  <ExternalLink className="w-3 h-3 text-dark-400" />
                </a>
              </>
            )}
          </div>
        </div>

        <div className={isDark ? 'flex items-center justify-between py-3 border-b border-dark-800' : 'flex items-center justify-between py-3 border-b border-gray-100'}>
          <div className="flex items-center gap-3">
            <Calendar className={isDark ? 'w-4 h-4 text-dark-400' : 'w-4 h-4 text-gray-400'} />
            <span className={isDark ? 'text-sm text-dark-400' : 'text-sm text-gray-500'}>Registered</span>
          </div>
          <span className={isDark ? 'text-sm font-mono text-white' : 'text-sm font-mono text-gray-900'}>{formatDateDMY(node.createdAt)}</span>
        </div>

        <div className={isDark ? 'flex items-center justify-between py-3 border-b border-dark-800' : 'flex items-center justify-between py-3 border-b border-gray-100'}>
          <div className="flex items-center gap-3">
            <CheckCircle className={isDark ? 'w-4 h-4 text-dark-400' : 'w-4 h-4 text-gray-400'} />
            <span className={isDark ? 'text-sm text-dark-400' : 'text-sm text-gray-500'}>Status</span>
          </div>
          <span className={isActive ? 'text-sm font-medium text-emerald-400' : 'text-sm font-medium text-red-400'}>{node.nodeStatus || '--'}</span>
        </div>
      </div>

      <div className={isDark ? 'mt-6 pt-4 border-t border-dark-800' : 'mt-6 pt-4 border-t border-gray-200'}>
        <h4 className={isDark ? 'text-sm font-medium text-dark-300 mb-4' : 'text-sm font-medium text-gray-600 mb-4'}>System Metrics</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className={isDark ? 'bg-dark-800/50 rounded-lg p-3' : 'bg-gray-50 rounded-lg p-3'}>
            <div className={isDark ? 'flex items-center gap-2 text-dark-400 mb-1' : 'flex items-center gap-2 text-gray-500 mb-1'}>
              <Cpu className="w-3 h-3" />
              <span className="text-xs">CPU Cores</span>
            </div>
            <p className={isDark ? 'text-lg font-semibold text-white' : 'text-lg font-semibold text-gray-900'}>{metrics.cpu || '--'}</p>
          </div>
          <div className={isDark ? 'bg-dark-800/50 rounded-lg p-3' : 'bg-gray-50 rounded-lg p-3'}>
            <div className={isDark ? 'flex items-center gap-2 text-dark-400 mb-1' : 'flex items-center gap-2 text-gray-500 mb-1'}>
              <MemoryStick className="w-3 h-3" />
              <span className="text-xs">RAM</span>
            </div>
            <p className={isDark ? 'text-lg font-semibold text-white' : 'text-lg font-semibold text-gray-900'}>{metrics.ram ? (metrics.ram / 1024).toFixed(1) + ' GB' : '--'}</p>
          </div>
          <div className={isDark ? 'bg-dark-800/50 rounded-lg p-3' : 'bg-gray-50 rounded-lg p-3'}>
            <div className={isDark ? 'flex items-center gap-2 text-dark-400 mb-1' : 'flex items-center gap-2 text-gray-500 mb-1'}>
              <HardDrive className="w-3 h-3" />
              <span className="text-xs">Disk</span>
            </div>
            <p className={isDark ? 'text-lg font-semibold text-white' : 'text-lg font-semibold text-gray-900'}>{metrics.disk ? metrics.disk + ' GB' : '--'}</p>
          </div>
          <div className={isDark ? 'bg-dark-800/50 rounded-lg p-3' : 'bg-gray-50 rounded-lg p-3'}>
            <div className={isDark ? 'flex items-center gap-2 text-dark-400 mb-1' : 'flex items-center gap-2 text-gray-500 mb-1'}>
              <Zap className="w-3 h-3" />
              <span className="text-xs">TTS Power</span>
            </div>
            <p className={node.ttsPowerStatus === 'available' ? 'text-lg font-semibold text-emerald-400' : isDark ? 'text-lg font-semibold text-dark-400' : 'text-lg font-semibold text-gray-400'}>
              {node.ttsPowerStatus === 'available' ? 'Available' : 'Unavailable'}
            </p>
          </div>
          <div className={isDark ? 'bg-dark-800/50 rounded-lg p-3' : 'bg-gray-50 rounded-lg p-3'}>
            <div className={isDark ? 'flex items-center gap-2 text-dark-400 mb-1' : 'flex items-center gap-2 text-gray-500 mb-1'}>
              <Download className="w-3 h-3" />
              <span className="text-xs">Download</span>
            </div>
            <p className={isDark ? 'text-lg font-semibold text-white' : 'text-lg font-semibold text-gray-900'}>{metrics.speed ? metrics.speed.toFixed(0) + ' Mbps' : '--'}</p>
          </div>
          <div className={isDark ? 'bg-dark-800/50 rounded-lg p-3' : 'bg-gray-50 rounded-lg p-3'}>
            <div className={isDark ? 'flex items-center gap-2 text-dark-400 mb-1' : 'flex items-center gap-2 text-gray-500 mb-1'}>
              <Upload className="w-3 h-3" />
              <span className="text-xs">Upload</span>
            </div>
            <p className={isDark ? 'text-lg font-semibold text-white' : 'text-lg font-semibold text-gray-900'}>{metrics.uploadSpeed ? metrics.uploadSpeed.toFixed(0) + ' Mbps' : '--'}</p>
          </div>
        </div>
      </div>

      <div className={isDark ? 'mt-4 p-3 bg-netrum-500/10 border border-netrum-500/30 rounded-lg' : 'mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg'}>
        <div className="flex items-center justify-between">
          <span className={isDark ? 'text-sm text-dark-300' : 'text-sm text-gray-600'}>Total Tasks Completed</span>
          <span className="text-lg font-display font-bold text-netrum-400">{node.taskCount ? node.taskCount.toLocaleString() : '0'}</span>
        </div>
      </div>
    </div>
  );
}

export default NodeInfo;
