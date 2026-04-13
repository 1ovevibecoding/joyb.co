/**
 * TicketmasterSeatMap.jsx — Premium SVG Seat Map Engine
 *
 * Architecture:
 *   Macro View (zoom < threshold): Curved SVG path sections (Ticketmaster-style polygons)
 *   Micro View (zoom >= threshold): Individual seat dots + minimap radar
 *   Dynamic Sidebar: Legend → Filter+EmptyCart → YourSelection
 *
 * Data Sources:
 *   1. venueData.js — per-event custom venue maps (EVT001-EVT005)
 *   2. venueTemplates.js — reusable arc-based templates (stadium/concert/arena/theater)
 *   3. event.venueLayout — legacy fallback from DB
 */

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { getVenueData } from '../data/venueData';
import { VENUE_TEMPLATES, applyTemplate } from '../data/venueTemplates';

// ─── Constants ─────────────────────────────────────────────────────────────────
const MICRO_ZOOM_THRESHOLD = 2.5;
const TM_BLUE = '#026cdf';
const TM_BLUE_DARK = '#0150a7';
const TM_GRAY = '#d1d5db';
const TM_GRAY_LOCKED = '#9ca3af';
const SEAT_RADIUS = 3.5;
const SEAT_GAP = 3;
const CELL = SEAT_RADIUS * 2 + SEAT_GAP;

// ─── Format Price ──────────────────────────────────────────────────────────────
const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + 'đ';

// ─── Resolve venue layout from any source ──────────────────────────────────────
function resolveVenue(event) {
  if (!event) return null;

  // 1. Check venueData.js (per-event custom maps)
  const eventId = event.id || event.event_id;
  const customVenue = getVenueData(eventId);
  if (customVenue) {
    return { type: 'custom', data: customVenue };
  }

  // 2. Check venueTemplates.js (template-based)
  const templateKey = event.venue_template || event.venueTemplate;
  if (templateKey && VENUE_TEMPLATES[templateKey]) {
    const applied = applyTemplate(templateKey, event.ticket_tiers || []);
    if (applied) return { type: 'template', data: applied };
  }

  // 3. Fallback: build from venueLayout (legacy DB data)
  if (event.venueLayout?.sections) {
    return { type: 'legacy', data: event.venueLayout };
  }

  // 4. Last resort: auto-assign template based on event index
  const templates = ['stadium', 'concert', 'arena', 'theater'];
  const idx = typeof eventId === 'number' ? eventId : (parseInt(String(eventId).replace(/\D/g, '')) || 0);
  const autoKey = templates[idx % templates.length];
  const applied = applyTemplate(autoKey, event.ticket_tiers || []);
  return applied ? { type: 'template', data: applied } : null;
}

// ─── Build tier color map from event ───────────────────────────────────────────
function buildTierMap(event) {
  const map = {};
  (event?.ticket_tiers || []).forEach((t, i) => {
    map[t.id] = { ...t, index: i };
  });
  return map;
}

// ─── Generate seat positions inside a rectangular bounding box ─────────────────
function generateSeatsForSection(section) {
  const seats = [];
  const isArray = Array.isArray(section.rows);
  const numRows = isArray ? section.rows.length : (section.rows || 4);
  const defaultCols = section.seatsPerRow || 10;
  
  const x = section.x || 0;
  const y = section.y || 0;
  const padX = 6, padY = 6;
  const w = section.width || (defaultCols * CELL + padX * 2);
  const h = section.height || (numRows * CELL + padY * 2);
  
  const availH = h - padY * 2;
  const gapY = numRows > 1 ? availH / (numRows - 1) : CELL;

  for (let r = 0; r < numRows; r++) {
    const rowObj = isArray ? section.rows[r] : null;
    const rowLabel = rowObj?.label || String.fromCharCode(65 + (r % 26));
    const rowSeats = rowObj?.seats || defaultCols;
    
    // Center the row horizontally within the section
    const rowWidth = rowSeats * CELL;
    const startX = x + padX + (w - padX * 2 - rowWidth) / 2;
    
    for (let c = 0; c < rowSeats; c++) {
      seats.push({
        id: `${section.id}-${rowLabel}-${rowSeats - c}`, // Usually seats are numbered right to left or left to right
        row: rowLabel,
        col: c,
        seatNumber: c + 1,
        cx: startX + c * CELL + SEAT_RADIUS,
        cy: y + padY + r * gapY + SEAT_RADIUS,
      });
    }
  }
  return seats;
}

