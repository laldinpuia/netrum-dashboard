import React, { useState } from 'react';
import { Search, Wallet } from 'lucide-react';

function NodeSearch({ onSearch, defaultNodeId, defaultWallet }) {
  const [nodeId, setNodeId] = useState(defaultNodeId);
  const [wallet, setWallet] = useState(defaultWallet);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nodeId.trim() && wallet.trim()) {
      onSearch(nodeId.trim(), wallet.trim());
    }
  };

  return (
    <div className="card card-hover">
      <div className="mb-4">
        <h2 className="text-lg font-display font-semibold text-white">Monitor Your Node</h2>
        <p className="text-sm text-dark-400 mt-1">Enter your node ID and wallet address to view detailed statistics</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Node ID
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
              <input
                type="text"
                value={nodeId}
                onChange={(e) => setNodeId(e.target.value)}
                placeholder="netrum.lite.yourname.base.eth"
                className="input-field pl-10 font-mono text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Wallet Address
            </label>
            <div className="relative">
              <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
              <input
                type="text"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                placeholder="0x..."
                className="input-field pl-10 font-mono text-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button type="submit" className="btn-primary flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search Node
          </button>
        </div>
      </form>
    </div>
  );
}

export default NodeSearch;
