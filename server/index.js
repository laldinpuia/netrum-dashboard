import express from 'express';
import cors from 'cors';
import NodeCache from 'node-cache';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const NETRUM_API = 'https://node.netrumlabs.dev';

// Cache with 30-second TTL to comply with rate limits
const cache = new NodeCache({ stdTTL: 30, checkperiod: 10 });

// SSE clients storage
const clients = new Set();

app.use(cors());
app.use(express.json());

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')));
}

// Helper function to fetch from Netrum API with caching
async function fetchWithCache(endpoint, cacheKey) {
  const cached = cache.get(cacheKey);
  if (cached) {
    return { data: cached, fromCache: true };
  }

  try {
    const response = await fetch(`${NETRUM_API}${endpoint}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'NetrumDashboard/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    cache.set(cacheKey, data);
    return { data, fromCache: false };
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error.message);
    throw error;
  }
}

// SSE endpoint for real-time updates
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  clients.add(res);
  console.log(`Client connected. Total clients: ${clients.size}`);

  req.on('close', () => {
    clients.delete(res);
    console.log(`Client disconnected. Total clients: ${clients.size}`);
  });
});

// Broadcast to all SSE clients
function broadcast(event, data) {
  clients.forEach(client => {
    client.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  });
}

// API Routes

// Get overall network stats
app.get('/api/stats', async (req, res) => {
  try {
    const { data, fromCache } = await fetchWithCache('/lite/nodes/stats', 'network-stats');
    res.json({ success: true, data, fromCache, timestamp: Date.now() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get active nodes
app.get('/api/nodes/active', async (req, res) => {
  try {
    const { data, fromCache } = await fetchWithCache('/lite/nodes/active', 'active-nodes');
    res.json({ success: true, data, fromCache, timestamp: Date.now() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get specific node by ID
app.get('/api/node/:nodeId', async (req, res) => {
  const { nodeId } = req.params;
  try {
    const { data, fromCache } = await fetchWithCache(`/lite/nodes/id/${nodeId}`, `node-${nodeId}`);
    res.json({ success: true, data, fromCache, timestamp: Date.now() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get node stats from polling
app.get('/api/node/:nodeId/stats', async (req, res) => {
  const { nodeId } = req.params;
  try {
    const { data, fromCache } = await fetchWithCache(`/polling/node-stats/${nodeId}`, `polling-${nodeId}`);
    res.json({ success: true, data, fromCache, timestamp: Date.now() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get mining status
app.get('/api/mining/:nodeId', async (req, res) => {
  const { nodeId } = req.params;
  try {
    const { data, fromCache } = await fetchWithCache(`/mining/status/${nodeId}`, `mining-${nodeId}`);
    res.json({ success: true, data, fromCache, timestamp: Date.now() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get mining cooldown
app.get('/api/mining/:nodeId/cooldown', async (req, res) => {
  const { nodeId } = req.params;
  try {
    const { data, fromCache } = await fetchWithCache(`/mining/cooldown/${nodeId}`, `cooldown-${nodeId}`);
    res.json({ success: true, data, fromCache, timestamp: Date.now() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get node status from metrics
app.get('/api/metrics/:nodeId/status', async (req, res) => {
  const { nodeId } = req.params;
  try {
    const { data, fromCache } = await fetchWithCache(`/metrics/node-status/${nodeId}`, `metrics-status-${nodeId}`);
    res.json({ success: true, data, fromCache, timestamp: Date.now() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get metrics cooldown check
app.get('/api/metrics/:nodeId/cooldown', async (req, res) => {
  const { nodeId } = req.params;
  try {
    const { data, fromCache } = await fetchWithCache(`/metrics/check-cooldown/${nodeId}`, `metrics-cooldown-${nodeId}`);
    res.json({ success: true, data, fromCache, timestamp: Date.now() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get system requirements
app.get('/api/requirements', async (req, res) => {
  try {
    const { data, fromCache } = await fetchWithCache('/metrics/requirements', 'requirements');
    res.json({ success: true, data, fromCache, timestamp: Date.now() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get registration status
app.get('/api/register/status', async (req, res) => {
  try {
    const { data, fromCache } = await fetchWithCache('/register/status', 'register-status');
    res.json({ success: true, data, fromCache, timestamp: Date.now() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get claim status by wallet address
app.get('/api/claim/:address/status', async (req, res) => {
  const { address } = req.params;
  try {
    const { data, fromCache } = await fetchWithCache(`/claim/status/${address}`, `claim-status-${address}`);
    res.json({ success: true, data, fromCache, timestamp: Date.now() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get claim history by wallet address
app.get('/api/claim/:address/history', async (req, res) => {
  const { address } = req.params;
  try {
    const { data, fromCache } = await fetchWithCache(`/claim/history/${address}`, `claim-history-${address}`);
    res.json({ success: true, data, fromCache, timestamp: Date.now() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get live log status
app.get('/api/live-log/:address', async (req, res) => {
  const { address } = req.params;
  try {
    const { data, fromCache } = await fetchWithCache(`/live-log/status/${address}`, `live-log-${address}`);
    res.json({ success: true, data, fromCache, timestamp: Date.now() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all data for a specific node (aggregated endpoint)
app.get('/api/dashboard/:nodeId/:address', async (req, res) => {
  const { nodeId, address } = req.params;
  
  try {
    const results = await Promise.allSettled([
      fetchWithCache(`/lite/nodes/id/${nodeId}`, `node-${nodeId}`),
      fetchWithCache(`/mining/status/${nodeId}`, `mining-${nodeId}`),
      fetchWithCache(`/mining/cooldown/${nodeId}`, `cooldown-${nodeId}`),
      fetchWithCache(`/metrics/node-status/${nodeId}`, `metrics-status-${nodeId}`),
      fetchWithCache(`/claim/status/${address}`, `claim-status-${address}`),
      fetchWithCache(`/claim/history/${address}`, `claim-history-${address}`),
      fetchWithCache(`/live-log/status/${address}`, `live-log-${address}`),
      fetchWithCache('/lite/nodes/stats', 'network-stats')
    ]);

    const [nodeInfo, miningStatus, miningCooldown, metricsStatus, claimStatus, claimHistory, liveLog, networkStats] = results;

    res.json({
      success: true,
      timestamp: Date.now(),
      data: {
        nodeInfo: nodeInfo.status === 'fulfilled' ? nodeInfo.value.data : null,
        miningStatus: miningStatus.status === 'fulfilled' ? miningStatus.value.data : null,
        miningCooldown: miningCooldown.status === 'fulfilled' ? miningCooldown.value.data : null,
        metricsStatus: metricsStatus.status === 'fulfilled' ? metricsStatus.value.data : null,
        claimStatus: claimStatus.status === 'fulfilled' ? claimStatus.value.data : null,
        claimHistory: claimHistory.status === 'fulfilled' ? claimHistory.value.data : null,
        liveLog: liveLog.status === 'fulfilled' ? liveLog.value.data : null,
        networkStats: networkStats.status === 'fulfilled' ? networkStats.value.data : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Cache info endpoint
app.get('/api/cache/info', (req, res) => {
  const stats = cache.getStats();
  const keys = cache.keys();
  res.json({
    success: true,
    stats,
    cachedKeys: keys.length,
    ttl: 30
  });
});

// Clear cache endpoint (for development)
app.post('/api/cache/clear', (req, res) => {
  cache.flushAll();
  res.json({ success: true, message: 'Cache cleared' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: Date.now(),
    uptime: process.uptime()
  });
});

// Catch-all for SPA routing in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
  });
}

// Background job to refresh cache and broadcast updates
setInterval(async () => {
  try {
    const { data } = await fetchWithCache('/lite/nodes/stats', 'network-stats');
    broadcast('stats-update', data);
  } catch (error) {
    console.error('Background refresh error:', error.message);
  }
}, 35000); // Slightly longer than cache TTL

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════════════╗
  ║     Netrum Dashboard Server Running                   ║
  ║     Port: ${PORT}                                        ║
  ║     API: http://localhost:${PORT}/api                    ║
  ╚═══════════════════════════════════════════════════════╝
  `);
});
