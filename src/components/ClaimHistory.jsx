import React, { useState, useMemo } from 'react';
import { History, Download, ChevronDown, ChevronLeft, ChevronRight, BarChart3, Loader } from 'lucide-react';
import { useTheme } from '../App';
import { formatDateDMY, formatTimeOnly, exportToPDF } from '../api/netrum';

function ClaimHistory({ claimHistory, tokenData, nodeInfo, miningStatus, miningDebug, loading }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showExport, setShowExport] = useState(false);
  const [chartView, setChartView] = useState('7days');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const claims = tokenData && tokenData.recentClaims ? tokenData.recentClaims : [];
  const totalClaims = tokenData && tokenData.totalClaims ? tokenData.totalClaims : 0;
  const totalNpt = tokenData && tokenData.totalNptClaimed ? tokenData.totalNptClaimed : 0;

  const processedClaims = useMemo(() => {
    return claims.map(claim => ({
      date: new Date(parseInt(claim.timeStamp) * 1000),
      amount: parseFloat(claim.value) / 1e18,
      hash: claim.hash
    })).sort((a, b) => b.date - a.date);
  }, [claims]);

  const totalPages = Math.ceil(processedClaims.length / itemsPerPage);
  const paginatedClaims = processedClaims.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const chartData = useMemo(() => {
    const sortedClaims = [...processedClaims].sort((a, b) => a.date - b.date);
    
    if (chartView === '7days') {
      const labels = [];
      const values = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        
        const label = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        const dayTotal = sortedClaims
          .filter(c => c.date >= date && c.date < nextDate)
          .reduce((sum, c) => sum + c.amount, 0);
        
        labels.push(label);
        values.push(dayTotal);
      }
      return { labels, values };
    } else if (chartView === 'monthly') {
      const labels = [];
      const values = [];
      const currentYear = new Date().getFullYear();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      for (let i = 0; i < 12; i++) {
        const monthStart = new Date(currentYear, i, 1);
        const monthEnd = new Date(currentYear, i + 1, 1);
        
        const monthTotal = sortedClaims
          .filter(c => c.date >= monthStart && c.date < monthEnd)
          .reduce((sum, c) => sum + c.amount, 0);
        
        labels.push(monthNames[i]);
        values.push(monthTotal);
      }
      return { labels, values };
    } else {
      const labels = [];
      const values = [];
      const currentYear = new Date().getFullYear();
      for (let i = 6; i >= 0; i--) {
        const year = currentYear - i;
        const yearStart = new Date(year, 0, 1);
        const yearEnd = new Date(year + 1, 0, 1);
        
        const yearTotal = sortedClaims
          .filter(c => c.date >= yearStart && c.date < yearEnd)
          .reduce((sum, c) => sum + c.amount, 0);
        
        labels.push(year.toString());
        values.push(yearTotal);
      }
      return { labels, values };
    }
  }, [processedClaims, chartView]);

  const maxValue = Math.max(...chartData.values, 0.1);

  const getDateRangeLabel = () => {
    if (chartView === '7days') return 'Last 7 Days';
    if (chartView === 'monthly') return 'Monthly ' + new Date().getFullYear();
    return 'Yearly';
  };

  const handleExport = async (format) => {
    setShowExport(false);
    if (format === 'pdf') {
      await exportToPDF({ nodeInfo, miningStatus, claimHistory, tokenData, miningDebug, chartData, dateRange: getDateRangeLabel() });
    } else if (format === 'csv') {
      const csv = ['Date,Time,Amount (NPT),Transaction Hash'];
      processedClaims.forEach(c => {
        csv.push(`${formatDateDMY(c.date)},${formatTimeOnly(c.date)},${c.amount.toFixed(8)},${c.hash}`);
      });
      downloadFile(csv.join('\n'), `netrum-claims-${getDateRangeLabel().replace(/\s/g, '-')}.csv`, 'text/csv');
    } else if (format === 'json') {
      downloadFile(JSON.stringify(processedClaims, null, 2), `netrum-claims-${getDateRangeLabel().replace(/\s/g, '-')}.json`, 'application/json');
    }
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const barCount = chartData.labels.length;
  const isMonthly = chartView === 'monthly';

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-full min-h-[200px]">
      <div className="flex flex-col items-center gap-3">
        <Loader className="w-8 h-8 animate-spin text-netrum-400" />
        <span className={isDark ? 'text-sm text-dark-400' : 'text-sm text-gray-500'}>Loading claim data...</span>
      </div>
    </div>
  );

  return (
    <div className={isDark ? 'card card-hover' : 'card card-hover bg-white border-gray-200'}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-netrum-500/10 border border-netrum-500/30">
            <History className="w-5 h-5 text-netrum-400" />
          </div>
          <div>
            <h3 className={isDark ? 'font-display font-semibold text-white' : 'font-display font-semibold text-gray-900'}>Claims History</h3>
            <p className={isDark ? 'text-sm text-dark-400' : 'text-sm text-gray-500'}>
              {loading ? 'Loading...' : `${totalClaims} claims recorded`}
            </p>
          </div>
        </div>
        {!loading && totalClaims > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowExport(!showExport)}
              className={isDark ? 'flex items-center gap-2 px-4 py-2 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-lg text-sm' : 'flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg text-sm'}
            >
              <Download className="w-4 h-4" />
              Export
              <ChevronDown className="w-4 h-4" />
            </button>
            {showExport && (
              <div className={isDark ? 'absolute right-0 mt-2 w-40 bg-dark-800 border border-dark-700 rounded-lg shadow-xl z-10' : 'absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-10'}>
                <button onClick={() => handleExport('pdf')} className={isDark ? 'w-full px-4 py-2 text-left text-sm hover:bg-dark-700 rounded-t-lg' : 'w-full px-4 py-2 text-left text-sm hover:bg-gray-100 rounded-t-lg'}>PDF Report</button>
                <button onClick={() => handleExport('csv')} className={isDark ? 'w-full px-4 py-2 text-left text-sm hover:bg-dark-700' : 'w-full px-4 py-2 text-left text-sm hover:bg-gray-100'}>CSV File</button>
                <button onClick={() => handleExport('json')} className={isDark ? 'w-full px-4 py-2 text-left text-sm hover:bg-dark-700 rounded-b-lg' : 'w-full px-4 py-2 text-left text-sm hover:bg-gray-100 rounded-b-lg'}>JSON File</button>
              </div>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Claims Table */}
          <div className={isDark ? 'bg-dark-800/30 rounded-xl p-4 flex flex-col' : 'bg-gray-50 rounded-xl p-4 flex flex-col'}>
            <div className="flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-netrum-400" />
              <span className={isDark ? 'text-sm font-medium text-dark-300' : 'text-sm font-medium text-gray-600'}>Transaction Logs</span>
            </div>
            <div className="flex-1">
              <table className="w-full text-sm">
                <thead className={isDark ? 'text-dark-400 border-b border-dark-700' : 'text-gray-500 border-b border-gray-200'}>
                  <tr>
                    <th className="text-left py-2 w-[40%]">Date & Time</th>
                    <th className="text-right py-2 w-[18%]">Amount</th>
                    <th className="text-right py-2 w-[42%]">Tx Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedClaims.map((claim, i) => (
                    <tr key={i} className={isDark ? 'border-b border-dark-800' : 'border-b border-gray-100'}>
                      <td className={isDark ? 'py-2 text-dark-300' : 'py-2 text-gray-600'}>
                        <div className="text-xs">{formatDateDMY(claim.date)}</div>
                        <div className={isDark ? 'text-[10px] text-dark-500' : 'text-[10px] text-gray-400'}>{formatTimeOnly(claim.date)}</div>
                      </td>
                      <td className="py-2 text-right text-netrum-400 font-mono text-xs">{claim.amount.toFixed(4)}</td>
                      <td className="py-2 text-right">
                        <a href={'https://basescan.org/tx/' + claim.hash} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline font-mono text-[10px]">
                          {claim.hash.slice(0, 12)}...{claim.hash.slice(-10)}
                        </a>
                      </td>
                    </tr>
                  ))}
                  {processedClaims.length === 0 && (
                    <tr>
                      <td colSpan="3" className={isDark ? 'py-6 text-center text-dark-400' : 'py-6 text-center text-gray-500'}>No claims found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-700">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={isDark ? 'p-1 rounded bg-dark-700 hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed' : 'p-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className={isDark ? 'text-xs text-dark-400' : 'text-xs text-gray-500'}>
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={isDark ? 'p-1 rounded bg-dark-700 hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed' : 'p-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Claims Chart */}
          <div className={isDark ? 'bg-dark-800/30 rounded-xl p-4 flex flex-col' : 'bg-gray-50 rounded-xl p-4 flex flex-col'}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-netrum-400" />
                <span className={isDark ? 'text-sm font-medium text-dark-300' : 'text-sm font-medium text-gray-600'}>Claims Analytics</span>
              </div>
              <select
                value={chartView}
                onChange={(e) => setChartView(e.target.value)}
                className={isDark ? 'text-xs bg-dark-700 border border-dark-600 rounded px-2 py-1 text-dark-300' : 'text-xs bg-white border border-gray-200 rounded px-2 py-1 text-gray-600'}
              >
                <option value="7days">7 Days</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div className="flex-1 min-h-[180px] relative">
              {chartData.labels.length > 0 ? (
                <svg className="w-full h-full" viewBox="0 0 400 180" preserveAspectRatio="xMidYMid meet">
                  {/* Y-axis labels */}
                  {[0, 1, 2, 3].map(i => {
                    const value = (maxValue / 3) * (3 - i);
                    return (
                      <g key={i}>
                        <line x1="40" y1={20 + i * 45} x2="390" y2={20 + i * 45} stroke={isDark ? '#1e293b' : '#e5e7eb'} strokeWidth="1" />
                        <text x="35" y={24 + i * 45} textAnchor="end" fill={isDark ? '#64748b' : '#9ca3af'} fontSize="9">
                          {value >= 10 ? value.toFixed(0) : value.toFixed(1)}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Y-axis title */}
                  <text x="8" y="90" textAnchor="middle" fill={isDark ? '#64748b' : '#9ca3af'} fontSize="9" transform="rotate(-90, 8, 90)">
                    NPT
                  </text>
                  
                  {/* Bars */}
                  {chartData.values.map((value, i) => {
                    const barWidth = isMonthly ? 24 : 38;
                    const totalWidth = 340;
                    const gap = (totalWidth - (barWidth * barCount)) / (barCount + 1);
                    const x = 50 + gap + (i * (barWidth + gap));
                    const barHeight = maxValue > 0 ? (value / maxValue) * 130 : 0;
                    return (
                      <g key={i}>
                        <rect
                          x={x}
                          y={155 - barHeight}
                          width={barWidth}
                          height={Math.max(barHeight, 0)}
                          fill={value > 0 ? 'url(#barGradient)' : (isDark ? '#334155' : '#e5e7eb')}
                          rx="2"
                          className="cursor-pointer"
                        >
                          <title>{chartData.labels[i]}: {value.toFixed(4)} NPT</title>
                        </rect>
                        {/* Value on top of bar */}
                        {value > 0 && (
                          <text 
                            x={x + barWidth / 2} 
                            y={155 - barHeight - 3} 
                            textAnchor="middle" 
                            fill="white" 
                            fontSize={isMonthly ? "6" : "7"}
                            fontWeight="bold"
                          >
                            {value >= 10 ? value.toFixed(1) : value.toFixed(2)}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* X-axis labels */}
                  {chartData.labels.map((label, i) => {
                    const barWidth = isMonthly ? 24 : 38;
                    const totalWidth = 340;
                    const gap = (totalWidth - (barWidth * barCount)) / (barCount + 1);
                    const x = 50 + gap + (i * (barWidth + gap)) + barWidth / 2;
                    return (
                      <text key={i} x={x} y="172" textAnchor="middle" fill={isDark ? '#64748b' : '#9ca3af'} fontSize={isMonthly ? "7" : "8"}>
                        {label}
                      </text>
                    );
                  })}

                  <defs>
                    <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#ea580c" />
                    </linearGradient>
                  </defs>
                </svg>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className={isDark ? 'text-dark-400' : 'text-gray-500'}>No data available</p>
                </div>
              )}
            </div>

            <div className={isDark ? 'mt-3 pt-3 border-t border-dark-700 grid grid-cols-2 gap-4' : 'mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 gap-4'}>
              <div className="text-center">
                <p className={isDark ? 'text-xs text-dark-500 mb-1' : 'text-xs text-gray-400 mb-1'}>Total Claimed</p>
                <p className="text-base font-bold text-netrum-400">{totalNpt.toFixed(4)} NPT</p>
              </div>
              <div className="text-center">
                <p className={isDark ? 'text-xs text-dark-500 mb-1' : 'text-xs text-gray-400 mb-1'}>Avg per Claim</p>
                <p className={isDark ? 'text-base font-bold text-white' : 'text-base font-bold text-gray-900'}>{totalClaims > 0 ? (totalNpt / totalClaims).toFixed(4) : '0'} NPT</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClaimHistory;
