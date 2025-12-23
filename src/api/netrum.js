const API_BASE = '/api';

let ethPriceCache = { price: null, timestamp: 0 };

// Netrum logo as base64 (orange swirl logo)
const NETRUM_LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62, ...truncated for brevity';

export async function fetchEthPrice() {
  const now = Date.now();
  if (ethPriceCache.price && now - ethPriceCache.timestamp < 300000) {
    return ethPriceCache.price;
  }
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await response.json();
    ethPriceCache = { price: data.ethereum.usd, timestamp: now };
    return data.ethereum.usd;
  } catch (error) {
    return ethPriceCache.price || 3000;
  }
}

export async function fetchStats() {
  const response = await fetch(API_BASE + '/stats');
  return response.json();
}

export async function fetchActiveNodes() {
  const response = await fetch(API_BASE + '/nodes/active');
  return response.json();
}

export async function fetchNodeInfo(nodeId) {
  const response = await fetch(API_BASE + '/node/' + encodeURIComponent(nodeId));
  return response.json();
}

export async function fetchClaimHistory(wallet) {
  const response = await fetch(API_BASE + '/claim/' + wallet + '/history');
  return response.json();
}

export async function fetchMiningStatus(nodeId) {
  const response = await fetch(API_BASE + '/mining/' + encodeURIComponent(nodeId));
  return response.json();
}

export async function fetchTokenData(wallet) {
  try {
    const response = await fetch(API_BASE + '/tokens/' + wallet);
    return response.json();
  } catch (error) {
    return { totalClaims: 0, totalNptClaimed: 0, recentClaims: [] };
  }
}

export async function fetchMiningDebug(wallet) {
  try {
    const response = await fetch(API_BASE + '/mining-debug/' + wallet);
    return response.json();
  } catch (error) {
    return { success: false };
  }
}

export function formatDateDMY(dateStr) {
  if (!dateStr) return '--';
  var date = new Date(dateStr);
  if (isNaN(date.getTime())) return '--';
  var day = date.getDate().toString().padStart(2, '0');
  var month = (date.getMonth() + 1).toString().padStart(2, '0');
  var year = date.getFullYear();
  return day + '/' + month + '/' + year;
}

export function formatDateTimeDMY(dateStr) {
  if (!dateStr) return '--';
  var date = new Date(dateStr);
  if (isNaN(date.getTime())) return '--';
  var day = date.getDate().toString().padStart(2, '0');
  var month = (date.getMonth() + 1).toString().padStart(2, '0');
  var year = date.getFullYear();
  var hours = date.getHours();
  var minutes = date.getMinutes().toString().padStart(2, '0');
  var seconds = date.getSeconds().toString().padStart(2, '0');
  var ampm = hours >= 12 ? 'PM' : 'AM';
  var hour12 = hours % 12 || 12;
  return day + '/' + month + '/' + year + ', ' + hour12 + ':' + minutes + ':' + seconds + ' ' + ampm;
}

export function formatTimestampDMY(timestamp) {
  if (!timestamp) return '--';
  var date = new Date(parseInt(timestamp) * 1000);
  if (isNaN(date.getTime())) return '--';
  var day = date.getDate().toString().padStart(2, '0');
  var month = (date.getMonth() + 1).toString().padStart(2, '0');
  var year = date.getFullYear();
  var hours = date.getHours();
  var minutes = date.getMinutes().toString().padStart(2, '0');
  var ampm = hours >= 12 ? 'PM' : 'AM';
  var hour12 = hours % 12 || 12;
  return day + '/' + month + '/' + year + ', ' + hour12 + ':' + minutes + ' ' + ampm;
}

