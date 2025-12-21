import React from 'react';
import { Heart, Github, Twitter, ExternalLink } from 'lucide-react';

function Footer() {
  return (
    <footer className="border-t border-dark-800 bg-dark-900/30 mt-12">
      <div className="container mx-auto px-4 max-w-7xl py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-netrum-500 to-netrum-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="font-display font-bold text-white">Netrum Dashboard</span>
            </div>
            <p className="text-sm text-dark-400 mb-4">
              Real-time monitoring dashboard for Netrum Lite Nodes on Base Network.
            </p>
            <p className="text-xs text-dark-500 flex items-center gap-1">
              Built with <Heart className="w-3 h-3 text-red-400" /> by{' '}
              <a 
                href="https://twitter.com/BlockClaimed" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-netrum-400 hover:text-netrum-300 transition-colors"
              >
                @BlockClaimed
              </a>
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-medium text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <FooterLink href="https://netrumlabs.com" label="Netrum Labs" />
              <FooterLink href="https://docs.netrumlabs.com" label="Documentation" />
              <FooterLink href="https://discord.com/invite/87hVVDuppf" label="Discord Community" />
              <FooterLink href="https://basescan.org/token/0xb8c2ce84f831175136cebbfd48ce4bab9c7a6424" label="NPT Token" />
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-medium text-white mb-4">Connect</h4>
            <div className="flex items-center gap-3">
              <SocialLink 
                href="https://github.com/laldinpuia/netrum-dashboard" 
                icon={Github} 
                label="GitHub"
              />
              <SocialLink 
                href="https://twitter.com/netrum_ai" 
                icon={Twitter} 
                label="Twitter"
              />
            </div>
            
            <div className="mt-6 p-3 bg-dark-800/50 rounded-lg border border-dark-700">
              <p className="text-xs text-dark-400 mb-1">Netrum Developer Challenge</p>
              <p className="text-sm text-netrum-400 font-medium">4,000 NPT Prize Pool</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-dark-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-dark-500">
            &copy; {new Date().getFullYear()} Netrum Dashboard. Open source under MIT License.
          </p>
          <div className="flex items-center gap-4 text-xs text-dark-500">
            <span>Powered by Netrum Public API</span>
            <span className="w-1 h-1 bg-dark-600 rounded-full" />
            <span>Base Network</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, label }) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-dark-400 hover:text-netrum-400 transition-colors flex items-center gap-1"
      >
        {label}
        <ExternalLink className="w-3 h-3" />
      </a>
    </li>
  );
}

function SocialLink({ href, icon: Icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-center text-dark-400 hover:text-netrum-400 hover:border-netrum-500/30 transition-all"
      title={label}
    >
      <Icon className="w-5 h-5" />
    </a>
  );
}

export default Footer;
