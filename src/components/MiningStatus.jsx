import React, { useState, useEffect } from 'react';
import { Hammer, Timer, TrendingUp, Flame } from 'lucide-react';

function MiningStatus({ miningStatus, cooldown }) {
  const isMining = miningStatus?.mining || miningStatus?.status === 'active';
  const miningRate = miningStatus?.rate || miningStatus?.mining_rate || '0.5';
  const totalMined = miningStatus?.total_mined || miningStatus?.mined || '0';

  return (
    <div className="card card-hover">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${
            isMining 
              ? 'bg-emerald-500/10 border border-emerald-500/30' 
              : 'bg-dark-700 border border-dark-600'
          }`}>
            <Hammer className={`w-5 h-5 ${isMining ? 'text-emerald-400' : 'text-dark-400'}`} />
          </div>
          <div>
            <h3 className="font-display font-semibold text-white">Mining Status</h3>
            <p className="text-sm text-dark-400">Current mining activity</p>
          </div>
        </div>
        
        {isMining && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
            <Flame className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">Mining Active</span>
          </div>
        )}
      </div>

      {/* Mining Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-dark-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-dark-400 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Mining Rate</span>
          </div>
          <p className="text-2xl font-display font-bold text-white">
            {miningRate}
          </p>
          <p className="text-xs text-dark-400 mt-1">NPT per day</p>
        </div>

        <div className="bg-dark-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 text-dark-400 mb-2">
            <Hammer className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Total Mined</span>
          </div>
          <p className="text-2xl font-display font-bold text-white">
            {parseFloat(totalMined).toFixed(2)}
          </p>
          <p className="text-xs text-dark-400 mt-1">NPT tokens</p>
        </div>
      </div>

      {/* Cooldown Timer */}
      <CooldownTimer cooldown={cooldown} />
    </div>
  );
}

function CooldownTimer({ cooldown }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!cooldown?.remaining_seconds && !cooldown?.cooldown_remaining) return;
    
    const remaining = cooldown.remaining_seconds || cooldown.cooldown_remaining || 0;
    setTimeLeft(remaining);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return '00:00:00';
    
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isOnCooldown = timeLeft && timeLeft > 0;
  const progress = cooldown?.total_seconds 
    ? ((cooldown.total_seconds - (timeLeft || 0)) / cooldown.total_seconds) * 100 
    : 100;

  return (
    <div className={`rounded-xl p-4 ${
      isOnCooldown 
        ? 'bg-purple-500/10 border border-purple-500/30' 
        : 'bg-emerald-500/10 border border-emerald-500/30'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Timer className={`w-4 h-4 ${isOnCooldown ? 'text-purple-400' : 'text-emerald-400'}`} />
          <span className={`text-sm font-medium ${isOnCooldown ? 'text-purple-400' : 'text-emerald-400'}`}>
            {isOnCooldown ? 'Cooldown Active' : 'Ready to Claim'}
          </span>
        </div>
        <span className={`font-mono font-bold ${isOnCooldown ? 'text-purple-300' : 'text-emerald-300'}`}>
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${
            isOnCooldown ? 'bg-purple-500' : 'bg-emerald-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {cooldown?.next_claim_time && (
        <p className="text-xs text-dark-400 mt-2">
          Next claim available: {new Date(cooldown.next_claim_time).toLocaleString()}
        </p>
      )}
    </div>
  );
}

export default MiningStatus;
