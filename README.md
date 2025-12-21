# Netrum Node Public Endpoints Dashboard

<div align="center">

![Netrum Dashboard](https://img.shields.io/badge/Netrum-Dashboard-orange?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-20+-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge)

**A real-time monitoring dashboard for Netrum Lite Nodes on Base Network**

[Live Demo](https://dipy.me) | [Documentation](https://docs.netrumlabs.com) | [Netrum Labs](https://netrumlabs.com)

</div>

---

## Features

- **Real-time Node Monitoring** - Track node status, uptime, and sync state with live updates
- **Mining Operations Dashboard** - View mining status, rate, cooldown timers, and total mined NPT
- **Claim History & Analytics** - Interactive charts showing claim history and pending rewards
- **Live Activity Log** - Real-time event stream with filtering capabilities
- **Network Statistics** - Global network overview with total nodes and hash rate
- **Smart Rate Limiting** - Server-side caching to comply with 30-second API limits
- **Auto-refresh with Countdown** - Visual countdown timer with pause/resume controls
- **Dark Mode UI** - Modern dark theme optimized for crypto dashboards
- **Responsive Design** - Fully functional on desktop, tablet, and mobile
- **Data Export** - Export claim history to CSV or JSON formats

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **node-cache** - In-memory caching for rate limit compliance
- **Server-Sent Events (SSE)** - Real-time updates

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **Lucide React** - Icons

## Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn

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

This starts both the backend server (port 3001) and frontend dev server (port 5173).

### Production Build

```bash
# Build for production
npm run build

# Start production server
NODE_ENV=production npm start
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3001
NODE_ENV=development
```

### Default Node Configuration

Edit `src/App.jsx` to change default node/wallet:

```javascript
const DEFAULT_NODE_ID = 'your-node-id.base.eth';
const DEFAULT_WALLET = '0x...your-wallet-address';
```

## API Endpoints

The dashboard proxies all Netrum API calls through the backend to handle caching and rate limiting.

| Endpoint | Description |
|----------|-------------|
| `/api/stats` | Network statistics |
| `/api/nodes/active` | List active nodes |
| `/api/node/:nodeId` | Node information |
| `/api/mining/:nodeId` | Mining status |
| `/api/claim/:address/history` | Claim history |
| `/api/dashboard/:nodeId/:address` | Aggregated dashboard data |

## Deployment

### DigitalOcean Droplet

1. SSH into your server
2. Clone the repository
3. Install dependencies: `npm install`
4. Build: `npm run build`
5. Start with PM2: `pm2 start server/index.js --name netrum-dashboard`

### Nginx Configuration

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Project Structure

```
netrum-dashboard/
├── server/
│   └── index.js          # Express backend with caching
├── src/
│   ├── api/
│   │   └── netrum.js     # API client functions
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── NodeSearch.jsx
│   │   ├── StatsGrid.jsx
│   │   ├── NodeInfo.jsx
│   │   ├── MiningStatus.jsx
│   │   ├── ClaimHistory.jsx
│   │   ├── LiveLog.jsx
│   │   ├── NetworkStats.jsx
│   │   ├── RefreshTimer.jsx
│   │   └── Footer.jsx
│   ├── App.jsx           # Main application
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Netrum Developer Challenge

This dashboard was built for the **Netrum Developer Tasks** competition with a **4,000 NPT token prize pool**.

### Evaluation Criteria
- Functionality - All endpoints properly integrated
- User Experience - Intuitive interface and navigation
- Design Quality - Clean, modern, responsive design
- Rate Limit Compliance - Proper 30-second intervals
- Error Handling - Graceful error messages
- Performance - Fast loading and efficient data fetching
- Innovation - Creative features and visualizations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Dipy (BlockClaimed)**
- Twitter: [@BlockClaimed](https://twitter.com/BlockClaimed)
- GitHub: [@laldinpuia](https://github.com/laldinpuia)

---

<div align="center">

Built with ❤️ for the Netrum Community

**[Netrum Labs](https://netrumlabs.com)** | **[Base Network](https://base.org)**

</div>
