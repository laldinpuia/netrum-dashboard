import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
import { fetchStats, fetchActiveNodes, fetchNodeInfo, fetchClaimHistory, fetchMiningStatus, fetchTokenData, fetchMiningDebug, fetchTokenOverview } from './api/netrum';
import Header from './components/Header';
import Footer from './components/Footer';
import NodeSearch from './components/NodeSearch';
import StatsGrid from './components/StatsGrid';
import NetworkStats from './components/NetworkStats';
import NodeInfo from './components/NodeInfo';
import MiningStatus from './components/MiningStatus';
import ClaimHistory from './components/ClaimHistory';
import PerformanceChart from './components/PerformanceChart';
import RefreshTimer from './components/RefreshTimer';
import ErrorMessage from './components/ErrorMessage';
import { Search } from 'lucide-react';

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

function App() {
  const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') || 'dark' : 'dark';
  const [theme, setTheme] = useState(savedTheme);
  const [stats, setStats] = useState(null);
  const [activeNodes, setActiveNodes] = useState(null);
  const [nodeInfo, setNodeInfo] = useState(null);
  const [claimHistory, setClaimHistory] = useState(null);
  const [miningStatus, setMiningStatus] = useState(null);
  const [tokenData, setTokenData] = useState(null);
  const [miningDebug, setMiningDebug] = useState(null);
  const [tokenOverview, setTokenOverview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [currentWallet, setCurrentWallet] = useState(null);
  const isRefreshing = useRef(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Clear all data when starting a new search
  const clearData = () => {
    setNodeInfo(null);
    setClaimHistory(null);
    setMiningStatus(null);
    setTokenData(null);
    setMiningDebug(null);
    setError(null);
  };

  const loadData = useCallback(async (nodeId, wallet, isRefresh) => {
    if (isRefreshing.current && isRefresh) return;
    if (isRefresh) isRefreshing.current = true;
    
    if (!isRefresh) {
      clearData();
      setLoading(true);
      setClaimLoading(true);
      setError(null);
    }
    
    try {
      // Fetch network stats and token overview
      const [statsData, activeData, overviewData] = await Promise.all([
        fetchStats(),
        fetchActiveNodes(),
        fetchTokenOverview()
      ]);
      setStats(statsData);
      setActiveNodes(activeData);
      setTokenOverview(overviewData);

      let resolvedNodeId = nodeId;
      let resolvedWallet = wallet;

      // If wallet provided, get node info by wallet first
      if (wallet && !nodeId) {
        const nodeData = await fetchNodeInfo(wallet);
        if (nodeData && nodeData.node) {
          setNodeInfo(nodeData);
          resolvedNodeId = nodeData.node.nodeId;
          resolvedWallet = nodeData.node.wallet;
          setLoading(false);
        } else {
          // Wallet not found in nodes - show error
          setError('No node found for this wallet address. Please check the address and try again.');
          setLoading(false);
          setClaimLoading(false);
          setSearchPerformed(true);
          return;
        }
      }

      // Fetch node info by nodeId
      if (nodeId && !wallet) {
        const nodeData = await fetchNodeInfo(nodeId);
        if (nodeData && nodeData.node) {
          setNodeInfo(nodeData);
          resolvedWallet = nodeData.node.wallet;
          setLoading(false);
        } else {
          setError('Node not found. Please check the Node ID and try again.');
          setLoading(false);
          setClaimLoading(false);
          setSearchPerformed(true);
          return;
        }
      }

      // Fetch mining status if we have nodeId
      if (resolvedNodeId) {
        const miningData = await fetchMiningStatus(resolvedNodeId);
        setMiningStatus(miningData);
      }

      // Fetch token data and claim history if we have wallet
      if (resolvedWallet) {
        const [claimData, tokenInfo, debugInfo] = await Promise.all([
          fetchClaimHistory(resolvedWallet),
          fetchTokenData(resolvedWallet),
          fetchMiningDebug(resolvedWallet)
        ]);
        setClaimHistory(claimData);
        setTokenData(tokenInfo);
        setMiningDebug(debugInfo);
      }

      setCurrentNodeId(resolvedNodeId);
      setCurrentWallet(resolvedWallet);
      setSearchPerformed(true);
      setClaimLoading(false);
    } catch (err) {
      console.error('Error loading data:', err);
      if (!isRefresh) {
        setError(err.message);
      }
      setLoading(false);
      setClaimLoading(false);
    } finally {
      setLoading(false);
      if (isRefresh) isRefreshing.current = false;
    }
  }, []);

  // handleSearch receives TWO parameters: nodeId and wallet
  const handleSearch = (nodeId, wallet) => {
    loadData(nodeId, wallet, false);
  };

  const handleRefresh = () => {
    if (currentNodeId || currentWallet) {
      loadData(currentNodeId, currentWallet, true);
    }
  };

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={isDark ? 'min-h-screen bg-dark-900 text-white' : 'min-h-screen bg-gray-50 text-gray-900'}>
        <Header />
        <main className="container mx-auto px-4 max-w-7xl py-8">
          <NodeSearch onSearch={handleSearch} loading={loading} />
          
          {searchPerformed && !loading && (
            <RefreshTimer onRefresh={handleRefresh} interval={780} />
          )}
          
          {!searchPerformed && (
            <div className={isDark ? 'card text-center py-16' : 'card text-center py-16 bg-white border-gray-200'}>
              <Search className={isDark ? 'w-16 h-16 mx-auto mb-4 text-dark-600' : 'w-16 h-16 mx-auto mb-4 text-gray-300'} />
              <h3 className={isDark ? 'text-xl font-display font-semibold text-white mb-2' : 'text-xl font-display font-semibold text-gray-900 mb-2'}>Welcome to Netrum Dashboard</h3>
              <p className={isDark ? 'text-dark-400' : 'text-gray-500'}>Enter your Node ID or Wallet Address above to view your node statistics</p>
            </div>
          )}
          
          {loading && (
            <div className={isDark ? 'card text-center py-16' : 'card text-center py-16 bg-white border-gray-200'}>
              <div className="w-12 h-12 border-4 border-netrum-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className={isDark ? 'text-dark-400' : 'text-gray-500'}>Loading dashboard data...</p>
            </div>
          )}
          
          {error && <ErrorMessage message={error} />}
          
          {searchPerformed && !loading && !error && nodeInfo && (
            <div className="space-y-6 animate-fade-in">
              <NetworkStats stats={stats} activeNodes={activeNodes} />
              <StatsGrid nodeInfo={nodeInfo} claimHistory={claimHistory} tokenData={tokenData} claimLoading={claimLoading} />
              <PerformanceChart nodeInfo={nodeInfo} tokenData={tokenData} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <NodeInfo nodeInfo={nodeInfo} tokenOverview={tokenOverview} />
                <MiningStatus miningStatus={miningStatus} nodeInfo={nodeInfo} miningDebug={miningDebug} tokenData={tokenData} />
              </div>
              <ClaimHistory claimHistory={claimHistory} nodeInfo={nodeInfo} miningStatus={miningStatus} tokenData={tokenData} miningDebug={miningDebug} loading={claimLoading} />
            </div>
          )}
        </main>
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
