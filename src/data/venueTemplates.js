/**
 * Venue Templates — SVG path-based layouts
 * 
 * Each template defines:
 *   viewBox: SVG viewBox string
 *   background: center element (stage/field/ring) with SVG path
 *   sections: array of { id, path, label, cx, cy, tierIndex, totalSeats, rows, seatsPerRow }
 *   decorations: additional SVG elements (field lines, markings)
 * 
 * This data could come from a backend API. Frontend just renders <path d={section.path} />.
 */

// Helper: generate arc path for stadium sections
function arcSection(cx, cy, innerR, outerR, startAngle, endAngle) {
  const toRad = (a) => (a * Math.PI) / 180;
  const x1i = cx + innerR * Math.cos(toRad(startAngle));
  const y1i = cy + innerR * Math.sin(toRad(startAngle));
  const x2i = cx + innerR * Math.cos(toRad(endAngle));
  const y2i = cy + innerR * Math.sin(toRad(endAngle));
  const x1o = cx + outerR * Math.cos(toRad(startAngle));
  const y1o = cy + outerR * Math.sin(toRad(startAngle));
  const x2o = cx + outerR * Math.cos(toRad(endAngle));
  const y2o = cy + outerR * Math.sin(toRad(endAngle));
  const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
  return `M ${x1o},${y1o} A ${outerR},${outerR} 0 ${largeArc} 1 ${x2o},${y2o} L ${x2i},${y2i} A ${innerR},${innerR} 0 ${largeArc} 0 ${x1i},${y1i} Z`;
}

function arcCenter(cx, cy, r, startAngle, endAngle) {
  const toRad = (a) => (a * Math.PI) / 180;
  const midAngle = (startAngle + endAngle) / 2;
  return {
    x: cx + r * Math.cos(toRad(midAngle)),
    y: cy + r * Math.sin(toRad(midAngle))
  };
}

// ========================
// 1. STADIUM TEMPLATE
// ========================
function createStadiumTemplate() {
  const cx = 500, cy = 400;
  const sections = [];
  
  // Inner ring (VIP) — tierIndex 0
  const innerR = 180, innerOR = 230;
  const vipAngles = [
    { start: -160, end: -110, id: '101' },
    { start: -110, end: -70, id: '102' },
    { start: -70, end: -20, id: '103' },
    { start: 0, end: 50, id: '104' },
    { start: 50, end: 90, id: '105' },
    { start: 90, end: 140, id: '106' },
    { start: 140, end: 180, id: '107' },
    { start: 180, end: 200, id: '108' },
  ];
  vipAngles.forEach(a => {
    const c = arcCenter(cx, cy, (innerR + innerOR) / 2, a.start, a.end);
    sections.push({
      id: a.id, path: arcSection(cx, cy, innerR, innerOR, a.start, a.end),
      label: a.id, cx: c.x, cy: c.y, tierIndex: 0,
      totalSeats: 40, rows: 4, seatsPerRow: 10
    });
  });

  // Middle ring (CAT A) — tierIndex 1
  const midR = 235, midOR = 290;
  const catAAngles = [
    { start: -165, end: -120, id: '201' },
    { start: -120, end: -75, id: '202' },
    { start: -75, end: -30, id: '203' },
    { start: -30, end: -10, id: '204' },
    { start: 10, end: 30, id: '205' },
    { start: 30, end: 75, id: '206' },
    { start: 75, end: 120, id: '207' },
    { start: 120, end: 165, id: '208' },
    { start: 165, end: 195, id: '209' },
  ];
  catAAngles.forEach(a => {
    const c = arcCenter(cx, cy, (midR + midOR) / 2, a.start, a.end);
    sections.push({
      id: a.id, path: arcSection(cx, cy, midR, midOR, a.start, a.end),
      label: a.id, cx: c.x, cy: c.y, tierIndex: 1,
      totalSeats: 60, rows: 5, seatsPerRow: 12
    });
  });

  // Outer ring (CAT B) — tierIndex 2
  const outR = 295, outOR = 360;
  const catBAngles = [
    { start: -170, end: -130, id: '301' },
    { start: -130, end: -90, id: '302' },
    { start: -90, end: -50, id: '303' },
    { start: -50, end: -20, id: '304' },
    { start: 20, end: 50, id: '305' },
    { start: 50, end: 90, id: '306' },
    { start: 90, end: 130, id: '307' },
    { start: 130, end: 170, id: '308' },
    { start: 170, end: 200, id: '309' },
  ];
  catBAngles.forEach(a => {
    const c = arcCenter(cx, cy, (outR + outOR) / 2, a.start, a.end);
    sections.push({
      id: a.id, path: arcSection(cx, cy, outR, outOR, a.start, a.end),
      label: a.id, cx: c.x, cy: c.y, tierIndex: 2,
      totalSeats: 80, rows: 6, seatsPerRow: 14
    });
  });

  return {
    name: 'Stadium',
    viewBox: '0 0 1000 800',
    background: {
      type: 'field',
      path: `M ${cx - 130},${cy - 80} L ${cx + 130},${cy - 80} L ${cx + 130},${cy + 80} L ${cx - 130},${cy + 80} Z`,
      label: 'FIELD',
      color: '#22c55e'
    },
    decorations: [
      // Field center line
      { type: 'line', x1: cx, y1: cy - 80, x2: cx, y2: cy + 80, color: '#fff', opacity: 0.3 },
      // Center circle
      { type: 'circle', cx, cy, r: 30, color: '#fff', opacity: 0.2 },
    ],
    sections
  };
}

