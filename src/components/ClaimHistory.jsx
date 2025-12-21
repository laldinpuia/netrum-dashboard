import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Coins, History, Download, ExternalLink } from 'lucide-react';
import { exportToCSV, exportToJSON } from '../api/netrum';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function ClaimHistory({ claimStatus, claimHistory }) {
  const claims = claimHistory?.claims || claimHistory?.history || [];
  
  const chartData = useMemo(() => {
    if (!claims.length) return null;
    
    const sortedClaims = [...claims].sort((a, b) => 
      new Date(a.timestamp || a.created_at) - new Date(b.timestamp || b.created_at)
    );
    
    return {
      labels: sortedClaims.map(c => 
        new Date(c.timestamp || c.created_at).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      ),
      datasets: [
        {
          label: 'NPT Claimed',
          data: sortedClaims.map(c => parseFloat(c.amount || c.value || 0)),
          borderColor: 'rgb(249, 115, 22)',
          backgroundColor: 'rgba(249, 115, 22, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgb(249, 115, 22)',
          pointBorderColor: 'rgb(249, 115, 22)',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(249, 115, 22)',
          pointRadius: 4,
          pointHoverRadius: 6,
        }
      ]
    };
  }, [claims]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(249, 115, 22, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: (context) => `${context.parsed.y.toFixed(4)} NPT`
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#64748b',
          font: { size: 11 }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#64748b',
          font: { size: 11 },
          callback: (value) => `${value} NPT`
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  const handleExport = (format) => {
    if (!claims.length) return;
    
    const exportData = claims.map(c => ({
      date: c.timestamp || c.created_at,
      amount: c.amount || c.value,
      txHash: c.tx_hash || c.txHash,
      block: c.block_number || c.block
    }));

    if (format === 'csv') {
      exportToCSV(exportData, 'netrum-claim-history');
    } else {
      exportToJSON(exportData, 'netrum-claim-history');
    }
  };

  return (
    <div className="card card-hover">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-netrum-500/10 border border-netrum-500/30">
            <History className="w-5 h-5 text-netrum-400" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-white">Claim History</h3>
            <p className="text-sm text-dark-400">{claims.length} claims recorded</p>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('csv')}
            className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
            title="Export CSV"
          >
            <Download className="w-4 h-4 text-dark-400 hover:text-netrum-400" />
          </button>
        </div>
      </div>

      {/* Claim Status Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-dark-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-dark-400 mb-2">
            <Coins className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Pending</span>
          </div>
          <p className="text-xl font-display font-bold text-netrum-400">
            {parseFloat(claimStatus?.pending || claimStatus?.claimable || 0).toFixed(4)}
          </p>
          <p className="text-xs text-dark-400 mt-1">NPT available</p>
        </div>

        <div className="bg-dark-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-dark-400 mb-2">
            <History className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Total Claimed</span>
          </div>
          <p className="text-xl font-display font-bold text-white">
            {parseFloat(claimStatus?.total_claimed || claimStatus?.totalClaimed || 0).toFixed(2)}
          </p>
          <p className="text-xs text-dark-400 mt-1">NPT lifetime</p>
        </div>
      </div>

      {/* Chart */}
      {chartData ? (
        <div className="h-48 mb-4">
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center bg-dark-800/30 rounded-xl mb-4">
          <p className="text-dark-400 text-sm">No claim history available</p>
        </div>
      )}

      {/* Recent Claims List */}
      {claims.length > 0 && (
        <div className="border-t border-dark-800 pt-4">
          <h4 className="text-sm font-medium text-dark-300 mb-3">Recent Claims</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {claims.slice(0, 5).map((claim, index) => (
              <div 
                key={index}
                className="flex items-center justify-between py-2 px-3 bg-dark-800/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-netrum-500/10 flex items-center justify-center">
                    <Coins className="w-4 h-4 text-netrum-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      +{parseFloat(claim.amount || claim.value || 0).toFixed(4)} NPT
                    </p>
                    <p className="text-xs text-dark-400">
                      {new Date(claim.timestamp || claim.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {(claim.tx_hash || claim.txHash) && (
                  <a
                    href={`https://basescan.org/tx/${claim.tx_hash || claim.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 hover:bg-dark-700 rounded transition-colors"
                    title="View on BaseScan"
                  >
                    <ExternalLink className="w-4 h-4 text-dark-400 hover:text-netrum-400" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ClaimHistory;
