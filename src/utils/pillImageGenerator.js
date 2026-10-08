/**
 * SwasthyaMitra Photorealistic Pill & Blister Strip Image Generator
 * Generates high-fidelity SVG visual images for both:
 * 1. Full Pharmaceutical Blister Strips (Complete Pack)
 * 2. Scissored & Severed Cut Pill Blister Strips (Torn Edge, Cut Cavities)
 * 
 * Works 100% offline, zero latency, high-resolution vector output.
 */

function escapeXml(unsafe) {
  if (unsafe === undefined || unsafe === null) return '';
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function parsePrice(val, fallback = 30.0) {
  if (typeof val === 'number') return val;
  const parsed = parseFloat(val);
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Generates an SVG Data URI for a Full Pharmaceutical Blister Strip
 */
export function generateFullStripSvg(med = {}) {
  const width = 420;
  const height = 260;
  const medName = med.name || med.medicineName || med.title || 'Medicine';
  const medGeneric = med.generic || med.genericName || med.salt || '';
  const dosageForm = med.dosageForm || med.form || 'Tablet Strip';
  const batchNo = med.batchNo || med.batch || 'BT-2026';
  const mfgDate = med.mfgDate || med.mfg || '01/2025';
  const expDate = med.expDate || med.exp || '12/2027';
  const mrpNum = parsePrice(med.mrp, 35.0);
  const janNum = parsePrice(med.janAushadhiPrice, 8.5);

  const pillColor = med.pillColor || '#ffffff';
  const pillShape = med.pillShape || 'round';
  const isAluAlu = med.packType === 'alu-alu';
  const cavitiesTotal = Math.min(med.cavitiesTotal || 10, 15);
  const cols = cavitiesTotal > 10 ? 5 : cavitiesTotal > 6 ? 5 : 4;
  const rows = Math.ceil(cavitiesTotal / cols);

  const nameLower = (medName || '').toLowerCase();
  const genericLower = (medGeneric || '').toLowerCase();

  // Determine secondary capsule color if dual-tone
  let secondaryColor = '#fef08a'; // gold/ivory
  if (genericLower.includes('amox') || nameLower.includes('mox')) {
    secondaryColor = '#fef08a';
  } else if (nameLower.includes('pan-d')) {
    secondaryColor = '#ffffff';
  } else {
    secondaryColor = pillColor;
  }

  // Pill debossed imprint label
  let imprint = 'Rx';
  if (nameLower.includes('dolo')) imprint = 'DOLO 650';
  else if (nameLower.includes('mox')) imprint = 'AMOX 500';
  else if (nameLower.includes('calpol')) imprint = 'CALPOL';
  else if (nameLower.includes('pan 40') || nameLower.includes('pantocid') || nameLower.includes('pan-')) imprint = 'PAN 40';
  else if (nameLower.includes('augmentin')) imprint = 'AUG 625';
  else if (nameLower.includes('azee') || nameLower.includes('azith')) imprint = 'AZI 500';
  else if (nameLower.includes('glycomet') || nameLower.includes('metformin')) imprint = 'M 500';
  else if (nameLower.includes('combiflam')) imprint = 'CF 400';
  else if (nameLower.includes('cetzine')) imprint = 'CET 10';

  // Render cavity pills
  let pillsSvg = '';
  const startX = 55;
  const startY = 85;
  const spacingX = 64;
  const spacingY = 68;

  let pillIndex = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (pillIndex >= cavitiesTotal) break;
      const cx = startX + c * spacingX;
      const cy = startY + r * spacingY;

      let pillElem = '';
      if (pillShape === 'capsule') {
        pillElem = `
          <!-- Blister Cavity Pocket -->
          <rect x="${cx - 16}" y="${cy - 26}" width="32" height="52" rx="16" fill="url(#pocketGrad)" stroke="#94a3b8" stroke-width="1.2" filter="url(#dropShad)" />
          <!-- Two-Piece Hard Gelatin Capsule -->
          <!-- Upper Half Cap -->
          <path d="M ${cx - 11} ${cy} C ${cx - 11} ${cy - 20}, ${cx + 11} ${cy - 20}, ${cx + 11} ${cy} Z" fill="${pillColor}" />
          <!-- Lower Half Body -->
          <path d="M ${cx - 11} ${cy} C ${cx - 11} ${cy + 20}, ${cx + 11} ${cy + 20}, ${cx + 11} ${cy} Z" fill="${secondaryColor}" />
          <!-- Central Sealing Band -->
          <rect x="${cx - 12}" y="${cy - 2}" width="24" height="4" rx="2" fill="#000000" opacity="0.18" />
          <!-- Capsule Specular Glaze Highlight -->
          <path d="M ${cx - 7} ${cy - 16} Q ${cx - 7} ${cy + 16} ${cx - 5} ${cy + 16}" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.6" fill="none" />
        `;
      } else if (pillShape === 'caplet' || pillShape === 'oval') {
        pillElem = `
          <!-- Blister Cavity Pocket -->
          <rect x="${cx - 24}" y="${cy - 15}" width="48" height="30" rx="14" fill="url(#pocketGrad)" stroke="#94a3b8" stroke-width="1.2" filter="url(#dropShad)" />
          <!-- Oblong Caplet Tablet -->
          <rect x="${cx - 20}" y="${cy - 11}" width="40" height="22" rx="10" fill="${pillColor}" stroke="#cbd5e1" stroke-width="0.8" />
          <!-- Debossed Center Bisect Scoreline -->
          <line x1="${cx}" y1="${cy - 10}" x2="${cx}" y2="${cy + 10}" stroke="#94a3b8" stroke-width="1.2" opacity="0.8" />
          <!-- Tablet Imprint Text -->
          <text x="${cx - 8}" y="${cy + 3}" font-family="monospace" font-size="6" font-weight="900" fill="#64748b" text-anchor="middle" opacity="0.85">${imprint.split(' ')[0]}</text>
          <!-- Specular Light Sheen -->
          <ellipse cx="${cx - 10}" cy="${cy - 5}" rx="7" ry="2" fill="#ffffff" opacity="0.75" />
        `;
      } else {
        // Round Circular Tablet
        pillElem = `
          <!-- Blister Cavity Pocket -->
          <circle cx="${cx}" cy="${cy}" r="20" fill="url(#pocketGrad)" stroke="#94a3b8" stroke-width="1.2" filter="url(#dropShad)" />
          <!-- Domed Round Tablet -->
          <circle cx="${cx}" cy="${cy}" r="16" fill="${pillColor}" stroke="#cbd5e1" stroke-width="0.8" />
          <!-- Tablet Bevel Rim -->
          <circle cx="${cx}" cy="${cy}" r="13" fill="none" stroke="#000000" stroke-width="0.6" opacity="0.12" />
          <!-- Bisect Groove or Stamped Code -->
          <line x1="${cx - 12}" y1="${cy}" x2="${cx + 12}" y2="${cy}" stroke="#94a3b8" stroke-width="1" opacity="0.7" />
          <text x="${cx}" y="${cy - 4}" font-family="monospace" font-size="5.5" font-weight="900" fill="#64748b" text-anchor="middle" opacity="0.85">${imprint.split(' ')[0]}</text>
          <!-- Specular Highlight -->
          <ellipse cx="${cx - 5}" cy="${cy - 6}" rx="6" ry="3" fill="#ffffff" opacity="0.7" />
        `;
      }

      pillsSvg += pillElem;
      pillIndex++;
    }
  }

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
      <defs>
        <!-- Metallic Foil Gradient -->
        <linearGradient id="foilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${isAluAlu ? '#94a3b8' : '#e2e8f0'}" />
          <stop offset="25%" stop-color="${isAluAlu ? '#cbd5e1' : '#f8fafc'}" />
          <stop offset="50%" stop-color="${isAluAlu ? '#64748b' : '#cbd5e1'}" />
          <stop offset="75%" stop-color="${isAluAlu ? '#94a3b8' : '#e2e8f0'}" />
          <stop offset="100%" stop-color="${isAluAlu ? '#475569' : '#94a3b8'}" />
        </linearGradient>

        <!-- Blister Pocket Gradient -->
        <radialGradient id="pocketGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
          <stop offset="60%" stop-color="#cbd5e1" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#64748b" stop-opacity="0.8" />
        </radialGradient>

        <!-- Micro Knurling Foil Pattern -->
        <pattern id="knurlPattern" width="4" height="4" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="4" y2="4" stroke="#475569" stroke-width="0.3" opacity="0.3" />
          <line x1="4" y1="0" x2="4" y2="4" stroke="#475569" stroke-width="0.3" opacity="0.3" />
        </pattern>

        <!-- Drop Shadow Filter -->
        <filter id="dropShad" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#0f172a" flood-opacity="0.35" />
        </filter>
      </defs>

      <!-- Main Blister Card Foil Body -->
      <rect x="8" y="8" width="${width - 16}" height="${height - 16}" rx="16" fill="url(#foilGrad)" stroke="#64748b" stroke-width="2" filter="url(#dropShad)" />
      <!-- Knurling Texture Overlay -->
      <rect x="8" y="8" width="${width - 16}" height="${height - 16}" rx="16" fill="url(#knurlPattern)" />

      <!-- Left Schedule H / Caution Red Warning Ribbon -->
      <rect x="8" y="8" width="16" height="${height - 16}" rx="4" fill="#dc2626" opacity="0.92" />
      <text x="${-height / 2}" y="19" transform="rotate(-90)" font-family="sans-serif" font-size="7.5" font-weight="900" fill="#ffffff" letter-spacing="1.5">SCHEDULE H PRESCRIPTION DRUG - PMBJP</text>

      <!-- Top Header Strip -->
      <rect x="28" y="14" width="${width - 40}" height="32" rx="8" fill="#0f172a" opacity="0.08" />
      <text x="36" y="29" font-family="sans-serif" font-size="12" font-weight="900" fill="#0f172a">${escapeXml(medName.toUpperCase())}</text>
      <text x="36" y="41" font-family="sans-serif" font-size="8.5" font-weight="700" fill="#334155">${escapeXml(medGeneric)} • ${escapeXml(dosageForm)}</text>
      
      <!-- PMBJP Official Seal Badge -->
      <rect x="${width - 130}" y="18" width="112" height="22" rx="6" fill="#047857" opacity="0.9" />
      <text x="${width - 74}" y="32" font-family="sans-serif" font-size="7.5" font-weight="900" fill="#ffffff" text-anchor="middle">PMBJP JAN AUSHADHI</text>

      <!-- Rendered Pills Grid -->
      <g id="blister-cavities">
        ${pillsSvg}
      </g>

      <!-- Bottom Crimped Foil Edge with Stamped Batch and Expiry -->
      <rect x="28" y="${height - 36}" width="${width - 40}" height="22" rx="6" fill="#000000" opacity="0.12" />
      <text x="36" y="${height - 22}" font-family="monospace" font-size="8.5" font-weight="900" fill="#0f172a">B.NO: ${escapeXml(batchNo)}  MFG: ${escapeXml(mfgDate)}  EXP: ${escapeXml(expDate)}</text>
      <text x="${width - 24}" y="${height - 22}" font-family="monospace" font-size="8" font-weight="800" fill="#475569" text-anchor="end">MRP ₹${mrpNum.toFixed(2)} | PMBJP ₹${janNum.toFixed(2)}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
}