// ========================
// 2. CONCERT TEMPLATE (T-Stage)
// ========================
function createConcertTemplate() {
  const cx = 500, stageTop = 50;
  const sections = [];

  // VIP blocks near stage — tierIndex 0
  sections.push({ id: 'VIP-L', path: 'M 200,180 L 380,180 L 380,280 L 200,280 Z', label: 'VIP-L', cx: 290, cy: 230, tierIndex: 0, totalSeats: 48, rows: 4, seatsPerRow: 12 });
  sections.push({ id: 'VIP-R', path: 'M 580,180 L 760,180 L 760,280 L 580,280 Z', label: 'VIP-R', cx: 670, cy: 230, tierIndex: 0, totalSeats: 48, rows: 4, seatsPerRow: 12 });
  sections.push({ id: 'VIP-C', path: 'M 380,300 L 580,300 L 580,380 L 380,380 Z', label: 'VIP-C', cx: 480, cy: 340, tierIndex: 0, totalSeats: 40, rows: 4, seatsPerRow: 10 });

  // CAT A — tierIndex 1
  sections.push({ id: 'A1', path: 'M 100,180 L 190,180 L 190,350 L 100,360 Z', label: 'A1', cx: 145, cy: 270, tierIndex: 1, totalSeats: 50, rows: 5, seatsPerRow: 10 });
  sections.push({ id: 'A2', path: 'M 770,180 L 860,180 L 860,360 L 770,350 Z', label: 'A2', cx: 815, cy: 270, tierIndex: 1, totalSeats: 50, rows: 5, seatsPerRow: 10 });
  sections.push({ id: 'A3', path: 'M 200,290 L 370,290 L 370,400 L 200,410 Z', label: 'A3', cx: 285, cy: 350, tierIndex: 1, totalSeats: 60, rows: 5, seatsPerRow: 12 });
  sections.push({ id: 'A4', path: 'M 590,290 L 760,290 L 760,410 L 590,400 Z', label: 'A4', cx: 675, cy: 350, tierIndex: 1, totalSeats: 60, rows: 5, seatsPerRow: 12 });

  // CAT B — tierIndex 2
  sections.push({ id: 'B1', path: 'M 80,370 L 190,360 L 190,530 L 80,540 Z', label: 'B1', cx: 135, cy: 450, tierIndex: 2, totalSeats: 70, rows: 7, seatsPerRow: 10 });
  sections.push({ id: 'B2', path: 'M 200,420 L 460,410 L 460,540 L 200,550 Z', label: 'B2', cx: 330, cy: 480, tierIndex: 2, totalSeats: 100, rows: 6, seatsPerRow: 18 });
  sections.push({ id: 'B3', path: 'M 500,410 L 760,420 L 760,550 L 500,540 Z', label: 'B3', cx: 630, cy: 480, tierIndex: 2, totalSeats: 100, rows: 6, seatsPerRow: 18 });
  sections.push({ id: 'B4', path: 'M 770,360 L 880,370 L 880,540 L 770,530 Z', label: 'B4', cx: 825, cy: 450, tierIndex: 2, totalSeats: 70, rows: 7, seatsPerRow: 10 });

  // GA — tierIndex 2
  sections.push({ id: 'GA', path: 'M 100,560 L 860,560 L 860,650 L 100,650 Z', label: 'GA', cx: 480, cy: 605, tierIndex: 2, totalSeats: 200, rows: 8, seatsPerRow: 25 });

  return {
    name: 'Concert',
    viewBox: '0 0 960 700',
    background: {
      type: 'stage',
      path: 'M 300,40 L 660,40 L 660,120 L 530,120 L 530,260 L 430,260 L 430,120 L 300,120 Z',
      label: 'STAGE',
      color: '#f59e0b'
    },
    decorations: [],
    sections
  };
}

