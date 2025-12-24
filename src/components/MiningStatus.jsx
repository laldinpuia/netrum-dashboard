import React, { useState, useEffect, useMemo } from 'react';
import { Gem, Zap, Clock, TrendingUp, CheckCircle, Coins, Wallet } from 'lucide-react';
import { useTheme } from '../App';
import { fetchEthPrice, formatDateTimeDMY } from '../api/netrum';

const MAX_NPT_PER_CYCLE = 3.7;

function MiningStatus({ miningStatus, nodeInfo, miningDebug, tokenData }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [ethPrice, setEthPrice] = useState(null);
  const [elapsedTime, setElapsedTime] = useState('');

  useEffect(() => {
    fetchEthPrice().then(setEthPrice);
  }, []);

  const node = nodeInfo && nodeInfo.node ? nodeInfo.node : {};
  const mining = miningStatus || {};
  const contractDetails = mining.contractDetails || {};
  const miningData = contractDetails.miningInfo || {};
  
  const debug = miningDebug || {};
  const debugContract = debug.contract || {};
  const debugMining = debugContract.miningInfo || {};
  const debugWallet = debug.wallet || {};

  const isActive = debugMining.isActive || miningData.isActive || false;
  const minedTokens = debugMining.minedTokensFormatted || miningData.minedTokens || 0;
  const speedPerSec = debugMining.speedPerSec ? parseFloat(debugMining.speedPerSec) / 1e18 : (miningData.speedPerSec ? parseFloat(miningData.speedPerSec) / 1e18 : 0);
  const walletBalance = debugWallet.balanceEth || contractDetails.walletBalanceEth || 0;
  const totalNptClaimed = tokenData && tokenData.totalNptClaimed ? tokenData.totalNptClaimed : 0;
  const totalClaims = tokenData && tokenData.totalClaims ? tokenData.totalClaims : 0;

  const lastClaimTime = useMemo(() => {
    if (tokenData?.recentClaims?.length > 0) {
      const sortedClaims = [...tokenData.recentClaims].sort((a, b) => 
        parseInt(b.timeStamp) - parseInt(a.timeStamp)
      );
      return new Date(parseInt(sortedClaims[0].timeStamp) * 1000);
    }
    return node.lastClaimTime ? new Date(node.lastClaimTime) : null;
  }, [tokenData, node.lastClaimTime]);

  const displayProgress = Math.min(100, (minedTokens / MAX_NPT_PER_CYCLE) * 100);
  const isReady = displayProgress >= 100;

  useEffect(() => {
    const updateElapsed = () => {
      if (lastClaimTime) {
        const now = new Date();
        const elapsedMs = now - lastClaimTime;
        const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
        const mins = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((elapsedMs % (1000 * 60)) / 1000);
        setElapsedTime(`${hours}h ${mins}m ${secs}s`);
      }
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [lastClaimTime]);

  const usdValue = ethPrice ? (walletBalance * ethPrice).toFixed(2) : null;

  return (
    <div className={isDark ? 'card card-hover h-full' : 'card card-hover bg-white border-gray-200 h-full'}>
      <div className="flex items-center justify-between mb-4">
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
          <span className={isActive ? 'text-xs font-medium text-emerald-400' : 'text-xs font-medium text-amber-400'}>{isActive ? 'ACTIVE' : 'INACTIVE'}</span>
        </div>
      </div>

      <div className={isDark ? 'bg-dark-800/50 rounded-xl p-4 mb-3' : 'bg-gray-50 rounded-xl p-4 mb-3'}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className={isDark ? 'w-4 h-4 text-dark-400' : 'w-4 h-4 text-gray-500'} />
            <span className={isDark ? 'text-sm text-dark-300' : 'text-sm text-gray-600'}>Mining Progress (24h cycle)</span>
          </div>
          <span className={isDark ? 'text-sm font-mono text-white' : 'text-sm font-mono text-gray-900'}>{displayProgress.toFixed(2)}%</span>
        </div>
        <div className={isDark ? 'h-4 bg-dark-700 rounded-full overflow-hidden mb-2' : 'h-4 bg-gray-200 rounded-full overflow-hidden mb-2'}>
          <div className={isReady ? 'h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000' : 'h-full bg-gradient-to-r from-netrum-600 to-netrum-400 transition-all duration-1000'} style={{ width: displayProgress + '%' }} />
        </div>
        <div className="flex items-center justify-between">
          <span className={isDark ? 'text-xs text-dark-400' : 'text-xs text-gray-500'}>{isReady ? '✅ Ready to claim!' : `⏱️ ${elapsedTime} elapsed`}</span>
          <span className={isDark ? 'text-xs text-dark-400' : 'text-xs text-gray-500'}>24h</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className={isDark ? 'bg-dark-800/50 rounded-xl p-3' : 'bg-gray-50 rounded-xl p-3'}>
          <div className={isDark ? 'flex items-center gap-2 text-dark-400 mb-1' : 'flex items-center gap-2 text-gray-500 mb-1'}>
            <Coins className="w-3 h-3" />
            <span className="text-xs uppercase tracking-wider">Session Mined</span>
          </div>
          <p className="text-lg font-display font-bold text-netrum-400">{typeof minedTokens === 'number' ? minedTokens.toFixed(4) : minedTokens}</p>
          <p className={isDark ? 'text-xs text-dark-400' : 'text-xs text-gray-500'}>NPT</p>
        </div>
        <div className={isDark ? 'bg-dark-800/50 rounded-xl p-3' : 'bg-gray-50 rounded-xl p-3'}>
          <div className={isDark ? 'flex items-center gap-2 text-dark-400 mb-1' : 'flex items-center gap-2 text-gray-500 mb-1'}>
            <Zap className="w-3 h-3" />
            <span className="text-xs uppercase tracking-wider">Speed</span>
          </div>
          <p className={isDark ? 'text-lg font-display font-bold text-white' : 'text-lg font-display font-bold text-gray-900'}>{speedPerSec.toFixed(8)}</p>
          <p className={isDark ? 'text-xs text-dark-400' : 'text-xs text-gray-500'}>NPT/sec</p>
        </div>
      </div>

      {totalClaims > 0 && (
        <div className={isDark ? 'bg-netrum-500/10 border border-netrum-500/30 rounded-xl p-3 mb-3' : 'bg-orange-50 border border-orange-200 rounded-xl p-3 mb-3'}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-3 h-3 text-netrum-400" />
                <span className={isDark ? 'text-xs uppercase tracking-wider text-dark-400' : 'text-xs uppercase tracking-wider text-gray-500'}>Total NPT Claimed</span>
              </div>
              <p className="text-xl font-display font-bold text-netrum-400">{totalNptClaimed.toFixed(4)} <span className="text-sm font-normal">NPT</span></p>
            </div>
            <div className="text-right">
              <p className={isDark ? 'text-xs text-dark-400' : 'text-xs text-gray-500'}>From {totalClaims} claims</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className={isDark ? 'bg-dark-800/50 rounded-xl p-3' : 'bg-gray-50 rounded-xl p-3'}>
          <div className={isDark ? 'flex items-center gap-2 text-dark-400 mb-1' : 'flex items-center gap-2 text-gray-500 mb-1'}>
            <Wallet className="w-3 h-3" />
            <span className="text-xs uppercase tracking-wider">Wallet Balance</span>
          </div>
          <p className={isDark ? 'text-base font-display font-bold text-white' : 'text-base font-display font-bold text-gray-900'}>{walletBalance.toFixed(6)}</p>
          <p className={isDark ? 'text-xs text-dark-400' : 'text-xs text-gray-500'}>ETH {usdValue && <span className="text-netrum-400">(${usdValue})</span>}</p>
        </div>
        <div className={isDark ? 'bg-dark-800/50 rounded-xl p-3' : 'bg-gray-50 rounded-xl p-3'}>
          <div className={isDark ? 'flex items-center gap-2 text-dark-400 mb-1' : 'flex items-center gap-2 text-gray-500 mb-1'}>
            <CheckCircle className="w-3 h-3" />
            <span className="text-xs uppercase tracking-wider">Status</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={isActive ? 'text-base font-display font-bold text-emerald-400' : isDark ? 'text-base font-display font-bold text-dark-400' : 'text-base font-display font-bold text-gray-500'}>{isActive ? 'Mining' : 'Idle'}</span>
            {isActive && <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />}
          </div>
          <p className={isDark ? 'text-xs text-dark-400' : 'text-xs text-gray-500'}>{walletBalance >= 0.0002 ? 'Balance OK' : 'Low balance'}</p>
        </div>
      </div>

      {lastClaimTime && (
        <div className={isDark ? 'mt-3 pt-3 border-t border-dark-800' : 'mt-3 pt-3 border-t border-gray-200'}>
          <p className={isDark ? 'text-xs text-dark-400' : 'text-xs text-gray-500'}>Current Mining Session: {formatDateTimeDMY(lastClaimTime)}</p>
        </div>
      )}
    </div>
  );
}

export default MiningStatus;
