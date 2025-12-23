import React, { useState } from 'react';
import { History, Download, FileJson, FileSpreadsheet, FileText, ChevronDown, Coins, Calendar } from 'lucide-react';
import { useTheme } from '../App';
import { exportToCSV, exportToJSON, exportToPDF, formatDateDMY, formatDateTimeDMY, formatTimestampDMY, fetchEthPrice } from '../api/netrum';

function ClaimHistory(props) {
  var claimHistory = props.claimHistory;
  var nodeInfo = props.nodeInfo;
  var miningStatus = props.miningStatus;
  var tokenData = props.tokenData;
  var theme = useTheme().theme;
  var isDark = theme === 'dark';
  var [showExportMenu, setShowExportMenu] = useState(false);
  
  var history = claimHistory || {};
  var node = nodeInfo && nodeInfo.node ? nodeInfo.node : {};
  var totalClaims = tokenData && tokenData.totalClaims ? tokenData.totalClaims : (history.totalClaims || 0);
  var lastClaim = history.lastClaim || {};
  var recentClaims = tokenData && tokenData.recentClaims ? tokenData.recentClaims : [];

  var handleExport = async function(format) {
    var ethPrice = await fetchEthPrice();
    var exportData = {
      nodeId: node.nodeId || lastClaim.nodeId || history.nodeAddress,
      totalClaims: totalClaims,
      totalNptClaimed: tokenData ? tokenData.totalNptClaimed : 0,
      lastClaim: lastClaim,
      nodeInfo: {
        wallet: node.wallet,
        status: node.nodeStatus,
        taskCount: node.taskCount,
        syncCount: node.syncCount,
        createdAt: node.createdAt
      },
      exportedAt: new Date().toISOString()
    };

    if (format === 'csv') {
      var csvData = recentClaims.length > 0 ? recentClaims.map(function(tx) {
        return {
          date: formatTimestampDMY(tx.timeStamp),
          amount: (parseFloat(tx.value) / 1e18).toFixed(4) + ' NPT',
          txHash: tx.hash,
          block: tx.blockNumber
        };
      }) : [{
        nodeId: exportData.nodeId,
        totalClaims: exportData.totalClaims,
        totalNptClaimed: exportData.totalNptClaimed,
        lastClaimDate: formatDateTimeDMY(lastClaim.timestamp),
        lastClaimNodeId: lastClaim.nodeId
      }];
      exportToCSV(csvData, 'netrum-claim-history');
    } else if (format === 'json') {
      exportToJSON(exportData, 'netrum-claim-history');
    } else if (format === 'pdf') {
      exportToPDF(exportData, node, miningStatus, ethPrice, 'netrum-node-report');
    }
    
    setShowExportMenu(false);
  };

  var latestClaim = recentClaims.length > 0 ? recentClaims[0] : null;

  return React.createElement('div', { className: isDark ? 'card card-hover' : 'card card-hover bg-white border-gray-200' },
    React.createElement('div', { className: 'flex items-center justify-between mb-6' },
      React.createElement('div', { className: 'flex items-center gap-3' },
        React.createElement('div', { className: 'p-3 rounded-xl bg-netrum-500/10 border border-netrum-500/30' },
          React.createElement(History, { className: 'w-5 h-5 text-netrum-400' })
        ),
        React.createElement('div', null,
          React.createElement('h3', { className: isDark ? 'font-display font-semibold text-white' : 'font-display font-semibold text-gray-900' }, 'Claim History'),
          React.createElement('p', { className: isDark ? 'text-sm text-dark-400' : 'text-sm text-gray-500' }, totalClaims + ' claims recorded')
        )
      ),
      React.createElement('div', { className: 'relative' },
        React.createElement('button', { onClick: function() { setShowExportMenu(!showExportMenu); }, className: isDark ? 'flex items-center gap-2 px-3 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg transition-colors text-sm text-white' : 'flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm text-gray-700' },
          React.createElement(Download, { className: 'w-4 h-4' }),
          'Export',
          React.createElement(ChevronDown, { className: 'w-3 h-3' })
        ),
        showExportMenu && React.createElement('div', { className: isDark ? 'absolute right-0 mt-2 w-48 bg-dark-800 border-dark-700 border rounded-lg shadow-xl z-10' : 'absolute right-0 mt-2 w-48 bg-white border-gray-200 border rounded-lg shadow-xl z-10' },
          React.createElement('button', { onClick: function() { handleExport('csv'); }, className: isDark ? 'w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-700 transition-colors text-left' : 'w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left' },
            React.createElement(FileSpreadsheet, { className: 'w-4 h-4 text-emerald-400' }),
            React.createElement('span', { className: isDark ? 'text-sm text-dark-200' : 'text-sm text-gray-700' }, 'Export CSV')
          ),
          React.createElement('button', { onClick: function() { handleExport('json'); }, className: isDark ? 'w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-700 transition-colors text-left' : 'w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left' },
            React.createElement(FileJson, { className: 'w-4 h-4 text-blue-400' }),
            React.createElement('span', { className: isDark ? 'text-sm text-dark-200' : 'text-sm text-gray-700' }, 'Export JSON')
          ),
          React.createElement('button', { onClick: function() { handleExport('pdf'); }, className: isDark ? 'w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-700 transition-colors text-left' : 'w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left' },
            React.createElement(FileText, { className: 'w-4 h-4 text-red-400' }),
            React.createElement('span', { className: isDark ? 'text-sm text-dark-200' : 'text-sm text-gray-700' }, 'Export PDF')
          )
        )
      )
    ),

    React.createElement('div', { className: 'grid grid-cols-2 gap-4 mb-6' },
      React.createElement('div', { className: isDark ? 'bg-dark-800/50 rounded-xl p-4' : 'bg-gray-50 rounded-xl p-4' },
        React.createElement('div', { className: isDark ? 'flex items-center gap-2 text-dark-400 mb-2' : 'flex items-center gap-2 text-gray-500 mb-2' },
          React.createElement(Coins, { className: 'w-4 h-4' }),
          React.createElement('span', { className: 'text-xs uppercase tracking-wider' }, 'Total Claims')
        ),
        React.createElement('p', { className: 'text-2xl font-display font-bold text-netrum-400' }, totalClaims)
      ),
      React.createElement('div', { className: isDark ? 'bg-dark-800/50 rounded-xl p-4' : 'bg-gray-50 rounded-xl p-4' },
        React.createElement('div', { className: isDark ? 'flex items-center gap-2 text-dark-400 mb-2' : 'flex items-center gap-2 text-gray-500 mb-2' },
          React.createElement(Calendar, { className: 'w-4 h-4' }),
          React.createElement('span', { className: 'text-xs uppercase tracking-wider' }, 'Last Claim')
        ),
        React.createElement('p', { className: isDark ? 'text-lg font-display font-bold text-white' : 'text-lg font-display font-bold text-gray-900' },
          latestClaim ? formatTimestampDMY(latestClaim.timeStamp).split(',')[0] : formatDateDMY(lastClaim.timestamp)
        )
      )
    ),

    (latestClaim || lastClaim.timestamp) && React.createElement('div', { className: isDark ? 'bg-dark-800/30 rounded-xl p-4' : 'bg-gray-50 rounded-xl p-4' },
      React.createElement('h4', { className: isDark ? 'text-sm font-medium text-dark-300 mb-3' : 'text-sm font-medium text-gray-600 mb-3' }, 'Last Claim Details'),
      React.createElement('div', { className: 'space-y-2' },
        React.createElement('div', { className: 'flex justify-between' },
          React.createElement('span', { className: isDark ? 'text-sm text-dark-400' : 'text-sm text-gray-500' }, 'Date & Time'),
          React.createElement('span', { className: isDark ? 'text-sm font-mono text-white' : 'text-sm font-mono text-gray-900' },
            latestClaim ? formatTimestampDMY(latestClaim.timeStamp) : formatDateTimeDMY(lastClaim.timestamp)
          )
        ),
        React.createElement('div', { className: 'flex justify-between' },
          React.createElement('span', { className: isDark ? 'text-sm text-dark-400' : 'text-sm text-gray-500' }, 'Node ID'),
          React.createElement('span', { className: isDark ? 'text-sm font-mono text-white' : 'text-sm font-mono text-gray-900' },
            lastClaim.nodeId || node.nodeId || '--'
          )
        ),
        latestClaim && React.createElement('div', { className: 'flex justify-between' },
          React.createElement('span', { className: isDark ? 'text-sm text-dark-400' : 'text-sm text-gray-500' }, 'Amount'),
          React.createElement('span', { className: 'text-sm font-mono text-netrum-400' },
            (parseFloat(latestClaim.value) / 1e18).toFixed(4) + ' NPT'
          )
        ),
        lastClaim.taskCountAtTime && React.createElement('div', { className: 'flex justify-between' },
          React.createElement('span', { className: isDark ? 'text-sm text-dark-400' : 'text-sm text-gray-500' }, 'Tasks at Claim'),
          React.createElement('span', { className: isDark ? 'text-sm font-mono text-white' : 'text-sm font-mono text-gray-900' },
            lastClaim.taskCountAtTime.toLocaleString()
          )
        )
      )
    ),

    !latestClaim && !lastClaim.timestamp && React.createElement('div', { className: isDark ? 'text-center py-8 text-dark-400' : 'text-center py-8 text-gray-500' },
      React.createElement(History, { className: 'w-12 h-12 mx-auto mb-3 opacity-30' }),
      React.createElement('p', null, 'No claim history available')
    )
  );
}

export default ClaimHistory;
