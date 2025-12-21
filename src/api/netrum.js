const API_BASE = '/api';

async function fetchApi(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'API request failed');
  }
  
  return data.data;
}

export async function fetchDashboardData(nodeId, walletAddress) {
  const response = await fetch(`${API_BASE}/dashboard/${encodeURIComponent(nodeId)}/${encodeURIComponent(walletAddress)}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch dashboard data');
  }
  
  return data.data;
}

export async function fetchNetworkStats() {
  return fetchApi('/stats');
}

export async function fetchActiveNodes() {
  return fetchApi('/nodes/active');
}

export async function fetchNodeInfo(nodeId) {
  return fetchApi(`/node/${encodeURIComponent(nodeId)}`);
}

export async function fetchNodeStats(nodeId) {
  return fetchApi(`/node/${encodeURIComponent(nodeId)}/stats`);
}

export async function fetchMiningStatus(nodeId) {
  return fetchApi(`/mining/${encodeURIComponent(nodeId)}`);
}

export async function fetchMiningCooldown(nodeId) {
  return fetchApi(`/mining/${encodeURIComponent(nodeId)}/cooldown`);
}

export async function fetchMetricsStatus(nodeId) {
  return fetchApi(`/metrics/${encodeURIComponent(nodeId)}/status`);
}

export async function fetchClaimStatus(address) {
  return fetchApi(`/claim/${encodeURIComponent(address)}/status`);
}

export async function fetchClaimHistory(address) {
  return fetchApi(`/claim/${encodeURIComponent(address)}/history`);
}

export async function fetchLiveLog(address) {
  return fetchApi(`/live-log/${encodeURIComponent(address)}`);
}

export async function fetchRequirements() {
  return fetchApi('/requirements');
}

// Export data to different formats
export function exportToJSON(data, filename = 'netrum-data') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToCSV(data, filename = 'netrum-data') {
  if (!Array.isArray(data) || data.length === 0) {
    console.error('Data must be a non-empty array');
    return;
  }
  
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        const escaped = String(value).replace(/"/g, '""');
        return escaped.includes(',') ? `"${escaped}"` : escaped;
      }).join(',')
    )
  ];
  
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
