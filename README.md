<div align="center">

# Netrum AI Node Dashboard

![Netrum Dashboard](https://img.shields.io/badge/Netrum-Dashboard-orange?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.1.3-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)

**A real-time monitoring dashboard for Netrum Lite Nodes on Base Network**

[Live Demo](https://dipy.me) | [Documentation](https://docs.netrumlabs.com) | [Netrum Labs](https://netrumlabs.com)

</div>

---

## ✨ Features

### Core Monitoring
- **Real-time Node Monitoring** — Track node status, uptime, sync state with live updates every 13 minutes
- **Mining Operations Dashboard** — View mining progress, session mined NPT, mining speed, and wallet balance
- **Smart Contract Integration** — Direct integration with Netrum mining contract on Base Network
- **Etherscan V2 API Integration** — Accurate claim history with on-chain verification

### Analytics & Visualization
- **Performance Analytics** — Health score calculation, sync count, and uptime rate metrics
- **Requirements Comparison** — Side-by-side view of minimum requirements vs actual system specs
- **Claims History Tracking** — Complete transaction history with export capabilities
- **Claims Analytics Chart** — Visual bar charts with 7 Days, Monthly, and Yearly views
- **Network Statistics** — Global overview of total nodes, active nodes, and network tasks

### User Experience
- **Dark/Light Mode** — Toggle between themes with persistent preference
- **Responsive Design** — Fully functional on desktop, tablet, and mobile devices
- **Auto-refresh with Timer** — Visual countdown with pause/resume controls
- **PDF Export** — Generate professional reports with optimized A4 layout
- **Dual Search** — Search by Node ID or Wallet Address with error handling

### Technical Features
- **Background Node Fetching** — Non-blocking API calls with intelligent caching
- **Rate Limit Compliance** — Server-side caching to respect API limits
- **Loading States** — Spinner indicators for async data fetching
- **Live Activity Log** — Real-time event stream with claim status indicators

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js 20+ | Runtime environment |
| Express.js | Web framework |
| node-cache | In-memory caching (60-300s TTL) |
| ES Modules | Modern JavaScript imports |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework with hooks |
| Vite | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| Lucide React | Icon library |
| jsPDF | PDF generation |
| html2canvas | Screenshot capture |

### APIs
| API | Usage |
|-----|-------|
| Netrum API | Node data, mining status, network stats |
| Etherscan V2 | Token transfers, claim verification |
| CoinGecko | ETH price for USD conversion |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/laldinpuia/netrum-dashboard.git
cd netrum-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Development server runs on `http://localhost:5173` with API proxy to port 3001.

### Production Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

### PM2 Deployment (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start server/index.js --name netrum-dashboard

# Enable startup persistence
pm2 save
pm2 startup
```

---

## 📡 API Endpoints

| Endpoint | Method | Description | Cache |
|----------|--------|-------------|-------|
| `/api/stats` | GET | Network statistics | 5 min |
| `/api/nodes/active` | GET | Active nodes list | 5 min |
| `/api/node/:identifier` | GET | Node details (nodeId or wallet) | 5 min |
| `/api/mining/:nodeId` | GET | Mining status & contract data | 60s |
| `/api/mining-debug/:wallet` | GET | Real-time mining debug info | 60s |
| `/api/claim/:wallet/history` | GET | Claim history from Etherscan | 13 min |
| `/api/tokens/:wallet` | GET | Token transfer data | 13 min |
| `/api/token-overview` | GET | NPT token max supply | 13 min |
| `/api/health` | GET | Server health check | — |

---

## 📁 Project Structure
```
netrum-dashboard/
├── server/
│   └── index.js                  # Express backend with caching
├── src/
│   ├── api/
│   │   └── netrum.js             # API client & utilities
│   ├── components/
│   │   ├── Header.jsx            # App header with theme toggle
│   │   ├── NodeSearch.jsx        # Search input component
│   │   ├── NetworkStats.jsx      # Global network overview
│   │   ├── StatsGrid.jsx         # Quick stats cards
│   │   ├── PerformanceChart.jsx  # Analytics & requirements
│   │   ├── NodeInfo.jsx          # Node details & system metrics
│   │   ├── MiningStatus.jsx      # Mining monitor & progress
│   │   ├── ClaimHistory.jsx      # Transaction history & chart
│   │   ├── RefreshTimer.jsx      # Auto-refresh countdown
│   │   └── Footer.jsx            # Credits & social links
│   ├── App.jsx                   # Main application logic
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles & Tailwind
├── public/
│   ├── logo.png                  # Netrum logo
│   └── netrum-logo.svg           # SVG variant
├── index.html                    # HTML template
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## 📋 Changelog

### v1.1.3 (Current)
**PDF Export Layout Redesign**
- Refactored header layout: horizontal logo-title alignment with centered positioning
- Removed vertical orange accent borders from card containers
- Replaced thick header separator with thin 0.5mm accent line
- Restructured footer component with three-section layout:
  - Primary title (centered, white)
  - Attribution line with trademark symbol (centered, accent color)
  - Generation timestamp (right-aligned, muted)
- Added thin accent separator at footer top boundary
- Removed duplicate timestamp from header section
- Optimized card container dimensions for A4 page constraints
- Improved text element positioning within card boundaries

### v1.1.2
**UI Polish & Grammar Fixes**
- Renamed few Title Headers
- Changed Icons
- Consistent terminology across components

### v1.1.1
**Claims Analytics Enhancement**
- Added NPT values displayed on top of chart bars
- Monthly view now shows all 12 months of current year
- Chart bar sizing auto-adjusts based on data density
- PDF export includes NPT values on chart bars

### v1.1.0
**Wallet Search & Loading States**
- Fixed wallet address search functionality
- Dual-parameter search handler (nodeId, wallet separation)
- Added loading spinners for Claims History and StatsGrid
- Error messages for invalid node IDs and wallet addresses
- Mining progress calculated from mined tokens (3.7 NPT max per 24h cycle)
- Current Mining Session timestamp from last claim time
- NPT Token Overview with max supply from Etherscan API
- Refresh interval increased to 780 seconds (13 minutes)

### v1.0.9
**API Architecture Overhaul & Performance Optimization**
- Migrated to new Netrum API structure (`/nodes?limit=2000` endpoint)
- Implemented background node fetching with 5-minute cache
- Added graceful fallbacks for API failures
- Enhanced timeout handling (30-60 second timeouts)

**UI/UX Improvements**
- Redesigned Requirements Status with dual-box layout
- Added TTS Power status indicator to System Metrics
- Fixed Mining Monitor timestamp labels
- Updated Live Activity Log with "First Mining Started" event

### v1.0.8
**Mining Debug Integration**
- Integrated `/mining/debug/contract/{wallet}` API for real-time mining data
- Added session mined NPT tracking
- Implemented mining speed display (NPT/sec)
- Added wallet balance with USD conversion via CoinGecko API

### v1.0.7
**Etherscan V2 Integration & Data Accuracy**
- Migrated claim history to Etherscan V2 API for on-chain verification
- Implemented accurate total NPT claimed calculation
- Added total claims counter from blockchain data
- Standardized date format to DD/MM/YYYY across all components
- Added Requirements Status icons (PASS/FAIL indicators)

### v1.0.6
**Mining Monitor Component**
- New dedicated Mining Monitor card with progress bar
- Real-time mining progress percentage (24h cycle)
- Session mined display with pending rewards
- Mining speed calculation and display
- Status indicators (Active/Inactive/Cooldown)

### v1.0.5
**PDF Export Enhancement**
- Integrated Netrum logo in PDF header
- Professional two-column card layout
- Color-coded sections matching dashboard theme
- Full-width cards for Requirements and Sync History
- Custom footer with branding

### v1.0.4
**Performance Charts & Analytics**
- Added Health Score calculation algorithm
- Implemented Total Syncs counter
- Added Uptime Rate percentage
- Recent Activity feed with event types
- Requirements comparison table

### v1.0.3
**Theme & Export Features**
- Dark/Light mode toggle with localStorage persistence
- Flexible search (Node ID or Wallet Address)
- PDF export functionality with jsPDF
- CSV/JSON export for claim history
- RefreshTimer component with pause/resume

### v1.0.2
**UI Refinements**
- Improved card layouts and spacing
- Enhanced mobile responsiveness
- Added loading states and skeletons
- Error handling with user feedback
- Copy to clipboard for addresses

### v1.0.1
**Initial Release**
- Core dashboard layout and components
- Node information display
- Basic mining status
- Claim history table
- Network statistics overview
- Auto-refresh functionality

---

## 🔧 Configuration

### Environment Variables
```env
PORT=3001
NODE_ENV=production
```

### Customization

Edit `src/App.jsx` to modify default behavior:
```javascript
// Default refresh interval (seconds)
const REFRESH_INTERVAL = 780;

// Cache durations in server/index.js
const CACHE_TTL = {
  nodes: 300,      // 5 minutes
  mining: 60,      // 1 minute
  tokens: 780      // 13 minutes
};
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**D.i.PY™**

| Platform | Link |
|----------|------|
| 𝕏 (Twitter) | [@BlockClaimed](https://twitter.com/BlockClaimed) |
| GitHub | [@laldinpuia](https://github.com/laldinpuia) |
| Discord | [@d.i.py](https://discord.com/users/403450851202695169) |
| Telegram | [dipy_tuallawt](https://t.me/dipy_tuallawt) |

---

<div align="center">

**[Live Dashboard](https://dipy.me)** • **[Netrum Labs](https://netrumlabs.com)** • **[Base Network](https://base.org)**

</div>
