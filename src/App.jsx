import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import NodeSearch from './components/NodeSearch';
import StatsGrid from './components/StatsGrid';
import NodeInfo from './components/NodeInfo';
import MiningStatus from './components/MiningStatus';
import ClaimHistory from './components/ClaimHistory';
import LiveLog from './components/LiveLog';
import NetworkStats from './components/NetworkStats';
import RefreshTimer from './components/RefreshTimer';
import Footer from './components/Footer';
import { fetchDashboardData } from './api/netrum';

// Default node for demonstration
const DEFAULT_NODE_ID = 'netrum.lite.laldinpuia.base.eth';
const DEFAULT_WALLET = '0x828F40DcCD14FAd59F7dCfb5C57F3642Ec37f89f';

function App() {
  const [nodeId, setNodeId] = useState(DEFAULT_NODE_ID);
  const [walletAddress, setWalletAddress] = useState(DEFAULT_WALLET);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setIsRefreshing(true);
    setError(null);
    
    try {
      const data = await fetchDashboardData(nodeId, walletAddress);
      setDashboardData(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [nodeId, walletAddress]);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle node search
  const handleSearch = (newNodeId, newWallet) => {
    setNodeId(newNodeId);
    setWalletAddress(newWallet);
  };

  // Handle refresh
  const handleRefresh = () => {
    loadData(false);
  };

  return (
    <div className="min-h-screen bg-dark-950 grid-bg">
      {/* Background gradient effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-netrum-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-netrum-700/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Search and Controls */}
          <div className="mb-8">
            <NodeSearch 
              onSearch={handleSearch}
              defaultNodeId={nodeId}
              defaultWallet={walletAddress}
            />
          </div>

          {/* Refresh Timer */}
          <div className="mb-6">
            <RefreshTimer 
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
              lastUpdated={lastUpdated}
            />
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
              <p className="font-medium">Error loading data</p>
              <p className="text-sm mt-1 text-red-400/80">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-netrum-500/30 border-t-netrum-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-dark-400">Loading dashboard data...</p>
              </div>
            </div>
          )}

          {/* Dashboard Content */}
          {!loading && dashboardData && (
            <div className="space-y-6 animate-fade-in">
              {/* Network Stats Overview */}
              <NetworkStats data={dashboardData.networkStats} />

              {/* Main Stats Grid */}
              <StatsGrid data={dashboardData} />

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Node Information */}
                <NodeInfo 
                  nodeInfo={dashboardData.nodeInfo}
                  metricsStatus={dashboardData.metricsStatus}
                />

                {/* Mining Status */}
                <MiningStatus 
                  miningStatus={dashboardData.miningStatus}
                  cooldown={dashboardData.miningCooldown}
                />
              </div>

              {/* Full Width Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Claim History */}
                <ClaimHistory 
                  claimStatus={dashboardData.claimStatus}
                  claimHistory={dashboardData.claimHistory}
                />

                {/* Live Log */}
                <LiveLog data={dashboardData.liveLog} />
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
