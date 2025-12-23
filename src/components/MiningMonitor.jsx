import React, { useState, useEffect } from 'react';
import { Gem, Zap, Clock, TrendingUp, CheckCircle, Coins, Wallet } from 'lucide-react';
import { useTheme } from '../App';
import { fetchEthPrice, formatDateTimeDMY } from '../api/netrum';

function MiningMonitor({ miningDebug, miningStatus, tokenData }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [ethPrice, setEthPrice] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [progress, setProgress] = useState(0);

  useEffect(function() {
    fetchEthPrice().then(setEthPrice);
  }, []);

  var debug = miningDebug || {};
  var contract = debug.contract || {};
  var miningInfo = contract.miningInfo || {};
  var wallet = debug.wallet || {};
  var mining = miningStatus || {};
  var miningStatusInfo = mining.miningStatus || {};

  var isActive = miningInfo.isActive || false;
  var minedTokens = miningInfo.minedTokensFormatted || 0;
  var speedPerSec = miningInfo.speedPerSec ? parseFloat(miningInfo.speedPerSec) / 1e18 : 0;
  var timeRemaining = parseFloat(miningInfo.timeRemaining || 0);
  var percentComplete = miningInfo.percentCompleteNumber ? miningInfo.percentCompleteNumber / 100 : 0;
  var walletBalance = wallet.balanceEth || 0;
  var totalNptClaimed = tokenData && tokenData.totalNptClaimed ? tokenData.totalNptClaimed : 0;

  useEffect(function() {
    if (timeRemaining > 0) {
      var totalSeconds = timeRemaining;
      var interval = setInterval(function() {
        totalSeconds = Math.max(0, totalSeconds - 1);
        var hours = Math.floor(totalSeconds / 3600);
        var minutes = Math.floor((totalSeconds % 3600) / 60);
        var seconds = Math.floor(totalSeconds % 60);
        setTimeLeft({ hours: hours, minutes: minutes, seconds: seconds });
        
        var elapsed = 86400 - totalSeconds;
        setProgress(Math.min(100, (elapsed / 86400) * 100));
      }, 1000);
      return function() { clearInterval(interval); };
    } else {
      setProgress(percentComplete);
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
    }
  }, [timeRemaining, percentComplete]);

  var usdValue = ethPrice ? (walletBalance * ethPrice).toFixed(2) : null;
  var displayProgress = percentComplete >= 100 ? 100 : progress;

  return (
    <div className={isDark ? 'card card-hover' : 'card card-hover bg-white border-gray-200'}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={isActive ? 'p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30' : isDark ? 'p-3 rounded-xl bg-dark-700 border border-dark-600' : 'p-3 rounded-xl bg-gray-100 border border-gray-200'}>
            <Gem className={isActive ? 'w-5 h-5 text-emerald-400' : isDark ? 'w-5 h-5 text-dark-400' : 'w-5 h-5 text-gray-400'} />
          </div>
          <div>
            <h3 className={isDark ? 'font-display font-semibold text-white' : 'font-display font-semibold text-gray-900'}>Mining Monitor</h3>
            <p className={isDark ? 'text-sm text-dark-400' : 'text-sm text-gray-500'}>Real-time mining activity</p>
          </div>
        </div>
        
        <div className={isActive ? 'flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full' : 'flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full'}>
          <div className={isActive ? 'w-2 h-2 bg-emerald-400 rounded-full animate-pulse' : 'w-2 h-2 bg-amber-400 rounded-full'} />
          <span className={isActive ? 'text-xs font-medium text-emerald-400' : 'text-xs font-medium text-amber-400'}>
            {isActive ? 'ACTIVE' : 'INACTIVE'}
          </span>
        </div>
      </div>

      <div className={isDark ? 'bg-dark-800/50 rounded-xl p-4 mb-4' : 'bg-gray-50 rounded-xl p-4 mb-4'}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className={isDark ? 'w-4 h-4 text-dark-400' : 'w-4 h-4 text-gray-500'} />
            <span className={isDark ? 'text-sm text-dark-300' : 'text-sm text-gray-600'}>Mining Progress (24h cycle)</span>
          </div>
          <span className={isDark ? 'text-sm font-mono text-white' : 'text-sm font-mono text-gray-900'}>
            {displayProgress.toFixed(1)}%
          </span>
        </div>
        
        <div className={isDark ? 'h-4 bg-dark-700 rounded-full overflow-hidden mb-2' : 'h-4 bg-gray-200 rounded-full overflow-hidden mb-2'}>
          <div 
            className={displayProgress >= 100 ? 'h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000' : 'h-full bg-gradient-to-r from-netrum-600 to-netrum-400 transition-all duration-1000'}
            style={{ width: displayProgress + '%' }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <span className={isDark ? 'text-xs text-dark-400' : 'text-xs text-gray-500'}>
            {timeRemaining > 0 ? (
              <span className="font-mono">
                ⏱️ {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s remaining
              </span>
            ) : (
              displayProgress >= 100 ? '✅ Ready to claim!' : 'Mining in progress...'
            )}
          </span>
          <span className={isDark ? 'text-xs text-dark-400' : 'text-xs text-gray-500'}>24h</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={isDark ? 'bg-dark-800/50 rounded-xl p-4' : 'bg-gray-50 rounded-xl p-4'}>
          <div className={isDark ? 'flex items-center gap-2 text-dark-400 mb-2' : 'flex items-center gap-2 text-gray-500 mb-2'}>
            <Coins className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Session Mined</span>
          </div>
          <p className="text-xl font-display font-bold text-netrum-400">
            {minedTokens.toFixed(4)}
          </p>
          <p className={isDark ? 'text-xs text-dark-400 mt-1' : 'text-xs text-gray-500 mt-1'}>NPT</p>
        </div>

        <div className={isDark ? 'bg-dark-800/50 rounded-xl p-4' : 'bg-gray-50 rounded-xl p-4'}>
          <div className={isDark ? 'flex items-center gap-2 text-dark-400 mb-2' : 'flex items-center gap-2 text-gray-500 mb-2'}>
            <Zap className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Speed</span>
          </div>
          <p className={isDark ? 'text-xl font-display font-bold text-white' : 'text-xl font-display font-bold text-gray-900'}>
            {speedPerSec.toFixed(8)}
          </p>
          <p className={isDark ? 'text-xs text-dark-400 mt-1' : 'text-xs text-gray-500 mt-1'}>NPT/sec</p>
        </div>
      </div>

      <div className={isDark ? 'bg-netrum-500/10 border border-netrum-500/30 rounded-xl p-4 mb-4' : 'bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4'}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-netrum-400" />
              <span className={isDark ? 'text-xs uppercase tracking-wider text-dark-400' : 'text-xs uppercase tracking-wider text-gray-500'}>Total NPT Claimed</span>
            </div>
            <p className="text-2xl font-display font-bold text-netrum-400">
              {totalNptClaimed.toFixed(4)} <span className="text-sm font-normal">NPT</span>
            </p>
          </div>
          <div className="text-right">
            <p className={isDark ? 'text-xs text-dark-400' : 'text-xs text-gray-500'}>From {tokenData && tokenData.totalClaims ? tokenData.totalClaims : 0} claims</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className={isDark ? 'bg-dark-800/50 rounded-xl p-4' : 'bg-gray-50 rounded-xl p-4'}>
          <div className={isDark ? 'flex items-center gap-2 text-dark-400 mb-2' : 'flex items-center gap-2 text-gray-500 mb-2'}>
            <Wallet className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Wallet Balance</span>
          </div>
          <p className={isDark ? 'text-lg font-display font-bold text-white' : 'text-lg font-display font-bold text-gray-900'}>
            {walletBalance.toFixed(6)}
          </p>
          <p className={isDark ? 'text-xs text-dark-400 mt-1' : 'text-xs text-gray-500 mt-1'}>
            ETH {usdValue && <span className="text-netrum-400">(${usdValue})</span>}
          </p>
        </div>

        <div className={isDark ? 'bg-dark-800/50 rounded-xl p-4' : 'bg-gray-50 rounded-xl p-4'}>
          <div className={isDark ? 'flex items-center gap-2 text-dark-400 mb-2' : 'flex items-center gap-2 text-gray-500 mb-2'}>
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Status</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={isActive ? 'text-lg font-display font-bold text-emerald-400' : isDark ? 'text-lg font-display font-bold text-dark-400' : 'text-lg font-display font-bold text-gray-500'}>
              {isActive ? 'Mining' : 'Idle'}
            </span>
            {isActive && <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />}
          </div>
          <p className={isDark ? 'text-xs text-dark-400 mt-1' : 'text-xs text-gray-500 mt-1'}>
            {wallet.hasMinBalance ? 'Balance OK' : 'Low balance'}
          </p>
        </div>
      </div>

      {miningStatusInfo.lastMiningStart && (
        <div className={isDark ? 'mt-4 pt-4 border-t border-dark-800' : 'mt-4 pt-4 border-t border-gray-200'}>
          <p className={isDark ? 'text-xs text-dark-400' : 'text-xs text-gray-500'}>
            First Mining Start: {formatDateTimeDMY(miningStatusInfo.lastMiningStart)}
          </p>
        </div>
      )}
    </div>
  );
}

export default MiningMonitor;