// ========================
// 3. ARENA TEMPLATE (Center Ring)
// ========================
function createArenaTemplate() {
  const cx = 500, cy = 400;
  const sections = [];

  // Ringside (4 sides) — tierIndex 0
  sections.push({ id: 'RS-N', path: 'M 350,200 L 650,200 L 650,270 L 350,270 Z', label: 'RS-N', cx: 500, cy: 235, tierIndex: 0, totalSeats: 24, rows: 2, seatsPerRow: 12 });
  sections.push({ id: 'RS-S', path: 'M 350,530 L 650,530 L 650,600 L 350,600 Z', label: 'RS-S', cx: 500, cy: 565, tierIndex: 0, totalSeats: 24, rows: 2, seatsPerRow: 12 });
  sections.push({ id: 'RS-W', path: 'M 230,280 L 340,280 L 340,520 L 230,520 Z', label: 'RS-W', cx: 285, cy: 400, tierIndex: 0, totalSeats: 24, rows: 8, seatsPerRow: 3 });
  sections.push({ id: 'RS-E', path: 'M 660,280 L 770,280 L 770,520 L 660,520 Z', label: 'RS-E', cx: 715, cy: 400, tierIndex: 0, totalSeats: 24, rows: 8, seatsPerRow: 3 });

  // Front Row (4 sides) — tierIndex 1
  sections.push({ id: 'FR-N', path: 'M 250,120 L 750,120 L 750,195 L 250,195 Z', label: 'FR-N', cx: 500, cy: 157, tierIndex: 1, totalSeats: 40, rows: 3, seatsPerRow: 14 });
  sections.push({ id: 'FR-S', path: 'M 250,605 L 750,605 L 750,680 L 250,680 Z', label: 'FR-S', cx: 500, cy: 642, tierIndex: 1, totalSeats: 40, rows: 3, seatsPerRow: 14 });
  sections.push({ id: 'FR-W', path: 'M 120,200 L 225,200 L 225,600 L 120,600 Z', label: 'FR-W', cx: 172, cy: 400, tierIndex: 1, totalSeats: 40, rows: 10, seatsPerRow: 4 });
  sections.push({ id: 'FR-E', path: 'M 775,200 L 880,200 L 880,600 L 775,600 Z', label: 'FR-E', cx: 827, cy: 400, tierIndex: 1, totalSeats: 40, rows: 10, seatsPerRow: 4 });

  // General (corners) — tierIndex 2
  sections.push({ id: 'GA-NW', path: 'M 120,80 L 245,80 L 245,190 L 120,190 Z', label: 'GA-NW', cx: 182, cy: 135, tierIndex: 2, totalSeats: 30, rows: 5, seatsPerRow: 6 });
  sections.push({ id: 'GA-NE', path: 'M 755,80 L 880,80 L 880,190 L 755,190 Z', label: 'GA-NE', cx: 817, cy: 135, tierIndex: 2, totalSeats: 30, rows: 5, seatsPerRow: 6 });
  sections.push({ id: 'GA-SW', path: 'M 120,610 L 245,610 L 245,720 L 120,720 Z', label: 'GA-SW', cx: 182, cy: 665, tierIndex: 2, totalSeats: 30, rows: 5, seatsPerRow: 6 });
  sections.push({ id: 'GA-SE', path: 'M 755,610 L 880,610 L 880,720 L 755,720 Z', label: 'GA-SE', cx: 817, cy: 665, tierIndex: 2, totalSeats: 30, rows: 5, seatsPerRow: 6 });

  return {
    name: 'Arena',
    viewBox: '0 0 1000 800',
    background: {
      type: 'ring',
      path: 'M 350,280 L 650,280 L 650,520 L 350,520 Z',
      label: 'RING',
      color: '#ef4444',
      innerPath: 'M 380,310 L 620,310 L 620,490 L 380,490 Z'
    },
    decorations: [
      { type: 'line', x1: 350, y1: 400, x2: 650, y2: 400, color: '#fff', opacity: 0.15 },
    ],
    sections
  };
}