export function exportToJSON(data, filename) {
  var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = filename + '-' + Date.now() + '.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToCSV(data, filename) {
  if (!Array.isArray(data) || data.length === 0) return;
  var headers = Object.keys(data[0]);
  var csvRows = [headers.join(',')];
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var values = [];
    for (var j = 0; j < headers.length; j++) {
      var escaped = String(row[headers[j]] || '').replace(/"/g, '""');
      values.push(escaped.includes(',') ? '"' + escaped + '"' : escaped);
    }
    csvRows.push(values.join(','));
  }
  var blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = filename + '-' + Date.now() + '.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportToPDF(data, node, miningStatus, ethPrice, filename) {
  const { jsPDF } = await import('jspdf');
  var doc = new jsPDF('p', 'mm', 'a4');
  var pageWidth = 210;
  var pageHeight = 297;
  var margin = 15;
  var colWidth = (pageWidth - margin * 3) / 2;

  // Colors
  var bgDark = [15, 23, 42];
  var cardBg = [30, 41, 59];
  var orange = [249, 115, 22];
  var white = [255, 255, 255];
  var gray = [148, 163, 184];
  var green = [34, 197, 94];

  // Background
  doc.setFillColor(bgDark[0], bgDark[1], bgDark[2]);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Header with logo placeholder (orange circle with swirl effect)
  doc.setFillColor(orange[0], orange[1], orange[2]);
  doc.circle(pageWidth / 2, 30, 15, 'F');
  // Inner swirl effect
  doc.setFillColor(bgDark[0], bgDark[1], bgDark[2]);
  doc.circle(pageWidth / 2 - 3, 30, 8, 'F');
  doc.setFillColor(orange[0], orange[1], orange[2]);
  doc.circle(pageWidth / 2 + 2, 28, 4, 'F');

  // Title
  doc.setTextColor(white[0], white[1], white[2]);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Netrum AI', pageWidth / 2, 55, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(gray[0], gray[1], gray[2]);
  doc.text('Node Dashboard Report', pageWidth / 2, 62, { align: 'center' });
  doc.setTextColor(orange[0], orange[1], orange[2]);
  doc.setFontSize(10);
  doc.text('https://dipy.me', pageWidth / 2, 69, { align: 'center' });

  // Generated date
  var now = new Date();
  var dateStr = now.getDate().toString().padStart(2, '0') + '/' + (now.getMonth() + 1).toString().padStart(2, '0') + '/' + now.getFullYear() + ', ' + now.toLocaleTimeString();
  doc.setTextColor(gray[0], gray[1], gray[2]);
  doc.setFontSize(9);
  doc.text('Generated: ' + dateStr, pageWidth - margin, 25, { align: 'right' });

  // Divider line
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.5);
  doc.line(margin, 78, pageWidth - margin, 78);

  var yPos = 88;
  var metrics = node.nodeMetrics || {};
  var mining = miningStatus || {};
  var miningInfo = mining.miningStatus || {};
  var contractDetails = mining.contractDetails || {};
  var miningData = contractDetails.miningInfo || {};

  // Helper function to draw card with orange left border
  function drawCard(x, y, w, h, title) {
    doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
    doc.roundedRect(x, y, w, h, 3, 3, 'F');
    doc.setFillColor(orange[0], orange[1], orange[2]);
    doc.rect(x, y + 3, 4, h - 6, 'F');
    doc.setTextColor(orange[0], orange[1], orange[2]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(title, x + 10, y + 10);
    return y + 18;
  }

  function addRow(x, y, label, value, isGreen) {
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(label, x + 10, y);
    if (isGreen) {
      doc.setTextColor(green[0], green[1], green[2]);
    } else {
      doc.setTextColor(white[0], white[1], white[2]);
    }
    doc.text(String(value), x + 55, y);
    return y + 6;
  }

  // Node Information Card (Left)
  var cardH = 55;
  var cardY = drawCard(margin, yPos, colWidth, cardH, 'Node Information');
  cardY = addRow(margin, cardY, 'Node ID:', node.nodeId || '--', false);
  cardY = addRow(margin, cardY, 'Wallet:', node.wallet ? node.wallet.slice(0, 12) + '...' + node.wallet.slice(-6) : '--', false);
  cardY = addRow(margin, cardY, 'Status:', node.nodeStatus || '--', node.nodeStatus === 'Active');
  cardY = addRow(margin, cardY, 'Sync Status:', node.syncStatus || '--', node.syncStatus === 'Active');
  var regDate = node.createdAt ? new Date(node.createdAt) : null;
  var regStr = regDate ? regDate.getDate().toString().padStart(2, '0') + '/' + (regDate.getMonth() + 1).toString().padStart(2, '0') + '/' + regDate.getFullYear() : '--';
  cardY = addRow(margin, cardY, 'Registered:', regStr, false);
  addRow(margin, cardY, 'Type:', node.type || 'Lite', false);

  // Performance Statistics Card (Right)
  var rightX = margin + colWidth + margin;
  cardY = drawCard(rightX, yPos, colWidth, cardH, 'Performance Statistics');
  cardY = addRow(rightX, cardY, 'Total Tasks:', node.taskCount ? node.taskCount.toLocaleString() : '0', false);
  cardY = addRow(rightX, cardY, 'Sync Count:', node.syncCount ? node.syncCount.toLocaleString() : '0', false);
  cardY = addRow(rightX, cardY, 'Total Claims:', data.totalClaims || '0', false);
  cardY = addRow(rightX, cardY, 'TTS Power:', node.ttsPowerStatus ? 'Available' : '--', node.ttsPowerStatus);
  cardY = addRow(rightX, cardY, 'Available RAM TTS:', node.availableRamForTTS ? node.availableRamForTTS + ' GB' : '--', false);
  addRow(rightX, cardY, 'System Permission:', node.systemPermission ? 'Yes' : 'No', node.systemPermission);

  yPos += cardH + 8;

  // System Metrics Card (Left)
  cardH = 45;
  cardY = drawCard(margin, yPos, colWidth, cardH, 'System Metrics');
  cardY = addRow(margin, cardY, 'CPU Cores:', metrics.cpu || '--', false);
  cardY = addRow(margin, cardY, 'RAM:', metrics.ram ? (metrics.ram / 1024).toFixed(1) + ' GB' : '--', false);
  cardY = addRow(margin, cardY, 'Disk:', metrics.disk ? metrics.disk + ' GB' : '--', false);
  cardY = addRow(margin, cardY, 'Download Speed:', metrics.speed ? metrics.speed.toFixed(0) + ' Mbps' : '--', false);
  addRow(margin, cardY, 'Upload Speed:', metrics.uploadSpeed ? metrics.uploadSpeed.toFixed(0) + ' Mbps' : '--', false);

  // Mining Status Card (Right)
  cardY = drawCard(rightX, yPos, colWidth, cardH, 'Mining Status');
  var canMine = miningInfo.canStartMining || false;
  cardY = addRow(rightX, cardY, 'Mining Status:', canMine ? 'Ready' : 'Not Ready', canMine);
  cardY = addRow(rightX, cardY, 'Contract Status:', miningInfo.contractStatus === 'active' ? 'Active' : 'Inactive', miningInfo.contractStatus === 'active');
  cardY = addRow(rightX, cardY, 'Cooldown Active:', miningInfo.cooldownActive ? 'Yes' : 'No', !miningInfo.cooldownActive);
  var walletBal = contractDetails.walletBalanceEth || 0;
  var usdVal = ethPrice ? ' ($' + (walletBal * ethPrice).toFixed(2) + ')' : '';
  cardY = addRow(rightX, cardY, 'Wallet Balance:', walletBal.toFixed(6) + ' ETH' + usdVal, false);
  var pendingNPT = miningData.pendingRewards ? (parseInt(miningData.pendingRewards) / 1e18).toFixed(4) : '0.0000';
  addRow(rightX, cardY, 'Pending Rewards:', pendingNPT + ' NPT', false);

  yPos += cardH + 8;

  // Requirements Check Card (Full width with orange top border)
  doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.roundedRect(margin, yPos, pageWidth - margin * 2, 42, 3, 3, 'F');
  doc.setFillColor(orange[0], orange[1], orange[2]);
  doc.rect(margin, yPos, pageWidth - margin * 2, 4, 'F');
  doc.setTextColor(orange[0], orange[1], orange[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Requirements Check', margin + 10, yPos + 14);

  var reqY = yPos + 22;
  var reqItems = [
    { label: 'CPU', req: '2', actual: metrics.cpu || 0, ok: (metrics.cpu || 0) >= 2 },
    { label: 'RAM', req: '4GB', actual: (metrics.ram ? (metrics.ram / 1024).toFixed(1) : '0') + 'GB', ok: (metrics.ram || 0) >= 4096 },
    { label: 'Disk', req: '50GB', actual: (metrics.disk || 0) + 'GB', ok: (metrics.disk || 0) >= 50 },
    { label: 'Download', req: '5Mbps', actual: (metrics.speed ? metrics.speed.toFixed(0) : '0') + 'Mbps', ok: (metrics.speed || 0) >= 5 },
    { label: 'Upload', req: '5Mbps', actual: (metrics.uploadSpeed ? metrics.uploadSpeed.toFixed(0) : '0') + 'Mbps', ok: (metrics.uploadSpeed || 0) >= 5 }
  ];

  var reqColWidth = (pageWidth - margin * 2 - 20) / 5;
  for (var i = 0; i < reqItems.length; i++) {
    var item = reqItems[i];
    var reqX = margin + 10 + i * reqColWidth;
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(item.label, reqX, reqY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Req: ' + item.req, reqX, reqY + 5);
    doc.text('Actual: ' + item.actual, reqX, reqY + 10);
    if (item.ok) {
      doc.setTextColor(green[0], green[1], green[2]);
      doc.text('PASS', reqX, reqY + 15);
    } else {
      doc.setTextColor(239, 68, 68);
      doc.text('FAIL', reqX, reqY + 15);
    }
  }

  yPos += 50;

  // Last Claim Details Card
  var lastClaim = data.lastClaim || {};
  if (lastClaim.timestamp || node.taskCount) {
    doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
    doc.roundedRect(margin, yPos, pageWidth - margin * 2, 28, 3, 3, 'F');
    doc.setFillColor(orange[0], orange[1], orange[2]);
    doc.rect(margin, yPos, 4, 28, 'F');
    doc.setTextColor(orange[0], orange[1], orange[2]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Last Claim Details', margin + 10, yPos + 10);

    var claimDate = lastClaim.timestamp ? new Date(lastClaim.timestamp) : null;
    var claimStr = claimDate ? claimDate.getDate().toString().padStart(2, '0') + '/' + (claimDate.getMonth() + 1).toString().padStart(2, '0') + '/' + claimDate.getFullYear() + ', ' + claimDate.toLocaleTimeString() : '--';

    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Date: ' + claimStr, margin + 10, yPos + 18);
    doc.text('Node: ' + (lastClaim.nodeId || node.nodeId || '--'), margin + 10, yPos + 24);
    doc.text('Tasks at Claim: ' + (lastClaim.taskCountAtTime ? lastClaim.taskCountAtTime.toLocaleString() : (node.taskCount ? node.taskCount.toLocaleString() : '--')), margin + 110, yPos + 18);

    yPos += 35;
  }

  // Sync History Summary Card
  var syncHistory = node.syncHistory || [];
  if (syncHistory.length > 0 || node.syncCount) {
    doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
    doc.roundedRect(margin, yPos, pageWidth - margin * 2, 22, 3, 3, 'F');
    doc.setFillColor(orange[0], orange[1], orange[2]);
    doc.rect(margin, yPos, 4, 22, 'F');
    doc.setTextColor(orange[0], orange[1], orange[2]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Sync History Summary', margin + 10, yPos + 10);

    var activeCount = 0;
    for (var j = 0; j < syncHistory.length; j++) {
      if (syncHistory[j].status === 'Active' || syncHistory[j].meetsRequirements) {
        activeCount++;
      }
    }
    var totalSyncs = syncHistory.length || node.syncCount || 0;
    var uptimeRate = totalSyncs > 0 ? ((activeCount / totalSyncs) * 100).toFixed(1) : '0';

    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Recent Syncs: ' + totalSyncs, margin + 10, yPos + 18);
    doc.text('Active Syncs: ' + activeCount, margin + 60, yPos + 18);
    doc.setTextColor(green[0], green[1], green[2]);
    doc.text('Uptime Rate: ' + uptimeRate + '%', margin + 110, yPos + 18);
  }

  // Footer
  doc.setFillColor(cardBg[0], cardBg[1], cardBg[2]);
  doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
  doc.setTextColor(white[0], white[1], white[2]);
  doc.setFontSize(10);
  doc.text('Netrum AI Node Dashboard', pageWidth / 2, pageHeight - 12, { align: 'center' });
  doc.setTextColor(orange[0], orange[1], orange[2]);
  doc.setFontSize(9);
  doc.text('Built by D.i.PY™ | https://dipy.me', pageWidth / 2, pageHeight - 6, { align: 'center' });

  doc.save(filename + '-' + Date.now() + '.pdf');
}
