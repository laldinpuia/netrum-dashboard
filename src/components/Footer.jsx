import React from 'react';
import { Github, ExternalLink, Send } from 'lucide-react';
import { useTheme } from '../App';

function Footer() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer className={isDark ? 'border-t border-dark-800 bg-dark-900/30 mt-12' : 'border-t border-gray-200 bg-gray-50 mt-12'}>
      <div className="container mx-auto px-4 max-w-7xl py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img src="/logo.png" alt="Netrum AI" className="w-10 h-10" />
              <div>
                <span className={isDark ? 'font-display font-bold text-white' : 'font-display font-bold text-gray-900'}>Netrum AI</span>
                <p className={isDark ? 'text-xs text-dark-400' : 'text-xs text-gray-500'}>Node Dashboard</p>
              </div>
            </div>
            <p className={isDark ? 'text-sm text-dark-400 mb-3' : 'text-sm text-gray-500 mb-3'}>
              Real-time monitoring dashboard for Netrum Lite Nodes on Base Network.
            </p>
            <p className={isDark ? 'text-sm text-dark-400' : 'text-sm text-gray-500'}>
              Built by <span className="text-netrum-400 font-medium">D.i.PY™</span>
            </p>
            <div className="flex items-center gap-2 mt-3">
              <SocialIcon href="https://x.com/BlockClaimed" title="X (Twitter)">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </SocialIcon>
              <SocialIcon href="https://github.com/laldinpuia" title="GitHub">
                <Github className="w-4 h-4" />
              </SocialIcon>
              <SocialIcon href="https://discord.com/users/403450851202695169" title="Discord">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.36-.698.772-1.362 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.122-.094.248-.19.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              </SocialIcon>
              <SocialIcon href="https://t.me/dipy_tuallawt" title="Telegram">
                <Send className="w-4 h-4" />
              </SocialIcon>
            </div>
          </div>
          <div>
            <h4 className={isDark ? 'font-medium text-white mb-4' : 'font-medium text-gray-900 mb-4'}>Resources</h4>
            <ul className="space-y-2">
              <li><a href="https://netrumlabs.com" target="_blank" rel="noopener noreferrer" className={isDark ? 'text-sm text-dark-400 hover:text-netrum-400 transition-colors flex items-center gap-1' : 'text-sm text-gray-500 hover:text-netrum-600 transition-colors flex items-center gap-1'}>Netrum Labs<ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://docs.netrumlabs.com" target="_blank" rel="noopener noreferrer" className={isDark ? 'text-sm text-dark-400 hover:text-netrum-400 transition-colors flex items-center gap-1' : 'text-sm text-gray-500 hover:text-netrum-600 transition-colors flex items-center gap-1'}>Documentation<ExternalLink className="w-3 h-3" /></a></li>
              <li><a href="https://basescan.org/token/0xb8c2ce84f831175136cebbfd48ce4bab9c7a6424" target="_blank" rel="noopener noreferrer" className={isDark ? 'text-sm text-dark-400 hover:text-netrum-400 transition-colors flex items-center gap-1' : 'text-sm text-gray-500 hover:text-netrum-600 transition-colors flex items-center gap-1'}>NPT Token<ExternalLink className="w-3 h-3" /></a></li>
            </ul>
          </div>
          <div>
            <h4 className={isDark ? 'font-medium text-white mb-4' : 'font-medium text-gray-900 mb-4'}>Connect</h4>
            <div className="flex items-center gap-2 flex-wrap">
              <SocialIcon href="https://github.com/laldinpuia/netrum-dashboard" title="Dashboard Repo"><Github className="w-5 h-5" /></SocialIcon>
              <SocialIcon href="https://discord.com/invite/87hVVDuppf" title="Discord Community"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.36-.698.772-1.362 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.122-.094.248-.19.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg></SocialIcon>
              <SocialIcon href="https://x.com/netrum_ai" title="Netrum X"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></SocialIcon>
              <SocialIcon href="https://guild.xyz/netrum-labs" title="Guild"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></SocialIcon>
              <SocialIcon href="https://zealy.io/cw/netrumai/invite/yKemWK3x1rKjgVjcBo36O" title="Zealy"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></SocialIcon>
            </div>
          </div>
        </div>
        <div className={isDark ? 'mt-8 pt-6 border-t border-dark-800 flex flex-col md:flex-row items-center justify-between gap-4' : 'mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4'}>
          <p className={isDark ? 'text-xs text-dark-500' : 'text-xs text-gray-400'}>© 2025 Netrum AI Node Dashboard. Open source under MIT License.</p>
          <div className={isDark ? 'flex items-center gap-4 text-xs text-dark-500' : 'flex items-center gap-4 text-xs text-gray-400'}>
            <span>Powered by Netrum Public API</span>
            <span className={isDark ? 'w-1 h-1 bg-dark-600 rounded-full' : 'w-1 h-1 bg-gray-300 rounded-full'}></span>
            <span>Base Network</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, title, children }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={isDark ? 'w-9 h-9 rounded-lg bg-dark-800 border-dark-700 text-dark-400 hover:text-netrum-400 hover:border-netrum-500/30 border flex items-center justify-center transition-all' : 'w-9 h-9 rounded-lg bg-gray-100 border-gray-200 text-gray-500 hover:text-netrum-600 hover:border-netrum-300 border flex items-center justify-center transition-all'} title={title}>{children}</a>
  );
}

export default Footer;
