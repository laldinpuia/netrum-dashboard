import React from 'react';
import { Github, ExternalLink, Sun, Moon } from 'lucide-react';
import { useTheme } from '../App';

function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={`border-b ${theme === 'dark' ? 'border-dark-800 bg-dark-900/50' : 'border-gray-200 bg-white/80'} backdrop-blur-md sticky top-0 z-50`}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Netrum AI" className="w-10 h-10" />
            <div>
              <h1 className={`font-display font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Netrum AI
              </h1>
              <p className={`text-xs ${theme === 'dark' ? 'text-dark-400' : 'text-gray-500'}`}>Node Dashboard</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a 
              href="https://netrumlabs.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${theme === 'dark' ? 'text-dark-400 hover:text-netrum-400' : 'text-gray-500 hover:text-netrum-600'} transition-colors text-sm font-medium flex items-center gap-1`}
            >
              Netrum Labs
              <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://docs.netrumlabs.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${theme === 'dark' ? 'text-dark-400 hover:text-netrum-400' : 'text-gray-500 hover:text-netrum-600'} transition-colors text-sm font-medium flex items-center gap-1`}
            >
              Docs
              <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://github.com/NetrumLabs" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${theme === 'dark' ? 'text-dark-400 hover:text-netrum-400' : 'text-gray-500 hover:text-netrum-600'} transition-colors text-sm font-medium flex items-center gap-1`}
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-dark-800 hover:bg-dark-700 text-dark-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} transition-colors`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Status Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
              <div className="w-2 h-2 bg-emerald-400 rounded-full live-indicator" />
              <span className="text-xs font-medium text-emerald-400">Live</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
