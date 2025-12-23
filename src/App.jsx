import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
import { fetchStats, fetchActiveNodes, fetchNodeInfo, fetchClaimHistory, fetchMiningStatus, fetchTokenData, fetchMiningDebug } from './api/netrum';
import Header from './components/Header';
import Footer from './components/Footer';
import NodeSearch from './components/NodeSearch';
import StatsGrid from './components/StatsGrid';
import NetworkStats from './components/NetworkStats';
import NodeInfo from './components/NodeInfo';
import MiningStatus from './components/MiningStatus';
import ClaimHistory from './components/ClaimHistory';
import LiveLog from './components/LiveLog';
import PerformanceChart from './components/PerformanceChart';
import RefreshTimer from './components/RefreshTimer';
import ErrorMessage from './components/ErrorMessage';
import { Search } from 'lucide-react';

var ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

function App() {
  var savedTheme = 'dark';
  if (typeof window !== 'undefined') {
    savedTheme = localStorage.getItem('theme') || 'dark';
  }
  var [theme, setTheme] = useState(savedTheme);
  var [stats, setStats] = useState(null);
  var [activeNodes, setActiveNodes] = useState(null);
  var [nodeInfo, setNodeInfo] = useState(null);
  var [claimHistory, setClaimHistory] = useState(null);
  var [miningStatus, setMiningStatus] = useState(null);
  var [tokenData, setTokenData] = useState(null);
  var [miningDebug, setMiningDebug] = useState(null);
  var [loading, setLoading] = useState(false);
  var [error, setError] = useState(null);
  var [searchPerformed, setSearchPerformed] = useState(false);
  var [currentNodeId, setCurrentNodeId] = useState(null);
  var [currentWallet, setCurrentWallet] = useState(null);
  var isRefreshing = useRef(false);

  useEffect(function() {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  var toggleTheme = function() {
    setTheme(function(prev) { return prev === 'dark' ? 'light' : 'dark'; });
  };

  var loadData = useCallback(async function(nodeId, wallet, isRefresh) {
    if (isRefreshing.current && isRefresh) return;
    if (isRefresh) isRefreshing.current = true;
    
    if (!isRefresh) {
      setLoading(true);
      setError(null);
    }
    
    try {
      // Fetch network stats first
      var statsPromise = fetchStats();
      var activePromise = fetchActiveNodes();
      
      var [statsData, activeData] = await Promise.all([statsPromise, activePromise]);
      setStats(statsData);
      setActiveNodes(activeData);

      var resolvedNodeId = nodeId;
      var resolvedWallet = wallet;

      // If wallet provided, get claim history to find nodeId
      if (wallet) {
        var historyData = await fetchClaimHistory(wallet);
        setClaimHistory(historyData);
        if (historyData && historyData.lastClaim && historyData.lastClaim.nodeId) {
          resolvedNodeId = historyData.lastClaim.nodeId;
        }
      }

      // Fetch node info
      if (resolvedNodeId) {
        var nodeData = await fetchNodeInfo(resolvedNodeId);
        setNodeInfo(nodeData);
        
        if (nodeData && nodeData.node) {
          resolvedWallet = nodeData.node.wallet || resolvedWallet;
          
          // Fetch mining status
          var miningData = await fetchMiningStatus(resolvedNodeId);
          setMiningStatus(miningData);
        }
      }

      // Fetch token data and mining debug if we have wallet
      if (resolvedWallet) {
        // Fetch claim history if not already fetched
        if (!claimHistory && !wallet) {
          var claimData = await fetchClaimHistory(resolvedWallet);
          setClaimHistory(claimData);
        }
        
        // Fetch Etherscan token data (cached for 5 min)
        var tokenInfo = await fetchTokenData(resolvedWallet);
        setTokenData(tokenInfo);
        
        // Fetch mining debug
        var debugInfo = await fetchMiningDebug(resolvedWallet);
        setMiningDebug(debugInfo);
      }

      setCurrentNodeId(resolvedNodeId);
      setCurrentWallet(resolvedWallet);
      setSearchPerformed(true);
    } catch (err) {
      console.error('Error loading data:', err);
      if (!isRefresh) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
      if (isRefresh) isRefreshing.current = false;
    }
  }, [claimHistory]);

  var handleSearch = function(nodeId, wallet) {
    loadData(nodeId, wallet, false);
  };

  var handleRefresh = function() {
    if (currentNodeId || currentWallet) {
      loadData(currentNodeId, currentWallet, true);
    }
  };

  var isDark = theme === 'dark';

  return React.createElement(ThemeContext.Provider, { value: { theme: theme, toggleTheme: toggleTheme } },
    React.createElement('div', { className: isDark ? 'min-h-screen bg-dark-900 text-white' : 'min-h-screen bg-gray-50 text-gray-900' },
      React.createElement(Header, null),
      React.createElement('main', { className: 'container mx-auto px-4 max-w-7xl py-8' },
        React.createElement(NodeSearch, { onSearch: handleSearch, loading: loading }),
        
        searchPerformed && !loading && React.createElement(RefreshTimer, { onRefresh: handleRefresh, interval: 69 }),
        
        !searchPerformed && React.createElement('div', { className: isDark ? 'card text-center py-16' : 'card text-center py-16 bg-white border-gray-200' },
          React.createElement(Search, { className: isDark ? 'w-16 h-16 mx-auto mb-4 text-dark-600' : 'w-16 h-16 mx-auto mb-4 text-gray-300' }),
          React.createElement('h3', { className: isDark ? 'text-xl font-display font-semibold text-white mb-2' : 'text-xl font-display font-semibold text-gray-900 mb-2' }, 'Welcome to Netrum Dashboard'),
          React.createElement('p', { className: isDark ? 'text-dark-400' : 'text-gray-500' }, 'Enter your Node ID or Wallet Address above to view your node statistics')
        ),
        
        loading && React.createElement('div', { className: isDark ? 'card text-center py-16' : 'card text-center py-16 bg-white border-gray-200' },
          React.createElement('div', { className: 'w-12 h-12 border-4 border-netrum-500 border-t-transparent rounded-full animate-spin mx-auto mb-4' }),
          React.createElement('p', { className: isDark ? 'text-dark-400' : 'text-gray-500' }, 'Loading dashboard data...')
        ),
        
        error && React.createElement(ErrorMessage, { error: error, onRetry: handleRefresh }),
        
        searchPerformed && !loading && React.createElement('div', { className: 'space-y-6 animate-fade-in' },
          React.createElement(NetworkStats, { stats: stats, activeNodes: activeNodes }),
          React.createElement(StatsGrid, { nodeInfo: nodeInfo, claimHistory: claimHistory, tokenData: tokenData }),
          React.createElement(PerformanceChart, { nodeInfo: nodeInfo }),
          React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
            React.createElement(NodeInfo, { nodeInfo: nodeInfo }),
            React.createElement(MiningStatus, { miningStatus: miningStatus, nodeInfo: nodeInfo, miningDebug: miningDebug, tokenData: tokenData })
          ),
          React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-6' },
            React.createElement(ClaimHistory, { claimHistory: claimHistory, nodeInfo: nodeInfo, miningStatus: miningStatus, tokenData: tokenData }),
            React.createElement(LiveLog, { nodeInfo: nodeInfo, miningStatus: miningStatus })
          )
        )
      ),
      React.createElement(Footer, null)
    )
  );
}

export default App;