// ========================
// 4. THEATER TEMPLATE
// ========================
function createTheaterTemplate() {
  const cx = 500;
  const sections = [];

  // Orchestra — tierIndex 0
  sections.push({ id: 'ORCH-L', path: 'M 180,200 L 380,190 L 380,310 L 160,320 Z', label: 'ORCH-L', cx: 275, cy: 255, tierIndex: 0, totalSeats: 48, rows: 4, seatsPerRow: 12 });
  sections.push({ id: 'ORCH-C', path: 'M 390,185 L 610,185 L 610,310 L 390,310 Z', label: 'ORCH-C', cx: 500, cy: 248, tierIndex: 0, totalSeats: 56, rows: 4, seatsPerRow: 14 });
  sections.push({ id: 'ORCH-R', path: 'M 620,190 L 820,200 L 840,320 L 620,310 Z', label: 'ORCH-R', cx: 725, cy: 255, tierIndex: 0, totalSeats: 48, rows: 4, seatsPerRow: 12 });

  // Mezzanine — tierIndex 1
  sections.push({ id: 'MEZZ-L', path: 'M 140,340 L 370,330 L 370,460 L 120,470 Z', label: 'MEZZ-L', cx: 250, cy: 400, tierIndex: 1, totalSeats: 60, rows: 5, seatsPerRow: 12 });
  sections.push({ id: 'MEZZ-C', path: 'M 380,325 L 620,325 L 620,460 L 380,460 Z', label: 'MEZZ-C', cx: 500, cy: 393, tierIndex: 1, totalSeats: 80, rows: 5, seatsPerRow: 16 });
  sections.push({ id: 'MEZZ-R', path: 'M 630,330 L 860,340 L 880,470 L 630,460 Z', label: 'MEZZ-R', cx: 750, cy: 400, tierIndex: 1, totalSeats: 60, rows: 5, seatsPerRow: 12 });

  // Balcony — tierIndex 2
  sections.push({ id: 'BALC-L', path: 'M 100,490 L 360,480 L 360,620 L 80,630 Z', label: 'BALC-L', cx: 230, cy: 555, tierIndex: 2, totalSeats: 70, rows: 6, seatsPerRow: 12 });
  sections.push({ id: 'BALC-C', path: 'M 370,475 L 630,475 L 630,620 L 370,620 Z', label: 'BALC-C', cx: 500, cy: 548, tierIndex: 2, totalSeats: 100, rows: 6, seatsPerRow: 18 });
  sections.push({ id: 'BALC-R', path: 'M 640,480 L 900,490 L 920,630 L 640,620 Z', label: 'BALC-R', cx: 770, cy: 555, tierIndex: 2, totalSeats: 70, rows: 6, seatsPerRow: 12 });

  return {
    name: 'Theater',
    viewBox: '0 0 1000 700',
    background: {
      type: 'stage',
      path: 'M 270,40 L 730,40 L 730,160 L 270,160 Z',
      label: 'STAGE',
      color: '#a855f7'
    },
    decorations: [
      { type: 'line', x1: 270, y1: 160, x2: 730, y2: 160, color: '#a855f7', opacity: 0.3 },
    ],
    sections
  };
}

// ========================
// EXPORTS
// ========================
export const VENUE_TEMPLATES = {
  stadium: createStadiumTemplate(),
  concert: createConcertTemplate(),
  arena: createArenaTemplate(),
  theater: createTheaterTemplate()
};

/**
 * Apply a template to tiers.
 * Maps tier indices to actual tier IDs, generates availableSeats deterministically.
 * @param overrides - { [sectionId]: { tierId, rows, seatsPerRow, viewUrl } }
 */
export function applyTemplate(templateKey, tiers, overrides = {}) {
  const tmpl = VENUE_TEMPLATES[templateKey];
  if (!tmpl) return null;

  const safeTiers = Array.isArray(tiers) ? tiers : [];

  const sections = tmpl.sections.map((s, idx) => {
    // Determine target tier ID: use override if specified, else use template tierIndex
    let targetTier = safeTiers[s.tierIndex] || safeTiers[safeTiers.length - 1] || { id: `t${s.tierIndex + 1}` };
    if (overrides[s.id]?.tierId) {
       targetTier = safeTiers.find(t => t.id === overrides[s.id].tierId) || targetTier;
    }

    const rows = overrides[s.id]?.rows || s.rows || 5;
    const seatsPerRow = overrides[s.id]?.seatsPerRow || s.seatsPerRow || 10;
    const totalSeats = rows * seatsPerRow;
    const viewUrl = overrides[s.id]?.viewUrl || s.viewUrl || '';

    // Deterministic availability: 60-95% of seats available
    const hash = (s.id.charCodeAt(0) * 7 + (s.id.charCodeAt(1) || 0) * 13 + idx * 3) % 36;
    const pct = 0.6 + (hash / 100);
    const available = Math.max(1, Math.floor(totalSeats * Math.min(pct, 0.95)));
    
    return {
      ...s,
      tierId: targetTier.id,
      availableSeats: available,
      rows,
      seatsPerRow,
      totalSeats,
      viewUrl
    };
  });

  return {
    templateKey,
    viewBox: tmpl.viewBox,
    background: tmpl.background,
    decorations: tmpl.decorations || [],
    sections
  };
}

export default VENUE_TEMPLATES;
