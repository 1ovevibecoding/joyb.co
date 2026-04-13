import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Stage, Layer, Rect, Circle, Text, Line, Path, Group, Label, Tag } from 'react-konva';

/**
 * VenueSectionMap — Konva-based venue renderer.
 * 
 * Renders any venue shape from JSON data.
 * Features: sections with hover glow, price badges, "X left", zoom/pan, click → emit section.
 * 
 * Props:
 *   venueData: { width, height, elements[], sections[] }
 *   onSectionSelect(section): callback when clicking a section
 *   selectedSectionId: currently selected section
 *   activeCategory: tier ID to filter (null = all)
 */
const VenueSectionMap = ({ venueData, onSectionSelect, selectedSectionId, activeCategory }) => {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [hoveredId, setHoveredId] = useState(null);
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        const h = containerRef.current.offsetHeight || 500;
        setDimensions({ width: w, height: h });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Scale to fit
  const fitScale = useMemo(() => {
    if (!venueData) return 1;
    const sx = dimensions.width / venueData.width;
    const sy = dimensions.height / venueData.height;
    return Math.min(sx, sy) * 0.92;
  }, [venueData, dimensions]);

  // Center offset
  const centerOffset = useMemo(() => {
    if (!venueData) return { x: 0, y: 0 };
    const scaledW = venueData.width * fitScale;
    const scaledH = venueData.height * fitScale;
    return {
      x: (dimensions.width - scaledW) / 2,
      y: (dimensions.height - scaledH) / 2
    };
  }, [venueData, fitScale, dimensions]);

  useEffect(() => {
    setStageScale(fitScale);
    setStagePos(centerOffset);
  }, [fitScale, centerOffset]);

  // Zoom with wheel
  const handleWheel = useCallback((e) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stageScale;
    const pointer = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointer.x - stagePos.x) / oldScale,
      y: (pointer.y - stagePos.y) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const factor = 1.08;
    const newScale = direction > 0 ? oldScale * factor : oldScale / factor;
    const clampedScale = Math.min(Math.max(newScale, fitScale * 0.5), fitScale * 4);

    setStageScale(clampedScale);
    setStagePos({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    });
  }, [stageScale, stagePos, fitScale]);

  // Reset zoom
  const resetZoom = useCallback(() => {
    setStageScale(fitScale);
    setStagePos(centerOffset);
  }, [fitScale, centerOffset]);

  const formatPrice = (p, currency) => {
    if (currency === 'USD') return '$' + new Intl.NumberFormat('en-US').format(p);
    return new Intl.NumberFormat('vi-VN').format(p) + 'đ';
  };

  if (!venueData) return null;

  // ===========================
  // RENDER DECORATIVE ELEMENTS
  // ===========================
  const renderElement = (el, i) => {
    const common = { key: `el-${i}`, opacity: el.opacity ?? 1, listening: false };

    if (el.type === 'rect') {
      return (
        <Rect {...common}
          x={el.x} y={el.y} width={el.width} height={el.height}
          fill={el.fill || 'transparent'} stroke={el.stroke} strokeWidth={el.strokeWidth || 1}
          cornerRadius={el.cornerRadius || 0} rotation={el.rotation || 0}
          shadowColor={el.glow ? el.glowColor : undefined}
          shadowBlur={el.glow ? 20 : 0}
          shadowOpacity={el.glow ? 0.6 : 0}
        />
      );
    }
    if (el.type === 'circle') {
      return (
        <Circle {...common}
          x={el.x} y={el.y} radius={el.radius}
          fill={el.fill || 'transparent'} stroke={el.stroke} strokeWidth={el.strokeWidth || 1}
        />
      );
    }
    if (el.type === 'text') {
      return (
        <Text {...common}
          x={el.x - 100} y={el.y - (el.fontSize || 14) / 2}
          width={200} align={el.align || 'center'}
          text={el.text} fontSize={el.fontSize || 14}
          fill={el.fill || '#fff'} fontStyle={el.fontStyle || 'normal'}
          letterSpacing={el.letterSpacing || 0}
        />
      );
    }
    if (el.type === 'line') {
      return (
        <Line {...common}
          points={el.points} stroke={el.stroke || '#fff'}
          strokeWidth={el.strokeWidth || 1}
        />
      );
    }
    if (el.type === 'path') {
      return (
        <Path {...common}
          data={el.pathData} fill={el.fill || 'transparent'}
          stroke={el.stroke || '#fff'} strokeWidth={el.strokeWidth || 1}
        />
      );
    }
    return null;
  };

  // ===========================
  // RENDER SECTIONS
  // ===========================
  const renderSection = (sec) => {
    const isHovered = hoveredId === sec.id;
    const isSelected = selectedSectionId === sec.id;
    const isFiltered = activeCategory && sec.tierId !== activeCategory;
    const isLowStock = sec.availableSeats <= 5 && sec.availableSeats > 0;
    const isSoldOut = sec.availableSeats === 0;
    const baseOpacity = isFiltered ? 0.08 : (isSoldOut ? 0.15 : (isHovered ? 0.7 : 0.35));
    const strokeColor = isSelected ? '#fff' : (isHovered ? '#fff' : sec.fill);
    const strokeW = isSelected ? 3 : (isHovered ? 2.5 : 1);

    const cx = sec.x + (sec.width || 0) / 2;
    const cy = sec.y + (sec.height || 0) / 2;

    return (
      <Group
        key={sec.id}
        onMouseEnter={() => { setHoveredId(sec.id); document.body.style.cursor = 'pointer'; }}
        onMouseLeave={() => { setHoveredId(null); document.body.style.cursor = 'default'; }}
        onClick={() => onSectionSelect?.(sec)}
        onTap={() => onSectionSelect?.(sec)}
      >
        {/* Section shape */}
        <Rect
          x={sec.x} y={sec.y} width={sec.width} height={sec.height}
          rotation={sec.rotation || 0}
          fill={sec.fill}
          opacity={baseOpacity}
          stroke={strokeColor}
          strokeWidth={strokeW}
          cornerRadius={4}
          shadowColor={isHovered ? sec.fill : undefined}
          shadowBlur={isHovered ? 25 : 0}
          shadowOpacity={isHovered ? 0.5 : 0}
        />

        {/* Section label */}
        {!isFiltered && (
          <Text
            x={cx - 50} y={cy - 10}
            width={100} align="center"
            text={sec.label || sec.id}
            fontSize={Math.min(13, Math.max(8, sec.width * 0.08))}
            fontStyle="bold"
            fill="#fff"
            opacity={isSoldOut ? 0.3 : 0.9}
            listening={false}
          />
        )}

        {/* Price badge */}
        {!isFiltered && !isSoldOut && sec.price && (
          <Group listening={false}>
            <Rect
              x={cx - 32} y={cy + 4}
              width={64} height={16} cornerRadius={3}
              fill={isHovered ? '#fff' : '#000'}
              opacity={isHovered ? 0.9 : 0.65}
            />
            <Text
              x={cx - 32} y={cy + 6}
              width={64} align="center"
              text={formatPrice(sec.price, sec.currency)}
              fontSize={8} fontStyle="bold"
              fill={isHovered ? '#000' : '#fff'}
            />
          </Group>
        )}

        {/* "Only X left" badge */}
        {!isFiltered && isLowStock && (
          <Group listening={false}>
            <Rect
              x={cx - 22} y={cy + 22}
              width={44} height={14} cornerRadius={7}
              fill="#ef4444"
            />
            <Text
              x={cx - 22} y={cy + 24}
              width={44} align="center"
              text={`${sec.availableSeats} left`}
              fontSize={7} fontStyle="bold" fill="#fff"
            />
          </Group>
        )}

        {/* Sold out overlay */}
        {isSoldOut && !isFiltered && (
          <Text
            x={cx - 30} y={cy + 4}
            width={60} align="center"
            text="SOLD OUT"
            fontSize={8} fontStyle="bold"
            fill="#ef4444" opacity={0.5}
            listening={false}
          />
        )}

        {/* Selected indicator */}
        {isSelected && (
          <Circle
            x={sec.x + sec.width - 8} y={sec.y + 8}
            radius={6} fill="#fff" stroke={sec.fill} strokeWidth={2}
            listening={false}
          />
        )}
      </Group>
    );
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-[#0a0b0f] relative" style={{ minHeight: 400 }}>
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePos.x}
        y={stagePos.y}
        draggable
        onWheel={handleWheel}
        onDragEnd={(e) => {
          setStagePos({ x: e.target.x(), y: e.target.y() });
        }}
      >
        <Layer>
          {/* Background elements */}
          {venueData.elements?.map((el, i) => renderElement(el, i))}
          
          {/* Sections */}
          {venueData.sections?.map(sec => renderSection(sec))}
        </Layer>
      </Stage>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-1.5">
        <button onClick={() => {
          const newScale = Math.min(stageScale * 1.3, fitScale * 4);
          setStageScale(newScale);
        }} className="w-8 h-8 bg-[#1a1a1e] hover:bg-[#2a2a2e] border border-[#333] rounded-lg flex items-center justify-center text-white font-bold text-sm transition-colors">+</button>
        <button onClick={() => {
          const newScale = Math.max(stageScale / 1.3, fitScale * 0.5);
          setStageScale(newScale);
        }} className="w-8 h-8 bg-[#1a1a1e] hover:bg-[#2a2a2e] border border-[#333] rounded-lg flex items-center justify-center text-white font-bold text-sm transition-colors">−</button>
        <button onClick={resetZoom}
          className="w-8 h-8 bg-[#1a1a1e] hover:bg-[#2a2a2e] border border-[#333] rounded-lg flex items-center justify-center transition-colors"
          title="Reset zoom">
          <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M4 4v5h5M20 20v-5h-5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13.5 3A9 9 0 0 1 21 10.5M10.5 21A9 9 0 0 1 3 13.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Zoom indicator */}
      {Math.abs(stageScale - fitScale) > 0.01 && (
        <div className="absolute top-3 right-3 text-[9px] text-gray-500 bg-black/50 px-2 py-1 rounded pointer-events-none">
          {Math.round((stageScale / fitScale) * 100)}%
        </div>
      )}
    </div>
  );
};

export default VenueSectionMap;
