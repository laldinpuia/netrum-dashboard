import React, { useState } from 'react';
import { Search, AlertCircle, Loader } from 'lucide-react';
import { useTheme } from '../App';

function NodeSearch({ onSearch, loading }) {
  const { theme } = useTheme();
  const [searchInput, setSearchInput] = useState('');
  const [searchError, setSearchError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchError('');
    
    const input = searchInput.trim();
    
    if (!input) {
      setSearchError('Please enter a Node ID or Wallet Address');
      return;
    }

    // Determine if input is wallet address or node ID
    if (input.startsWith('0x') && input.length === 42) {
      // It's a wallet address - pass empty nodeId, wallet as second param
      onSearch('', input);
    } else if (input.includes('.base.eth') || input.startsWith('netrum.')) {
      // It's a node ID - pass nodeId, empty wallet
      onSearch(input, '');
    } else {
      // Try as node ID first
      onSearch(input, '');
    }
  };

  return (
    <div className={`card card-hover ${theme === 'dark' ? '' : 'bg-white border-gray-200'}`}>
      <div className="mb-4">
        <h2 className={`text-lg font-display font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Monitor Your Node</h2>
        <p className={`text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-gray-500'} mt-1`}>
          Enter your Node ID (e.g., netrum.lite.yourname.base.eth) or Wallet Address (0x...)
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-dark-500' : 'text-gray-400'}`} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setSearchError('');
              }}
              placeholder="Enter Node ID or Wallet Address..."
              className={`w-full ${theme === 'dark' ? 'bg-dark-800 border-dark-700 text-dark-100 placeholder-dark-500' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'} border rounded-lg px-4 py-3 pl-12 focus:outline-none focus:border-netrum-500 focus:ring-1 focus:ring-netrum-500 transition-all duration-200 font-mono text-sm`}
              disabled={loading}
            />
          </div>
          
          {searchError && (
            <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {searchError}
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className={`text-xs ${theme === 'dark' ? 'text-dark-500' : 'text-gray-400'}`}>
            Tip: You can search using either your Node ID or your wallet address
          </p>
          <button 
            type="submit" 
            className="btn-primary flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search Node
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NodeSearch;