// ─── Generate seats along an arc path (for template sections) ──────────────────
function generateSeatsForArcSection(section, cx, cy) {
  const seats = [];
  const isArray = Array.isArray(section.rows);
  const numRows = isArray ? section.rows.length : (section.rows || 4);
  const defaultCols = section.seatsPerRow || 10;

  // Parse the SVG path to extract the arc geometry
  const secCx = section.cx || cx;
  const secCy = section.cy || cy;
  const estH = numRows * CELL;

  for (let r = 0; r < numRows; r++) {
    const rowObj = isArray ? section.rows[r] : null;
    const rowLabel = rowObj?.label || String.fromCharCode(65 + (r % 26));
    const rowSeats = rowObj?.seats || defaultCols;
    
    // Center the row horizontally relative to secCx
    const rowWidth = rowSeats * CELL;
    const startX = secCx - rowWidth / 2;

    for (let c = 0; c < rowSeats; c++) {
      seats.push({
        id: `${section.id}-${rowLabel}-${rowSeats - c}`,
        row: rowLabel,
        col: c,
        seatNumber: c + 1,
        cx: startX + c * CELL + SEAT_RADIUS,
        cy: secCy - estH / 2 + r * CELL + SEAT_RADIUS,
      });
    }
  }
  return seats;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const TicketmasterSeatMap = ({
  event,
  selectedSeats = [],
  onSeatToggle,
  globalSoldSeats = [],
  lockedSeats = {},
  localSessionId = '',
  onProceedToCheckout,
}) => {
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const lastMouse = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [priceFilter, setPriceFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const tierMap = useMemo(() => buildTierMap(event), [event]);

  // ─── Resolve venue data ──────────────────────────────────────────────────────
  const venue = useMemo(() => resolveVenue(event), [event]);

  // Parse venue into a unified structure
  const layout = useMemo(() => {
    if (!venue) return null;

    if (venue.type === 'custom') {
      // venueData.js format: sections have x, y, width, height, fill, etc.
      const d = venue.data;
      return {
        viewBox: `0 0 ${d.width} ${d.height}`,
        width: d.width,
        height: d.height,
        background: d.background || null,
        elements: d.elements || [],
        sections: d.sections.map(s => ({
          ...s,
          tier: tierMap[s.tierId] || { name: s.label, price: s.price, color: s.fill },
          seats: generateSeatsForSection(s),
        })),
      };
    }

    if (venue.type === 'template') {
      // venueTemplates.js format: sections have path, cx, cy
      const d = venue.data;
      const [, , vbW, vbH] = (d.viewBox || '0 0 1000 800').split(' ').map(Number);
      return {
        viewBox: d.viewBox,
        width: vbW,
        height: vbH,
        background: d.background,
        decorations: d.decorations || [],
        sections: d.sections.map(s => {
          const tier = tierMap[s.tierId] || { name: s.label, price: 0, color: TM_BLUE };
          return {
            ...s,
            tier,
            fill: tier.color || TM_BLUE,
            price: tier.price || s.price || 0,
            seats: generateSeatsForArcSection(s),
          };
        }),
      };
    }

    // Legacy venueLayout
    if (venue.type === 'legacy') {
      const d = venue.data;
      const sections = (d.sections || []).map((s, i) => {
        const tier = tierMap[s.tierId] || { name: s.label || s.id, price: 0, color: TM_BLUE };
        const isArray = Array.isArray(s.rows);
        const numRows = isArray ? s.rows.length : (s.rows || 4);
        const maxCols = isArray ? Math.max(...s.rows.map(r => r.seats || 0)) : (s.seatsPerRow || 10);
        
        const secX = s.x || s.px || (i % 3) * 200 + 100;
        const secY = s.y || s.py || Math.floor(i / 3) * 200 + 200;
        const secW = s.width || s.boxW || maxCols * CELL + 12;
        const secH = s.height || s.boxH || numRows * CELL + 12;

        return {
          ...s,
          tier,
          fill: tier.color || TM_BLUE,
          price: tier.price || 0,
          x: secX,
          y: secY,
          width: secW,
          height: secH,
          seats: generateSeatsForSection({
            ...s,
            x: secX,
            y: secY,
            width: secW,
            height: secH,
          }),
        };
      });
      const ce = d.centerElement;
      return {
        viewBox: `0 0 ${d.width || 1200} ${d.height || 900}`,
        width: d.width || 1200,
        height: d.height || 900,
        elements: [],
        background: ce ? {
          type: 'stage',
          path: `M ${ce.x},${ce.y} L ${ce.x + ce.width},${ce.y} L ${ce.x + ce.width},${ce.y + ce.height} L ${ce.x},${ce.y + ce.height} Z`,
          label: ce.label || 'STAGE',
          color: '#6366f1',
        } : null,
        sections,
      };
    }

    return null;
  }, [venue, tierMap]);

  // ─── Initial fit ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || !layout) return;
    const cW = containerRef.current.clientWidth;
    const cH = containerRef.current.clientHeight;
    const z = Math.min(cW / layout.width, cH / layout.height, 1.3) * 0.85;
    setPan({
      x: (cW - layout.width * z) / 2,
      y: (cH - layout.height * z) / 2,
    });
    setZoom(z);
  }, [layout]);

  // ─── Sidebar state ──────────────────────────────────────────────────────────
  const isMicro = zoom >= MICRO_ZOOM_THRESHOLD;
  const sidebarState = useMemo(() => {
    if (!isMicro) return 'legend';
    return selectedSeats.length > 0 ? 'selection' : 'empty';
  }, [isMicro, selectedSeats.length]);

  // ─── Zoom handlers ──────────────────────────────────────────────────────────
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const factor = e.deltaY > 0 ? 0.88 : 1.12;
    const nz = Math.max(0.3, Math.min(zoom * factor, 12));
    setPan(p => ({
      x: mx - (mx - p.x) * (nz / zoom),
      y: my - (my - p.y) * (nz / zoom),
    }));
    setZoom(nz);
    setTooltip(null);
  }, [zoom]);

  const zoomBy = useCallback((f) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    const cx = r.width / 2, cy = r.height / 2;
    const nz = Math.max(0.3, Math.min(zoom * f, 12));
    setPan(p => ({ x: cx - (cx - p.x) * (nz / zoom), y: cy - (cy - p.y) * (nz / zoom) }));
    setZoom(nz);
  }, [zoom]);

  const resetZoom = useCallback(() => {
    if (!containerRef.current || !layout) return;
    const cW = containerRef.current.clientWidth;
    const cH = containerRef.current.clientHeight;
    const z = Math.min(cW / layout.width, cH / layout.height, 1.3) * 0.85;
    setPan({ x: (cW - layout.width * z) / 2, y: (cH - layout.height * z) / 2 });
    setZoom(z);
  }, [layout]);

  // ─── Pan handlers ────────────────────────────────────────────────────────────
  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isPanning || !lastMouse.current) return;
    
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    
    // Update reference immediately for next move
    lastMouse.current = { x: e.clientX, y: e.clientY };
    
    // Only update state if there is actual movement to avoid unnecessary cycles
    if (dx === 0 && dy === 0) return;

    setPan(p => {
      const newX = p.x + dx;
      const newY = p.y + dy;
      
      // Safety check to prevent NaN/Infinity which causes SVG rendering to crash (màn đen)
      if (isNaN(newX) || isNaN(newY)) return p;
      return { x: newX, y: newY };
    });
    
    setTooltip(null);
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    lastMouse.current = null;
  }, []);

  // ─── Section click (zoom into section) ────────────────────────────────────────
  const handleSectionClick = useCallback((sec) => {
    if (isMicro) return;
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    const cx = r.width / 2, cy = r.height / 2;
    const secCx = sec.cx || (sec.x + (sec.width || 100) / 2);
    const secCy = sec.cy || (sec.y + (sec.height || 100) / 2);
    const tz = MICRO_ZOOM_THRESHOLD + 0.5;
    setZoom(tz);
    setPan({ x: cx - secCx * tz, y: cy - secCy * tz });
  }, [isMicro]);

  // ─── Filter match ────────────────────────────────────────────────────────────
  const matchesFilter = useCallback((sec) => {
    const price = sec.price || sec.tier?.price || 0;
    if (priceFilter !== 'all') {
      const [min, max] = priceFilter.split('-').map(Number);
      if (price < min || price > max) return false;
    }
    const tierName = sec.tier?.name || sec.label || '';
    if (typeFilter !== 'all' && tierName !== typeFilter) return false;
    return true;
  }, [priceFilter, typeFilter]);

  // ─── Seat click ──────────────────────────────────────────────────────────────
  const handleSeatClick = useCallback((seat, sec) => {
    if (!isMicro) return;
    if (globalSoldSeats.includes(seat.id)) return;
    if (lockedSeats[seat.id] && lockedSeats[seat.id] !== localSessionId) return;
    if (!matchesFilter(sec)) return;

    const tier = sec.tier || {};
    onSeatToggle?.(seat.id, {
      id: sec.tierId || tier.id,
      name: tier.name || sec.label,
      price: sec.price || tier.price || 0,
      color: sec.fill || tier.color || TM_BLUE,
    }, sec.id, seat.row, seat.col);
    setTooltip(null);
  }, [isMicro, globalSoldSeats, lockedSeats, localSessionId, matchesFilter, onSeatToggle]);

  // ─── Tooltip ─────────────────────────────────────────────────────────────────
  const handleSeatHover = useCallback((e, seat, sec) => {
    if (!isMicro) return;
    if (globalSoldSeats.includes(seat.id)) return;
    if (lockedSeats[seat.id] && lockedSeats[seat.id] !== localSessionId) return;
    const rect = containerRef.current.getBoundingClientRect();
    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, seat, sec });
  }, [isMicro, globalSoldSeats, lockedSeats, localSessionId]);

  // ─── Seat color/opacity ──────────────────────────────────────────────────────
  const getSeatStyle = useCallback((seatId, sec) => {
    const isSelected = selectedSeats.some(s => s.seatId === seatId);
    if (isSelected) return { fill: TM_BLUE_DARK, opacity: 1, selected: true };
    if (globalSoldSeats.includes(seatId)) return { fill: TM_GRAY, opacity: 0.2, selected: false };
    if (lockedSeats[seatId] && lockedSeats[seatId] !== localSessionId) return { fill: TM_GRAY_LOCKED, opacity: 0.35, selected: false };
    if (!matchesFilter(sec)) return { fill: TM_GRAY, opacity: 0.15, selected: false };
    return { fill: sec.fill || sec.tier?.color || TM_BLUE, opacity: 1, selected: false };
  }, [selectedSeats, globalSoldSeats, lockedSeats, localSessionId, matchesFilter]);

  // ─── Unique tier names for filter ────────────────────────────────────────────
  const uniqueTiers = useMemo(() => {
    if (!layout) return [];
    const names = new Set(layout.sections.map(s => s.tier?.name || s.label));
    return Array.from(names).filter(Boolean);
  }, [layout]);

  // ─── Minimap ─────────────────────────────────────────────────────────────────
  const mmW = 150, mmH = 110;
  const mmScale = layout ? Math.min(mmW / layout.width, mmH / layout.height) : 1;

  if (!layout) {
    return (
      <div className="flex w-full h-full items-center justify-center bg-gray-100">
        <p className="text-gray-500">Không tìm thấy dữ liệu sơ đồ chỗ ngồi</p>
      </div>
    );
  }

  const transform = `translate(${pan.x}, ${pan.y}) scale(${zoom})`;

  return (
    <div className="flex w-full h-full" style={{ background: '#f8f9fa', fontFamily: "'DM Sans', 'Inter', sans-serif" }}>

      {/* ═══ LEFT PANEL: SVG MAP ═══ */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden select-none"
        style={{ cursor: isPanning ? 'grabbing' : isMicro ? 'grab' : 'pointer', background: '#f0f1f4' }}
        onWheelCapture={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { handleMouseUp(); setTooltip(null); }}
      >
        <svg width="100%" height="100%">
          {/* Subtle grid pattern for professional look */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
            </pattern>
            <filter id="sectionShadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
            </filter>
            <filter id="stageShadow" x="-15%" y="-15%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3" />
            </filter>
            <filter id="stageGlow" x="-20%" y="-20%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="stageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#312e81" />
            </linearGradient>
            <radialGradient id="spotlightGrad" cx="50%" cy="30%" r="60%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          <g transform={transform}>

            {/* ── Background/Stage element ── */}
            {layout.background && (
              <g filter="url(#stageShadow)">
                <path
                  d={layout.background.path}
                  fill={layout.background.color || 'url(#stageGrad)'}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth={2}
                  rx={12}
                />
                {/* Spotlight overlay */}
                <path d={layout.background.path} fill="url(#spotlightGrad)" />
                {/* Label */}
                {layout.background.label && (() => {
                  // Estimate center from path
                  const nums = layout.background.path.match(/-?\d+\.?\d*/g)?.map(Number) || [];
                  const xs = nums.filter((_, i) => i % 2 === 0);
                  const ys = nums.filter((_, i) => i % 2 === 1);
                  const bcx = xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
                  const bcy = ys.length ? ys.reduce((a, b) => a + b, 0) / ys.length : 0;
                  return (
                    <text x={bcx} y={bcy + 6} textAnchor="middle" fill="rgba(255,255,255,0.7)"
                      fontSize={22} fontWeight="800" letterSpacing="6" fontFamily="'DM Sans', sans-serif"
                    >{layout.background.label}</text>
                  );
                })()}
              </g>
            )}

            {/* ── Decorative elements (venueData.js) ── */}
            {(layout.elements || []).map((el, i) => {
              if (el.type === 'rect') {
                return (
                  <rect key={`dec-${i}`}
                    x={el.x} y={el.y} width={el.width} height={el.height}
                    rx={el.cornerRadius || 0}
                    fill={el.fill || 'none'} stroke={el.stroke || 'none'}
                    strokeWidth={el.strokeWidth || 0} opacity={el.opacity ?? 1}
                  />
                );
              }
              if (el.type === 'circle') {
                return <circle key={`dec-${i}`} cx={el.x} cy={el.y} r={el.radius || 5} fill={el.fill || '#fff'} opacity={el.opacity ?? 1} />;
              }
              if (el.type === 'text') {
                return (
                  <text key={`dec-${i}`} x={el.x} y={el.y} textAnchor="middle"
                    fill={el.fill || '#fff'} fontSize={el.fontSize || 14}
                    fontWeight={el.fontStyle === 'bold' ? 'bold' : 'normal'}
                    opacity={el.opacity ?? 1} fontFamily="'DM Sans', sans-serif"
                    letterSpacing={el.letterSpacing || 0}
                  >{el.text}</text>
                );
              }
              if (el.type === 'line') {
                const pts = el.points || [el.x1, el.y1, el.x2, el.y2];
                return <line key={`dec-${i}`} x1={pts[0]} y1={pts[1]} x2={pts[2]} y2={pts[3]} stroke={el.stroke || el.color || '#fff'} strokeWidth={el.strokeWidth || 1} opacity={el.opacity ?? 1} />;
              }
              if (el.type === 'path') {
                return <path key={`dec-${i}`} d={el.pathData} fill={el.fill || 'none'} stroke={el.stroke || 'none'} strokeWidth={el.strokeWidth || 1} opacity={el.opacity ?? 1} />;
              }
              return null;
            })}

            {/* ── Template decorations ── */}
            {(layout.decorations || []).map((dec, i) => {
              if (dec.type === 'line') return <line key={`tdec-${i}`} x1={dec.x1} y1={dec.y1} x2={dec.x2} y2={dec.y2} stroke={dec.color || '#fff'} strokeWidth={dec.strokeWidth || 1} opacity={dec.opacity ?? 0.2} />;
              if (dec.type === 'circle') return <circle key={`tdec-${i}`} cx={dec.cx} cy={dec.cy} r={dec.r} fill="none" stroke={dec.color || '#fff'} strokeWidth={1} opacity={dec.opacity ?? 0.2} />;
              return null;
            })}

            {/* ── SECTIONS ── */}
            {layout.sections.map(sec => {
              const hasAvail = sec.seats?.some(seat =>
                !globalSoldSeats.includes(seat.id) &&
                (!lockedSeats[seat.id] || lockedSeats[seat.id] === localSessionId)
              );
              const mf = matchesFilter(sec);
              const sectionColor = (hasAvail && mf) ? (sec.fill || sec.tier?.color || TM_BLUE) : TM_GRAY;
              const secCx = sec.cx || (sec.x + (sec.width || 100) / 2);
              const secCy = sec.cy || (sec.y + (sec.height || 100) / 2);

              return (
                <g key={sec.id}>

                  {/* ── MACRO: Section polygon/rect ── */}
                  {!isMicro && (
                    <g onClick={() => handleSectionClick(sec)} style={{ cursor: 'pointer' }}>
                      {sec.path ? (
                        <path d={sec.path} fill={sectionColor} opacity={mf ? 0.85 : 0.2}
                          stroke="rgba(255,255,255,0.3)" strokeWidth={1}
                          filter="url(#sectionShadow)"
                        />
                      ) : (
                        <rect x={sec.x} y={sec.y} width={sec.width} height={sec.height}
                          rx={6} fill={sectionColor} opacity={mf ? 0.85 : 0.2}
                          stroke="rgba(255,255,255,0.25)" strokeWidth={1}
                          filter="url(#sectionShadow)"
                        />
                      )}

                      {/* Section ID label */}
                      <text x={secCx} y={secCy - 4} textAnchor="middle" fill="white"
                        fontSize={12} fontWeight="bold" fontFamily="'DM Sans', sans-serif"
                        pointerEvents="none" opacity={mf ? 1 : 0.4}
                      >{sec.label || sec.id}</text>

                      {/* Price label */}
                      <text x={secCx} y={secCy + 12} textAnchor="middle" fill="rgba(255,255,255,0.7)"
                        fontSize={8} fontFamily="'DM Sans', sans-serif"
                        pointerEvents="none" opacity={mf ? 1 : 0.3}
                      >{formatPrice(sec.price || sec.tier?.price || 0)}</text>
                    </g>
                  )}

                  {/* ── MICRO: Individual seat dots ── */}
                  {isMicro && sec.seats && (
                    <g>
                      {/* Faint section background */}
                      {sec.path ? (
                        <path d={sec.path} fill={sectionColor} opacity={0.06} />
                      ) : (
                        <rect x={sec.x} y={sec.y} width={sec.width} height={sec.height}
                          rx={4} fill={sectionColor} opacity={0.06} />
                      )}

                      {/* Section label */}
                      <text x={secCx} y={Math.min(...sec.seats.map(s => s.cy)) - 8}
                        textAnchor="middle" fill="#9ca3af" fontSize={9} fontWeight="600"
                        fontFamily="'DM Sans', sans-serif"
                      >{sec.label || sec.id}</text>

                      {/* Dots */}
                      {sec.seats.map(seat => {
                        const style = getSeatStyle(seat.id, sec);
                        const clickable = style.opacity > 0.3 && !globalSoldSeats.includes(seat.id);
                        return (
                          <g key={seat.id}
                            onClick={() => handleSeatClick(seat, sec)}
                            onMouseEnter={(e) => handleSeatHover(e, seat, sec)}
                            onMouseLeave={() => setTooltip(null)}
                            style={{ cursor: clickable ? 'pointer' : 'not-allowed' }}
                          >
                            {style.selected && (
                              <circle cx={seat.cx} cy={seat.cy} r={SEAT_RADIUS + 3}
                                fill="none" stroke="white" strokeWidth={2} opacity={0.85} />
                            )}
                            <circle cx={seat.cx} cy={seat.cy} r={SEAT_RADIUS}
                              fill={style.fill} opacity={style.opacity}
                            />
                            {style.selected && (
                              <g>
                                <circle cx={seat.cx} cy={seat.cy} r={SEAT_RADIUS - 0.5}
                                  fill={TM_BLUE_DARK} />
                                {/* Checkmark */}
                                <path
                                  d={`M ${seat.cx - 1.5},${seat.cy} L ${seat.cx - 0.5},${seat.cy + 1.2} L ${seat.cx + 1.5},${seat.cy - 1}`}
                                  stroke="white" strokeWidth={0.8} fill="none" strokeLinecap="round" strokeLinejoin="round"
                                />
                              </g>
                            )}
                          </g>
                        );
                      })}
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* ── Zoom Controls ── */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
          <button onClick={resetZoom} title="Reset"
            className="w-8 h-8 bg-white border border-gray-300 shadow rounded flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-all active:scale-95">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M4 8V4m0 0h4M4 4l5 5M20 8V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5M20 16v4m0 0h-4m4 0l-5-5" />
            </svg>
          </button>
          <button onClick={() => zoomBy(1.3)}
            className="w-8 h-8 bg-white border border-gray-300 shadow rounded flex items-center justify-center hover:bg-gray-50 text-gray-800 font-bold text-base transition-all active:scale-95">+</button>
          <button onClick={() => zoomBy(0.77)}
            className="w-8 h-8 bg-white border border-gray-300 shadow rounded flex items-center justify-center hover:bg-gray-50 text-gray-800 font-bold text-base transition-all active:scale-95">−</button>
        </div>

        {/* ── Minimap (Micro view only) ── */}
        {isMicro && (
          <div className="absolute top-14 right-3 z-10 rounded-lg border border-gray-300 shadow-lg overflow-hidden"
            style={{ width: mmW, height: mmH, background: '#e5e7eb' }}>
            <svg width={mmW} height={mmH}>
              <g transform={`scale(${mmScale})`}>
                {/* Background */}
                {layout.background && <path d={layout.background.path} fill={layout.background.color || '#4b5563'} opacity={0.6} />}
                {/* Sections */}
                {layout.sections.map(sec => (
                  sec.path ? (
                    <path key={`mm-${sec.id}`} d={sec.path} fill={sec.fill || TM_BLUE} opacity={0.6} />
                  ) : (
                    <rect key={`mm-${sec.id}`} x={sec.x} y={sec.y} width={sec.width} height={sec.height}
                      rx={3} fill={sec.fill || TM_BLUE} opacity={0.6} />
                  )
                ))}
              </g>
              {/* Viewport */}
              {containerRef.current && (() => {
                const vw = containerRef.current.clientWidth;
                const vh = containerRef.current.clientHeight;
                const vpX = (-pan.x / zoom) * mmScale;
                const vpY = (-pan.y / zoom) * mmScale;
                const vpW = (vw / zoom) * mmScale;
                const vpH = (vh / zoom) * mmScale;
                return <rect x={vpX} y={vpY} width={vpW} height={vpH}
                  fill="rgba(30,30,30,0.2)" stroke="#1f2937" strokeWidth={1.5} rx={2} />;
              })()}
            </svg>
          </div>
        )}

        {/* ── Tooltip ── */}
        {tooltip && (
          <div className="absolute z-50 pointer-events-none" style={{ left: tooltip.x, top: tooltip.y - 80, transform: 'translateX(-50%)' }}>
            <div className="bg-white border border-gray-200 rounded-lg shadow-xl px-3 py-2 min-w-[150px] text-center">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wide mb-0.5">
                {tooltip.sec.label || tooltip.sec.id} — Hàng {tooltip.seat.row}
              </p>
              <p className="text-sm font-bold text-gray-900">Ghế {tooltip.seat.seatNumber}</p>
              <p className="text-xs text-gray-400">{tooltip.sec.tier?.name || 'Standard'}</p>
              <p className="text-sm font-bold text-gray-900 mt-1">{formatPrice(tooltip.sec.price || tooltip.sec.tier?.price || 0)}</p>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
              style={{ borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid white', bottom: -6 }} />
          </div>
        )}

        {/* ── Bottom legend ── */}
        <div className="absolute bottom-3 left-3 flex items-center gap-4 z-10 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm border border-gray-200">
          <div className="flex items-center gap-1.5">
            <svg width="10" height="10"><circle cx="5" cy="5" r="5" fill={TM_BLUE} /></svg>
            <span className="text-[10px] text-gray-600 font-medium">Còn vé</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="10" height="10"><circle cx="5" cy="5" r="5" fill={TM_GRAY} opacity="0.4" /></svg>
            <span className="text-[10px] text-gray-600 font-medium">Hết vé</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="10" height="10"><circle cx="5" cy="5" r="5" fill={TM_BLUE_DARK} /><path d="M 3,5 L 4.5,6.2 L 7,3.5" stroke="white" strokeWidth="1" fill="none" /></svg>
            <span className="text-[10px] text-gray-600 font-medium">Đã chọn</span>
          </div>
        </div>

        {/* ── Zoom hint (Macro only) ── */}
        {!isMicro && (
          <div className="absolute bottom-3 right-3 z-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
            <p className="text-[10px] text-gray-500 font-medium">🖱️ Cuộn hoặc bấm vào khu vực để xem ghế</p>
          </div>
        )}
      </div>

      {/* ═══ RIGHT PANEL: SIDEBAR ═══ */}
      <div className="w-[300px] flex-shrink-0 flex flex-col border-l border-gray-200 bg-white shadow-xl">

        {/* Tab Header */}
        <div className="flex border-b border-gray-200">
          <button className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-gray-900 border-b-2 border-blue-600">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x={3} y={3} width={18} height={18} rx={2} /><path d="M3 9h18M9 21V9" />
            </svg>
            View seat map
          </button>
          {isMicro && selectedSeats.length === 0 && (
            <button className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500 hover:text-gray-700 transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              See best available
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col">

          {/* ── LEGEND (Macro) ── */}
          {sidebarState === 'legend' && (
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <div>
                  <p className="text-sm font-bold text-gray-900">Standard</p>
                  <p className="text-xs text-gray-500">
                    {(() => {
                      const prices = (event?.ticket_tiers || []).map(t => t.price).filter(Boolean);
                      if (prices.length === 0) return '';
                      const min = Math.min(...prices), max = Math.max(...prices);
                      return min === max ? `${formatPrice(min)} mỗi ghế` : `${formatPrice(min)} ~ ${formatPrice(max)} mỗi ghế`;
                    })()}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-100 pt-3">
                Choose from a range of standard tickets. Based on demand, the price of tickets may change.
              </p>
              <div className="mt-6 space-y-2">
                {(event?.ticket_tiers || []).map(tier => (
                  <div key={tier.id} className="flex items-center gap-2.5 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: tier.color || TM_BLUE }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800">{tier.name}</p>
                      <p className="text-[10px] text-gray-400">{formatPrice(tier.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── FILTER + EMPTY (Micro, no selection) ── */}
          {sidebarState === 'empty' && (
            <div className="flex flex-col h-full">
              {/* Info banner */}
              <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
                </svg>
                <span className="text-[10px] text-blue-700 font-medium">INFORMATION FOR WHEELCHAIR USERS</span>
                <svg viewBox="0 0 24 24" className="w-3 h-3 text-blue-600 ml-auto" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M3 6h18M7 12h10M11 18h2" />
                  </svg>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Filter by</span>
                </div>
                <div className="flex gap-2">
                  <select value={priceFilter} onChange={e => setPriceFilter(e.target.value)}
                    className="flex-1 text-xs px-2.5 py-1.5 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option value="all">All Prices</option>
                    <option value="0-500000">Under 500k</option>
                    <option value="500000-1000000">500k – 1M</option>
                    <option value="1000000-3000000">1M – 3M</option>
                    <option value="3000000-99999999">Over 3M</option>
                  </select>
                  <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                    className="flex-1 text-xs px-2.5 py-1.5 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option value="all">All Ticket Types</option>
                    {uniqueTiers.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
                {/* Chair icons */}
                <div className="flex gap-2 mb-5">
                  <svg viewBox="0 0 40 48" className="w-10 h-12" fill="none">
                    <rect x="4" y="8" width="32" height="28" rx="4" fill="#3b82f6" />
                    <rect x="2" y="32" width="6" height="12" rx="2" fill="#374151" />
                    <rect x="32" y="32" width="6" height="12" rx="2" fill="#374151" />
                    <rect x="8" y="2" width="24" height="10" rx="3" fill="#60a5fa" />
                  </svg>
                  <svg viewBox="0 0 40 48" className="w-10 h-12" fill="none">
                    <rect x="4" y="8" width="32" height="28" rx="4" fill="#3b82f6" />
                    <rect x="2" y="32" width="6" height="12" rx="2" fill="#374151" />
                    <rect x="32" y="32" width="6" height="12" rx="2" fill="#374151" />
                    <rect x="8" y="2" width="24" height="10" rx="3" fill="#60a5fa" />
                  </svg>
                </div>
                <div className="w-16 h-0.5 bg-blue-600 mb-5 rounded-full" />
                <p className="text-sm font-bold text-gray-800 mb-1">Select your seats on the map</p>
                <p className="text-xs text-gray-400">Your choices will be added here</p>
              </div>
            </div>
          )}

          {/* ── SELECTION (Seats chosen) ── */}
          {sidebarState === 'selection' && (
            <div className="flex flex-col h-full">
              <div className="bg-[#026cdf] px-4 py-2 text-white text-[10px] font-bold uppercase tracking-widest flex-shrink-0">
                JOYB®
              </div>
              <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
                <h3 className="text-gray-900 font-bold text-base">Your Selection</h3>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">
                  Giá đã bao gồm phí dịch vụ. Phí thanh toán có thể được áp dụng tùy phương thức.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-gray-50">
                {selectedSeats.map(seat => (
                  <div key={seat.seatId} className="bg-white border border-blue-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-1 bg-[#026cdf] w-full" />
                    <div className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-[10px] text-gray-400">Regular Seating ⓘ</p>
                          <p className="text-sm font-bold text-gray-900">{seat.tierName}</p>
                        </div>
                        <button onClick={() => onSeatToggle?.(seat.seatId, { id: seat.tierId, name: seat.tierName, price: seat.price, color: seat.tierColor }, seat.sectionId, seat.row, seat.seat)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-0.5" title="Remove">
                          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6l-1 14H6L5 6" />
                          </svg>
                        </button>
                      </div>

                      <div className="text-[9px] text-blue-600 font-bold uppercase tracking-wide mb-0.5">Level</div>
                      <div className="text-xs font-medium text-gray-800 mb-2">Parterre</div>

                      <div className="flex gap-6 text-xs mb-2">
                        <div>
                          <div className="text-[9px] text-blue-600 font-bold uppercase tracking-wide">Section</div>
                          <div className="font-semibold text-gray-900">{seat.sectionId || '—'}</div>
                        </div>
                        <div>
                          <div className="text-[9px] text-blue-600 font-bold uppercase tracking-wide">Row</div>
                          <div className="font-semibold text-gray-900">{seat.row || '—'}</div>
                        </div>
                        <div>
                          <div className="text-[9px] text-blue-600 font-bold uppercase tracking-wide">Seat</div>
                          <div className="font-semibold text-gray-900">{(seat.seat ?? 0) + 1}</div>
                        </div>
                      </div>

                      <div className="text-sm font-bold text-gray-900 border-t border-gray-100 pt-2">
                        {formatPrice(seat.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
                <div className="flex justify-between items-center mb-1 text-sm">
                  <div className="flex items-center gap-1.5">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2}>
                      <rect x={1} y={4} width={22} height={16} rx={2} /><path d="M1 10h22" />
                    </svg>
                    <span className="text-xs text-gray-500">×{selectedSeats.length}</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {formatPrice(selectedSeats.reduce((s, seat) => s + (seat.price || 0), 0))}
                  </span>
                </div>
                <button onClick={onProceedToCheckout}
                  className="w-full h-11 bg-[#1db954] hover:bg-[#1aa34a] text-white font-bold rounded text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-green-200/50">
                  Get Tickets
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketmasterSeatMap;
