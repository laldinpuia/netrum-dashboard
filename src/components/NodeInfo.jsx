import React from 'react';
import { Server, Hash, Wallet, Calendar, CheckCircle, XCircle, Copy, ExternalLink, Coins, Users, ArrowRightLeft, Zap, Activity } from 'lucide-react';
import { useTheme } from '../App';
import { formatDateDMY } from '../api/netrum';

function NodeInfo({ nodeInfo, tokenOverview }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const node = nodeInfo && nodeInfo.node ? nodeInfo.node : {};
  const overview = tokenOverview || {};

  const isActive = node.nodeStatus === 'Active';

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const truncateAddress = (address) => {
    if (!address) return '--';
    return address.slice(0, 6) + '...' + address.slice(-4);
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toLocaleString();
  };

  return (
    <div className={isDark ? 'card card-hover h-full' : 'card card-hover bg-white border-gray-200 h-full'}>
      <div className="flex items-center justify-between mb-4">
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

      <div className="space-y-2">
        <div className={isDark ? 'flex items-center justify-between py-2 border-b border-dark-800' : 'flex items-center justify-between py-2 border-b border-gray-100'}>
          <div className="flex items-center gap-2">
            <Hash className={isDark ? 'w-4 h-4 text-dark-400' : 'w-4 h-4 text-gray-400'} />
            <span className={isDark ? 'text-sm text-dark-400' : 'text-sm text-gray-500'}>Node ID</span>
          </div>
          <div className="flex items-center gap-1">
            <span className={isDark ? 'text-sm font-mono text-white' : 'text-sm font-mono text-gray-900'}>{node.nodeId || '--'}</span>
            {node.nodeId && (
              <button onClick={() => copyToClipboard(node.nodeId)} className={isDark ? 'p-1 hover:bg-dark-700 rounded' : 'p-1 hover:bg-gray-100 rounded'}>
                <Copy className="w-3 h-3 text-dark-400" />
              </button>
            )}
          </div>
        </div>

        <div className={isDark ? 'flex items-center justify-between py-2 border-b border-dark-800' : 'flex items-center justify-between py-2 border-b border-gray-100'}>
          <div className="flex items-center gap-2">
            <Wallet className={isDark ? 'w-4 h-4 text-dark-400' : 'w-4 h-4 text-gray-400'} />
            <span className={isDark ? 'text-sm text-dark-400' : 'text-sm text-gray-500'}>Wallet</span>
          </div>
          <div className="flex items-center gap-1">
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

        <div className={isDark ? 'flex items-center justify-between py-2 border-b border-dark-800' : 'flex items-center justify-between py-2 border-b border-gray-100'}>
          <div className="flex items-center gap-2">
            <Calendar className={isDark ? 'w-4 h-4 text-dark-400' : 'w-4 h-4 text-gray-400'} />
            <span className={isDark ? 'text-sm text-dark-400' : 'text-sm text-gray-500'}>Registered</span>
          </div>
          <span className={isDark ? 'text-sm font-mono text-white' : 'text-sm font-mono text-gray-900'}>{formatDateDMY(node.createdAt)}</span>
        </div>

        <div className={isDark ? 'flex items-center justify-between py-2 border-b border-dark-800' : 'flex items-center justify-between py-2 border-b border-gray-100'}>
          <div className="flex items-center gap-2">
            <CheckCircle className={isDark ? 'w-4 h-4 text-dark-400' : 'w-4 h-4 text-gray-400'} />
            <span className={isDark ? 'text-sm text-dark-400' : 'text-sm text-gray-500'}>Status</span>
          </div>
          <span className={isActive ? 'text-sm font-medium text-emerald-400' : 'text-sm font-medium text-red-400'}>{node.nodeStatus || '--'}</span>
        </div>
      </div>

      {/* TTS Power and Total Tasks */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className={isDark ? 'bg-dark-800/50 rounded-xl p-3' : 'bg-gray-50 rounded-xl p-3'}>
          <div className={isDark ? 'flex items-center gap-2 text-dark-400 mb-1' : 'flex items-center gap-2 text-gray-500 mb-1'}>
            <Zap className="w-3 h-3" />
            <span className="text-xs uppercase tracking-wider">TTS Power</span>
          </div>
          <p className={node.ttsPowerStatus === 'available' ? 'text-base font-display font-bold text-emerald-400' : isDark ? 'text-base font-display font-bold text-dark-400' : 'text-base font-display font-bold text-gray-400'}>
            {node.ttsPowerStatus === 'available' ? 'Available' : 'Unavailable'}
          </p>
        </div>
        <div className={isDark ? 'bg-dark-800/50 rounded-xl p-3' : 'bg-gray-50 rounded-xl p-3'}>
          <div className={isDark ? 'flex items-center gap-2 text-dark-400 mb-1' : 'flex items-center gap-2 text-gray-500 mb-1'}>
            <Activity className="w-3 h-3" />
            <span className="text-xs uppercase tracking-wider">Total Tasks</span>
          </div>
          <p className="text-base font-display font-bold text-netrum-400">{node.taskCount ? node.taskCount.toLocaleString() : '0'}</p>
        </div>
      </div>

      {/* NPT Token Overview */}
      <div className={isDark ? 'mt-4 pt-4 border-t border-dark-800' : 'mt-4 pt-4 border-t border-gray-200'}>
        <div className="flex items-center gap-2 mb-3">
          <Coins className="w-4 h-4 text-netrum-400" />
          <span className={isDark ? 'text-sm font-medium text-dark-300' : 'text-sm font-medium text-gray-600'}>NPT Token Overview</span>
          <a href="https://basescan.org/token/0xb8c2ce84f831175136cebbfd48ce4bab9c7a6424" target="_blank" rel="noopener noreferrer" className="ml-auto">
            <ExternalLink className="w-3 h-3 text-dark-400 hover:text-netrum-400" />
          </a>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className={isDark ? 'bg-dark-800/50 rounded-lg p-2 text-center' : 'bg-gray-50 rounded-lg p-2 text-center'}>
            <Coins className={isDark ? 'w-3 h-3 mx-auto mb-1 text-dark-500' : 'w-3 h-3 mx-auto mb-1 text-gray-400'} />
            <p className={isDark ? 'text-xs text-dark-500 mb-0.5' : 'text-xs text-gray-400 mb-0.5'}>Max Supply</p>
            <p className={isDark ? 'text-sm font-mono text-white' : 'text-sm font-mono text-gray-900'}>{formatNumber(overview.maxSupply)}</p>
          </div>
          <div className={isDark ? 'bg-dark-800/50 rounded-lg p-2 text-center' : 'bg-gray-50 rounded-lg p-2 text-center'}>
            <Users className={isDark ? 'w-3 h-3 mx-auto mb-1 text-dark-500' : 'w-3 h-3 mx-auto mb-1 text-gray-400'} />
            <p className={isDark ? 'text-xs text-dark-500 mb-0.5' : 'text-xs text-gray-400 mb-0.5'}>Holders</p>
            <p className={isDark ? 'text-sm font-mono text-white' : 'text-sm font-mono text-gray-900'}>{formatNumber(overview.holders)}</p>
          </div>
          <div className={isDark ? 'bg-dark-800/50 rounded-lg p-2 text-center' : 'bg-gray-50 rounded-lg p-2 text-center'}>
            <ArrowRightLeft className={isDark ? 'w-3 h-3 mx-auto mb-1 text-dark-500' : 'w-3 h-3 mx-auto mb-1 text-gray-400'} />
            <p className={isDark ? 'text-xs text-dark-500 mb-0.5' : 'text-xs text-gray-400 mb-0.5'}>Transfers</p>
            <p className={isDark ? 'text-sm font-mono text-white' : 'text-sm font-mono text-gray-900'}>{formatNumber(overview.transfers)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NodeInfo;
