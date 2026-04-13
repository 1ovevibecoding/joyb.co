import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Stage, Layer, Rect, Circle, Text, Group, Line } from 'react-konva';
import { useLanguage } from '../context/LanguageContext';

const COLORS = {
  bg: '#0a0b0f',
  soldFill: '#2a2b36',
  soldStroke: '#4b5563',
  selectedMain: '#7C3AED',
  tooltipBg: '#ffffff',
  tooltipBorder: '#cbd5e1',
  tooltipText: '#0f172a'
};

const SEAT_RADIUS = 6;
const SEAT_GAP = 3;
const CELL = SEAT_RADIUS * 2 + SEAT_GAP;

const SeatMap = ({ event, selectedSeats = [], onSeatToggle, globalSoldSeats = [], lockedSeats = {}, localSessionId = '' }) => {
  const { t } = useLanguage();
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [zoom, setZoom] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [hoveredPos, setHoveredPos] = useState(null);

  // Responsive canvas size
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const layoutInfo = useMemo(() => {
    const raw = event?.venueLayout;
    if (!raw || !raw.sections) return { sections: [], mapBounds: { minX: 0, minY: 0, maxX: 1200, maxY: 800, w: 1200, h: 800 } };

    const itemsPerRow = 3;
    const spacingX = 60;
    const spacingY = 80;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    const sections = raw.sections.map((sec, idx) => {
      let parsedRows = [];
      if (Array.isArray(sec.rows) && sec.rows.length > 0 && typeof sec.rows[0] === 'object') {
        parsedRows = sec.rows.map(r => ({ label: r.label || '?', seats: r.seats || 0 }));
      } else {
        const numRows = typeof sec.rows === 'number' ? sec.rows : 4;
        const numCols = sec.seatsPerRow || 10;
        parsedRows = Array.from({ length: numRows }, (_, i) => ({
          label: String.fromCharCode(65 + (i % 26)),
          seats: numCols,
        }));
      }

      const maxCols = Math.max(...parsedRows.map(r => r.seats), 1);
      const boxW = maxCols * CELL;
      const boxH = parsedRows.length * CELL;

      // Assign global coordinates grid-style if missing 'x' and 'y'
      let px = sec.x;
      let py = sec.y;
      if (px === undefined || py === undefined) {
        const rowId = Math.floor(idx / itemsPerRow);
        const colId = idx % itemsPerRow;
        const itemsInThisRow = Math.min(itemsPerRow, raw.sections.length - rowId * itemsPerRow);
        const totalW = itemsInThisRow * boxW + (itemsInThisRow - 1) * spacingX;
        const centerX = raw.centerElement ? raw.centerElement.x + raw.centerElement.width / 2 : 600;
        px = centerX - totalW / 2 + colId * (boxW + spacingX);
        py = (raw.centerElement ? raw.centerElement.y + raw.centerElement.height + 60 : 200) + rowId * 250;
      }

      minX = Math.min(minX, px); minY = Math.min(minY, py);
      maxX = Math.max(maxX, px + boxW); maxY = Math.max(maxY, py + boxH);

      const seats = [];
      parsedRows.forEach((row, rIdx) => {
        const rowWidth = row.seats * CELL;
        const startX = (boxW - rowWidth) / 2 + SEAT_RADIUS;
        const cy = rIdx * CELL + SEAT_RADIUS;
        
        for (let c = 0; c < row.seats; c++) {
          seats.push({
            id: `${sec.id}-${row.label}-${c}`,
            rowLabel: row.label,
            seatIndex: c,
            cx: startX + c * CELL,
            cy: cy
          });
        }
      });

      const tier = (event.ticket_tiers || []).find(t => t.id === sec.tierId);
      return { 
        ...sec, 
        px, py, boxW, boxH, seats, 
        color: tier?.color || '#026cdf',
        tierName: tier?.name || 'Standard',
        price: tier?.price || 0
      };
    });

    return { 
      sections, 
      mapBounds: { minX, minY, maxX, maxY, w: Math.max(1200, maxX + 200), h: Math.max(800, maxY + 200) },
      centerElement: raw.centerElement || null
    };
  }, [event]);

  // Center Map on First Load
  useEffect(() => {
     if (dimensions.width > 0 && dimensions.height > 0 && layoutInfo.sections.length > 0) {
        const padding = 100;
        const mapW = layoutInfo.mapBounds.maxX - layoutInfo.mapBounds.minX + padding * 2;
        const scale = Math.min(1.5, dimensions.width / mapW);
        setZoom(scale > 0 ? scale : 1);
        
        const cx = (layoutInfo.mapBounds.minX + layoutInfo.mapBounds.maxX) / 2;
        setStagePos({
          x: dimensions.width / 2 - cx * scale,
          y: 80
        });
     }
  }, [dimensions.width, layoutInfo]);

  const handleWheel = useCallback((e) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    const mousePointTo = { x: (pointer.x - stage.x()) / oldScale, y: (pointer.y - stage.y()) / oldScale };
    
    let direction = e.evt.deltaY > 0 ? -1 : 1;
    if (e.evt.ctrlKey) direction = e.evt.deltaY > 0 ? -1 : 1;
    const scaleBy = 1.1;
    let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    newScale = Math.max(0.2, Math.min(newScale, 5));
    
    setZoom(newScale);
    setStagePos({ x: pointer.x - mousePointTo.x * newScale, y: pointer.y - mousePointTo.y * newScale });
  }, []);

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + 'đ';

  return (
    <div ref={containerRef} className="w-full h-full relative" style={{ backgroundColor: COLORS.bg }}>
      
      {/* Zoom Controls */}
      <div className="absolute top-6 right-6 z-10 flex flex-col space-y-2 bg-white/10 backdrop-blur-md rounded-lg p-1 shadow-lg border border-white/10">
         <button onClick={() => setZoom(z => Math.min(z * 1.2, 5))} className="w-8 h-8 rounded bg-[#1f1f23] text-white flex items-center justify-center font-bold hover:bg-gray-600 transition-colors">+</button>
         <button onClick={() => setZoom(z => Math.max(z / 1.2, 0.2))} className="w-8 h-8 rounded bg-[#1f1f23] text-white flex items-center justify-center font-bold hover:bg-gray-600 transition-colors">-</button>
      </div>

      {dimensions.width > 0 && dimensions.height > 0 && (
        <Stage 
          width={dimensions.width} 
          height={dimensions.height}
          draggable
          onWheel={handleWheel}
          x={stagePos.x}
          y={stagePos.y}
          scaleX={zoom}
          scaleY={zoom}
          onDragEnd={(e) => setStagePos({ x: e.target.x(), y: e.target.y() })}
          ref={stageRef}
        >
          <Layer>
            {/* Floor / Ring Design */}
            {layoutInfo.centerElement && (
              <Group x={layoutInfo.centerElement.x} y={layoutInfo.centerElement.y}>
                 <Rect 
                   width={layoutInfo.centerElement.width} 
                   height={layoutInfo.centerElement.height} 
                   fill="#1f1f23" 
                   cornerRadius={10} 
                   shadowColor="#fbbf24" 
                   shadowBlur={40} 
                   shadowOpacity={0.25} 
                   stroke="#fbbf24"
                   strokeWidth={2}
                 />
                 <Text 
                   text={layoutInfo.centerElement.label || "MAIN STAGE"} 
                   width={layoutInfo.centerElement.width} 
                   height={layoutInfo.centerElement.height}
                   align="center" 
                   verticalAlign="middle" 
                   fill="#ffffff" 
                   fontSize={28} 
                   fontStyle="900" 
                   letterSpacing={4} 
                 />
              </Group>
            )}

            {/* Sections & Seats */}
            {layoutInfo.sections.map(sec => (
              <Group key={sec.id} x={sec.px} y={sec.py}>
                 {/* Section Underlay */}
                 <Rect width={sec.boxW} height={sec.boxH} fill={sec.color} opacity={0.03} cornerRadius={8} />
                 <Text text={sec.id} x={0} y={-25} fontSize={14} fill={sec.color} fontStyle="bold" opacity={0.8} />

                 {sec.seats.map(seat => {
                   const isSold = globalSoldSeats.includes(seat.id);
                   const isSelected = selectedSeats.some(s => s.seatId === seat.id);
                   
                   const lockOwner = lockedSeats[seat.id];
                   const isLockedByOthers = lockOwner && lockOwner !== localSessionId;
                   
                   const status = isSelected ? 'selected' : (isSold ? 'sold' : (isLockedByOthers ? 'locked' : 'available'));
                   const isHovered = hoveredSeat?.id === seat.id;

                   return (
                     <Group 
                       key={seat.id} 
                       x={seat.cx} 
                       y={seat.cy}
                       onMouseEnter={(e) => {
                         if (status === 'sold' || status === 'locked') return;
                         document.body.style.cursor = 'pointer';
                         setHoveredSeat({ ...seat, tierName: sec.tierName, price: sec.price });
                         setHoveredPos({ 
                            x: e.target.absolutePosition().x, 
                            y: e.target.absolutePosition().y 
                         });
                       }}
                       onMouseLeave={() => {
                         document.body.style.cursor = 'default';
                         setHoveredSeat(null);
                       }}
                       onClick={() => !(isSold || isLockedByOthers) && onSeatToggle && onSeatToggle(seat.id, { id: sec.tierId, name: sec.tierName, price: sec.price, color: sec.color }, sec.id, seat.rowLabel, seat.seatIndex)}
                       onTap={() => !(isSold || isLockedByOthers) && onSeatToggle && onSeatToggle(seat.id, { id: sec.tierId, name: sec.tierName, price: sec.price, color: sec.color }, sec.id, seat.rowLabel, seat.seatIndex)}
                     >
                       <Circle 
                         radius={isHovered ? SEAT_RADIUS + 1.5 : SEAT_RADIUS} 
                         fill={status === 'sold' || status === 'locked' ? COLORS.soldFill : (status === 'selected' ? COLORS.selectedMain : sec.color)} 
                         opacity={status === 'sold' ? 0.2 : (status === 'locked' ? 0.5 : 1)}
                       />
                       {status === 'locked' && (
                         <Circle radius={SEAT_RADIUS - 2} fill="#6b7280" opacity={0.6} />
                       )}
                       {status === 'selected' && (
                         <Circle 
                           radius={SEAT_RADIUS + 3} 
                           stroke="#ffffff" 
                           strokeWidth={2}
                         />
                       )}
                     </Group>
                   );
                 })}
              </Group>
            ))}
          </Layer>
        </Stage>
      )}

      {/* Minimap radar overview could go here later */}

      {/* HTML Tooltip mapped to Stage absolute positions */}
      {hoveredSeat && hoveredPos && (
        <div 
          className="absolute z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{ 
            left: hoveredPos.x, 
            top: hoveredPos.y - 12,
          }}
        >
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 px-3 py-2 min-w-[120px]">
             <h4 className="font-bold text-gray-900 text-sm mb-0.5">{hoveredSeat.rowLabel} - Ghế {hoveredSeat.seatIndex + 1}</h4>
             <p className="font-medium text-blue-600 text-[11px] mb-1">{hoveredSeat.tierName}</p>
             <p className="font-bold text-gray-900 text-sm">{formatPrice(hoveredSeat.price)}</p>
          </div>
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white"></div>
        </div>
      )}
    </div>
  );
};

export default SeatMap;