/**
 * Generates an SVG Data URI for a Scissored / Severed Cut Pill Blister Strip
 * Features realistic sheared cut-edges, scissor guide line, clipped cavities, and severed stamps.
 */
export function generateScissoredStripSvg(med = {}) {
  const width = 380;
  const height = 240;
  const medName = med.name || med.medicineName || med.title || 'Medicine';
  const medGeneric = med.generic || med.genericName || med.salt || '';
  const batchNo = med.batchNo || med.batch || 'BT-2026';
  const expDate = med.expDate || med.exp || '12/2027';

  const pillColor = med.pillColor || '#ffffff';
  const pillShape = med.pillShape || 'round';
  const isAluAlu = med.packType === 'alu-alu';
  const cavitiesRemaining = Math.max(1, Math.min(med.cavitiesRemaining || 3, 4));
  const isExpired = med.status === 'EXPIRED';

  const nameLower = (medName || '').toLowerCase();
  const genericLower = (medGeneric || '').toLowerCase();

  let secondaryColor = '#fef08a';
  if (genericLower.includes('amox') || nameLower.includes('mox')) {
    secondaryColor = '#fef08a';
  } else if (nameLower.includes('pan-d')) {
    secondaryColor = '#ffffff';
  } else {
    secondaryColor = pillColor;
  }

  let imprint = 'Rx';
  if (nameLower.includes('dolo')) imprint = 'DOLO 650';
  else if (nameLower.includes('mox')) imprint = 'AMOX 500';
  else if (nameLower.includes('pan')) imprint = 'PAN 40';
  else if (nameLower.includes('augmentin')) imprint = 'AUG 625';
  else if (nameLower.includes('azee') || nameLower.includes('azith')) imprint = 'AZI 500';
  else if (nameLower.includes('calpol')) imprint = 'CALPOL';
  else if (nameLower.includes('glycomet') || nameLower.includes('metformin')) imprint = 'M 500';

  // Render cut cavities
  let cutPillsSvg = '';
  const positions = [
    { x: 70, y: 110 },
    { x: 145, y: 110 },
    { x: 220, y: 110 },
    { x: 105, y: 175 }
  ];

  for (let i = 0; i < cavitiesRemaining; i++) {
    const p = positions[i] || { x: 70 + i * 65, y: 110 };
    const cx = p.x;
    const cy = p.y;

    if (pillShape === 'capsule') {
      cutPillsSvg += `
        <!-- Cavity -->
        <rect x="${cx - 16}" y="${cy - 26}" width="32" height="52" rx="16" fill="url(#cutPocketGrad)" stroke="#64748b" stroke-width="1.2" filter="url(#cutDropShad)" />
        <!-- Capsule -->
        <path d="M ${cx - 11} ${cy} C ${cx - 11} ${cy - 20}, ${cx + 11} ${cy - 20}, ${cx + 11} ${cy} Z" fill="${pillColor}" />
        <path d="M ${cx - 11} ${cy} C ${cx - 11} ${cy + 20}, ${cx + 11} ${cy + 20}, ${cx + 11} ${cy} Z" fill="${secondaryColor}" />
        <rect x="${cx - 12}" y="${cy - 2}" width="24" height="4" rx="2" fill="#000000" opacity="0.18" />
        <!-- Highlight -->
        <path d="M ${cx - 7} ${cy - 16} Q ${cx - 7} ${cy + 16} ${cx - 5} ${cy + 16}" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.6" fill="none" />
      `;
    } else if (pillShape === 'caplet' || pillShape === 'oval') {
      cutPillsSvg += `
        <!-- Cavity -->
        <rect x="${cx - 24}" y="${cy - 15}" width="48" height="30" rx="14" fill="url(#cutPocketGrad)" stroke="#64748b" stroke-width="1.2" filter="url(#cutDropShad)" />
        <!-- Caplet -->
        <rect x="${cx - 20}" y="${cy - 11}" width="40" height="22" rx="10" fill="${pillColor}" stroke="#94a3b8" stroke-width="0.8" />
        <line x1="${cx}" y1="${cy - 10}" x2="${cx}" y2="${cy + 10}" stroke="#64748b" stroke-width="1.2" opacity="0.8" />
        <text x="${cx - 8}" y="${cy + 3}" font-family="monospace" font-size="6" font-weight="900" fill="#64748b" text-anchor="middle">${imprint.split(' ')[0]}</text>
        <ellipse cx="${cx - 10}" cy="${cy - 5}" rx="7" ry="2" fill="#ffffff" opacity="0.75" />
      `;
    } else {
      // Round
      cutPillsSvg += `
        <!-- Cavity -->
        <circle cx="${cx}" cy="${cy}" r="20" fill="url(#cutPocketGrad)" stroke="#64748b" stroke-width="1.2" filter="url(#cutDropShad)" />
        <circle cx="${cx}" cy="${cy}" r="16" fill="${pillColor}" stroke="#94a3b8" stroke-width="0.8" />
        <circle cx="${cx}" cy="${cy}" r="13" fill="none" stroke="#000000" stroke-width="0.6" opacity="0.12" />
        <line x1="${cx - 12}" y1="${cy}" x2="${cx + 12}" y2="${cy}" stroke="#64748b" stroke-width="1" opacity="0.7" />
        <text x="${cx}" y="${cy - 4}" font-family="monospace" font-size="5.5" font-weight="900" fill="#64748b" text-anchor="middle">${imprint.split(' ')[0]}</text>
        <ellipse cx="${cx - 5}" cy="${cy - 6}" rx="6" ry="3" fill="#ffffff" opacity="0.7" />
      `;
    }
  }

  // Severed empty cavity cut in half along the scissors cut line
  const severedCavitySvg = `
    <!-- Severed Cut Cavity Half -->
    <path d="M 285 85 Q 295 85 295 110 Q 295 135 285 135 Z" fill="#94a3b8" opacity="0.5" stroke="#f43f5e" stroke-dasharray="3,2" />
    <path d="M 285 92 Q 291 92 291 110 Q 291 128 285 128 Z" fill="${pillColor}" opacity="0.6" />
  `;

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
      <defs>
        <linearGradient id="cutFoilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${isAluAlu ? '#94a3b8' : '#cbd5e1'}" />
          <stop offset="50%" stop-color="${isAluAlu ? '#64748b' : '#f1f5f9'}" />
          <stop offset="100%" stop-color="${isAluAlu ? '#475569' : '#94a3b8'}" />
        </linearGradient>

        <radialGradient id="cutPocketGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
          <stop offset="60%" stop-color="#cbd5e1" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#475569" stop-opacity="0.8" />
        </radialGradient>

        <pattern id="cutKnurl" width="4" height="4" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="4" y2="4" stroke="#334155" stroke-width="0.3" opacity="0.35" />
          <line x1="4" y1="0" x2="4" y2="4" stroke="#334155" stroke-width="0.3" opacity="0.35" />
        </pattern>

        <filter id="cutDropShad" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="2" dy="3" stdDeviation="3" flood-color="#020617" flood-opacity="0.45" />
        </filter>
      </defs>

      <!-- Severed Scissored Foil Polygon Shape (Irregular cut on right edge) -->
      <polygon points="12,12 285,12 295,45 285,90 295,135 285,180 295,228 12,228" fill="url(#cutFoilGrad)" stroke="#475569" stroke-width="2" filter="url(#cutDropShad)" />
      <!-- Texture overlay -->
      <polygon points="12,12 285,12 295,45 285,90 295,135 285,180 295,228 12,228" fill="url(#cutKnurl)" />

      <!-- Left Warning Band -->
      <rect x="12" y="12" width="12" height="216" fill="#e11d48" opacity="0.95" />

      <!-- Dotted Scissors Cut Guideline -->
      <line x1="285" y1="8" x2="285" y2="232" stroke="#f43f5e" stroke-width="2.5" stroke-dasharray="6,4" />
      
      <!-- Scissors Cut Indicator Graphic -->
      <g transform="translate(268, 22)">
        <circle cx="16" cy="16" r="14" fill="#f43f5e" />
        <!-- Scissors Glyph Icon -->
        <text x="16" y="21" font-family="sans-serif" font-size="14" font-weight="900" fill="#ffffff" text-anchor="middle">✂</text>
      </g>
      <text x="268" y="58" font-family="monospace" font-size="7.5" font-weight="900" fill="#e11d48">CUT FOIL EDGE</text>

      <!-- Top Label on severed piece -->
      <text x="32" y="32" font-family="sans-serif" font-size="12" font-weight="900" fill="#0f172a">${escapeXml(medName.toUpperCase())}</text>
      <text x="32" y="44" font-family="sans-serif" font-size="8" font-weight="700" fill="#334155">${escapeXml(medGeneric)}</text>
      
      <!-- Cut Banner Badge -->
      <rect x="32" y="52" width="150" height="18" rx="4" fill="#e11d48" opacity="0.9" />
      <text x="107" y="64" font-family="monospace" font-size="7.5" font-weight="900" fill="#ffffff" text-anchor="middle">✂ SCISSORED STRIP (${cavitiesRemaining} PILLS)</text>

      <!-- Remaining Pills in Severed Foil -->
      <g id="remaining-pills">
        ${cutPillsSvg}
      </g>

      <!-- Severed Cavity slice along scissors line -->
      ${severedCavitySvg}

      <!-- Severed Stamped Date & Batch at bottom (simulating sliced off text) -->
      <rect x="30" y="200" width="240" height="20" rx="4" fill="#000000" opacity="0.12" />
      <text x="36" y="214" font-family="monospace" font-size="8.5" font-weight="900" fill="${isExpired ? '#b91c1c' : '#0f172a'}">
        B.NO: ${escapeXml(batchNo)}   EXP: ${escapeXml(expDate)} ${isExpired ? '[EXPIRED]' : '[VALID]'}
      </text>

      <!-- Severed Edge Shading Gradient overlay -->
      <polygon points="275,12 295,12 295,228 275,228" fill="#f43f5e" opacity="0.12" />
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
}
