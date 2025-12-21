import React from 'react';
import { Server, Hash, Wallet, Calendar, CheckCircle, XCircle, Copy, ExternalLink } from 'lucide-react';

function NodeInfo({ nodeInfo, metricsStatus }) {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const truncateAddress = (address) => {
    if (!address) return '--';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isOnline = nodeInfo?.status === 'active' || nodeInfo?.is_active || metricsStatus?.status === 'online';

  return (
    <div className="card card-hover">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-netrum-500/10 border border-netrum-500/30">
            <Server className="w-5 h-5 text-netrum-400" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-white">Node Information</h3>
            <p className="text-sm text-dark-400">Basic node details</p>
          </div>
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
          isOnline 
            ? 'bg-emerald-500/10 border border-emerald-500/30' 
            : 'bg-red-500/10 border border-red-500/30'
        }`}>
          {isOnline ? (
            <>
              <div className="w-2 h-2 bg-emerald-400 rounded-full live-indicator" />
              <span className="text-xs font-medium text-emerald-400">Online</span>
            </>
          ) : (
            <>
              <XCircle className="w-3 h-3 text-red-400" />
              <span className="text-xs font-medium text-red-400">Offline</span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Node ID */}
        <InfoRow
          icon={Hash}
          label="Node ID"
          value={nodeInfo?.node_id || nodeInfo?.id || '--'}
          copyable
          onCopy={copyToClipboard}
          mono
        />

        {/* Wallet Address */}
        <InfoRow
          icon={Wallet}
          label="Wallet Address"
          value={nodeInfo?.wallet || nodeInfo?.owner || '--'}
          displayValue={truncateAddress(nodeInfo?.wallet || nodeInfo?.owner)}
          copyable
          onCopy={copyToClipboard}
          mono
          link={nodeInfo?.wallet ? `https://basescan.org/address/${nodeInfo.wallet}` : null}
        />

        {/* Registration Date */}
        <InfoRow
          icon={Calendar}
          label="Registered"
          value={nodeInfo?.created_at || nodeInfo?.registered_at ? 
            new Date(nodeInfo.created_at || nodeInfo.registered_at).toLocaleDateString() : 
            '--'
          }
        />

        {/* Verification Status */}
        <InfoRow
          icon={CheckCircle}
          label="Verified"
          value={nodeInfo?.is_verified ? 'Yes' : 'No'}
          highlight={nodeInfo?.is_verified}
        />
      </div>

      {/* Metrics Status */}
      {metricsStatus && (
        <div className="mt-6 pt-6 border-t border-dark-800">
          <h4 className="text-sm font-medium text-dark-300 mb-4">System Metrics</h4>
          <div className="grid grid-cols-2 gap-4">
            <MetricItem 
              label="CPU Usage" 
              value={metricsStatus.cpu_usage ? `${metricsStatus.cpu_usage}%` : '--'} 
            />
            <MetricItem 
              label="Memory" 
              value={metricsStatus.memory_usage ? `${metricsStatus.memory_usage}%` : '--'} 
            />
            <MetricItem 
              label="Disk" 
              value={metricsStatus.disk_usage ? `${metricsStatus.disk_usage}%` : '--'} 
            />
            <MetricItem 
              label="Block Height" 
              value={metricsStatus.block_height || '--'} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, displayValue, copyable, onCopy, mono, link, highlight }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-dark-800/50 last:border-0">
      <div className="flex items-center gap-2 text-dark-400">
        <Icon className="w-4 h-4" />
        <span className="text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-sm ${mono ? 'font-mono' : ''} ${highlight ? 'text-emerald-400' : 'text-white'}`}>
          {displayValue || value}
        </span>
        {copyable && value && value !== '--' && (
          <button
            onClick={() => onCopy(value)}
            className="p-1 hover:bg-dark-700 rounded transition-colors"
            title="Copy to clipboard"
          >
            <Copy className="w-3 h-3 text-dark-400 hover:text-netrum-400" />
          </button>
        )}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 hover:bg-dark-700 rounded transition-colors"
            title="View on BaseScan"
          >
            <ExternalLink className="w-3 h-3 text-dark-400 hover:text-netrum-400" />
          </a>
        )}
      </div>
    </div>
  );
}

function MetricItem({ label, value }) {
  return (
    <div className="bg-dark-800/50 rounded-lg p-3">
      <p className="text-xs text-dark-400 mb-1">{label}</p>
      <p className="text-sm font-mono font-medium text-white">{value}</p>
    </div>
  );
}

export default NodeInfo;
