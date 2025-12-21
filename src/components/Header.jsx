import React from 'react';
import { Activity, Github, ExternalLink } from 'lucide-react';

function Header() {
  return (
    <header className="border-b border-dark-800 bg-dark-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-netrum-500 to-netrum-700 flex items-center justify-center shadow-lg glow-orange">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-white">
                Netrum Dashboard
              </h1>
              <p className="text-xs text-dark-400">Node Monitoring System</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a 
              href="https://netrumlabs.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-dark-400 hover:text-netrum-400 transition-colors text-sm font-medium flex items-center gap-1"
            >
              Netrum Labs
              <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://docs.netrumlabs.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-dark-400 hover:text-netrum-400 transition-colors text-sm font-medium flex items-center gap-1"
            >
              Docs
              <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://github.com/NetrumLabs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-dark-400 hover:text-netrum-400 transition-colors text-sm font-medium flex items-center gap-1"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </nav>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
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
