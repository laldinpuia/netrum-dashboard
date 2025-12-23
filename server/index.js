import express from 'express';
import cors from 'cors';
import NodeCache from 'node-cache';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const cache = new NodeCache({ stdTTL: 300 });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

const NETRUM_API = 'https://node.netrumlabs.dev';
const ETHERSCAN_API = 'https://api.etherscan.io/v2/api';
const ETHERSCAN_KEY = 'M1JPZBESM3D2DTMMJ9T33D4YIGQ39HNJEK';
const BASE_CHAINID = 8453;
const NPT_CONTRACT = '0xb8c2ce84f831175136cebbfd48ce4bab9c7a6424';

let nodesCache = { data: null, loading: false, lastFetch: 0 };

async function fetchWithTimeout(url, timeout = 30000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

function fetchNodesBackground() {
  if (nodesCache.loading) return;
  if (Date.now() - nodesCache.lastFetch < 300000 && nodesCache.data) return;
  
  nodesCache.loading = true;
  console.log('Background: Fetching nodes...');
  
  fetchWithTimeout(NETRUM_API + '/nodes?limit=2000', 90000)
    .then(res => res.json())
    .then(data => {
      if (data.success && data.nodes) {
        nodesCache.data = data;
        nodesCache.lastFetch = Date.now();
        console.log('Background: Fetched ' + data.nodes.length + ' nodes');
      }
    })
    .catch(err => console.error('Background fetch error:', err.message))
    .finally(() => { nodesCache.loading = false; });
}

fetchNodesBackground();
setInterval(fetchNodesBackground, 300000);

function findNodeFromCache(identifier) {
  if (!nodesCache.data || !nodesCache.data.nodes) return null;
  const lower = identifier.toLowerCase();
  return nodesCache.data.nodes.find(n => 
    n.nodeId.toLowerCase() === lower || n.wallet.toLowerCase() === lower
  );
}

async function fetchMiningDebug(wallet) {
  const cacheKey = 'mining_' + wallet.toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetchWithTimeout(NETRUM_API + '/mining/debug/contract/' + wallet, 15000);
    if (!response.ok) return { success: false };
    const data = await response.json();
    if (data.success) cache.set(cacheKey, data, 60);
    return data;
  } catch (error) {
    return { success: false };
  }
}

async function fetchTokenTransfers(wallet) {
  const cacheKey = 'tokens_' + wallet.toLowerCase();
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const url = ETHERSCAN_API + '?chainid=' + BASE_CHAINID + '&module=account&action=tokentx&contractaddress=' + NPT_CONTRACT + '&address=' + wallet + '&page=1&offset=1000&sort=desc&apikey=' + ETHERSCAN_KEY;
    const response = await fetchWithTimeout(url, 15000);
    const data = await response.json();
    if (data.status === '1') cache.set(cacheKey, data, 300);
    return data;
  } catch (error) {
    return null;
  }
}

app.get('/api/stats', (req, res) => {
  fetchNodesBackground();
  if (nodesCache.data && nodesCache.data.nodes) {
    const nodes = nodesCache.data.nodes;
    const active = nodes.filter(n => n.nodeStatus === 'Active').length;
    const tasks = nodes.reduce((s, n) => s + (n.taskCount || 0), 0);
    res.json({ totalNodes: nodes.length, activeNodes: active, inactiveNodes: nodes.length - active, totalTasks: tasks });
  } else {
    res.json({ totalNodes: '--', activeNodes: '--', inactiveNodes: '--', totalTasks: '--' });
  }
});

app.get('/api/nodes/active', (req, res) => {
  fetchNodesBackground();
  if (nodesCache.data && nodesCache.data.nodes) {
    const active = nodesCache.data.nodes.filter(n => n.nodeStatus === 'Active');
    res.json({ count: active.length, nodes: active.slice(0, 10) });
  } else {
    res.json({ count: 0, nodes: [] });
  }
});

app.get('/api/node/:nodeId', (req, res) => {
  fetchNodesBackground();
  const node = findNodeFromCache(req.params.nodeId);
  res.json({ node: node || null });
});

app.get('/api/claim/:wallet/history', async (req, res) => {
  const wallet = req.params.wallet;
  const data = await fetchTokenTransfers(wallet);
  
  if (!data || data.status !== '1' || !data.result) {
    return res.json({ totalClaims: 0, lastClaim: null });
  }

  const claims = data.result.filter(tx => tx.to.toLowerCase() === wallet.toLowerCase());
  let lastClaim = null;
  
  if (claims.length > 0) {
    const node = findNodeFromCache(wallet);
    lastClaim = {
      timestamp: new Date(parseInt(claims[0].timeStamp) * 1000).toISOString(),
      amount: parseFloat(claims[0].value) / 1e18,
      txHash: claims[0].hash,
      nodeId: node ? node.nodeId : null,
      taskCountAtTime: node ? node.taskCount : null
    };
  }

  res.json({ totalClaims: claims.length, lastClaim: lastClaim });
});

app.get('/api/mining/:nodeId', async (req, res) => {
  const node = findNodeFromCache(req.params.nodeId);
  const wallet = node ? node.wallet : req.params.nodeId;
  
  const debug = await fetchMiningDebug(wallet);
  const info = debug.contract?.miningInfo || {};
  
  res.json({
    miningStatus: {
      canStartMining: info.isActive || false,
      contractStatus: info.isActive ? 'active' : 'inactive',
      cooldownActive: false,
      lastMiningStart: node?.lastMiningStart || null
    },
    contractDetails: {
      walletBalanceEth: debug.wallet?.balanceEth || 0,
      miningInfo: {
        minedTokens: info.minedTokensFormatted || 0,
        speedPerSec: info.speedPerSec || '0',
        percentComplete: info.percentCompleteNumber || 0,
        isActive: info.isActive || false,
        pendingRewards: info.minedTokens || '0'
      }
    }
  });
});

app.get('/api/tokens/:wallet', async (req, res) => {
  const wallet = req.params.wallet;
  const data = await fetchTokenTransfers(wallet);
  
  if (!data || data.status !== '1' || !data.result) {
    return res.json({ totalClaims: 0, totalNptClaimed: 0, recentClaims: [] });
  }

  const claims = data.result.filter(tx => tx.to.toLowerCase() === wallet.toLowerCase());
  let total = 0;
  claims.forEach(c => total += parseFloat(c.value) / 1e18);

  res.json({ totalClaims: claims.length, totalNptClaimed: total, recentClaims: claims.slice(0, 10) });
});

app.get('/api/mining-debug/:wallet', async (req, res) => {
  res.json(await fetchMiningDebug(req.params.wallet));
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    version: '1.0.9', 
    nodesLoaded: nodesCache.data ? nodesCache.data.nodes.length : 0,
    timestamp: new Date().toISOString() 
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Netrum Dashboard v1.0.9 running on port ' + PORT));
