/**
 * SeatRenderer.jsx
 * Bộ render ghế ngồi chuyên dụng bằng Konva.js (Canvas 2D) cho JoyB.VN
 *
 * Hỗ trợ dữ liệu row thực tế từ database: [{label: "AA", seats: 8}, ...]
 * Mỗi hàng có thể có số ghế khác nhau, render căn giữa theo hàng rộng nhất.
 *
 * Props:
 *   section       - Object section từ DB (id, label, rows: [{label, seats}], tierId)
 *   tier          - Object tier (id, name, color, price)
 *   selectedSeats - Array các ghế đã chọn [{seatId, ...}]
 *   soldSeats     - Array các seatId đã bán (từ API bookedSeats)
 *   onSeatToggle  - Callback khi click ghế: (seatId, tier, sectionId, rowLabel, colIndex) => void
 *   onClose       - Callback khi nhấn nút quay lại
 *   formatPrice   - Hàm format giá tiền
 */
import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Stage, Layer, Rect, Circle, Text, Group, Line } from 'react-konva';

/* ═══════════════════════════════════════════════════════════
   CONSTANTS — Cấu hình kích thước và màu sắc theo StyleGuide
   ═══════════════════════════════════════════════════════════ */
const SEAT_GAP = 4;
const ROW_LABEL_WIDTH = 36;
const COL_LABEL_HEIGHT = 22;
const PADDING = 24;

// Palette JoyB.VN Dark Theme
const COLORS = {
  background: '#0A0A0F',
  surface: '#13131A',
  surfaceAlt: '#1C1C28',
  border: '#2A2A3D',
  textPrimary: '#F1F0FF',
  textMuted: '#8B8BA0',
  sold: '#374151',
  soldCross: '#1f2937',
  selectedRing: '#FFFFFF',
  checkMark: '#000000',
  tooltipBg: '#1C1C28',
  tooltipBorder: '#7C3AED',
};

/* ═══════════════════════════════════════════════════════════
   HELPER — Tính bán kính ghế tự động theo tổng số ghế
   ═══════════════════════════════════════════════════════════ */
const calcSeatRadius = (totalSeats) => {
  if (totalSeats <= 30) return 13;
  if (totalSeats <= 60) return 11;
  if (totalSeats <= 120) return 9;
  if (totalSeats <= 300) return 7;
  return 5;
};

/* ═══════════════════════════════════════════════════════════
   HELPER — Parse section.rows thành mảng chuẩn
   Hỗ trợ cả format mới [{label, seats}] và cũ (number)
   ═══════════════════════════════════════════════════════════ */
const parseRows = (section) => {
  const rawRows = section?.rows;

  // Format mới: rows là mảng [{label: "AA", seats: 8}, ...]
  if (Array.isArray(rawRows) && rawRows.length > 0 && typeof rawRows[0] === 'object') {
    return rawRows.map((r) => ({
      label: r.label || '?',
      seats: r.seats || 0,
    }));
  }

  // Format cũ: rows là số nguyên, seatsPerRow là số nguyên
  const numRows = typeof rawRows === 'number' ? rawRows : 4;
  const numCols = section?.seatsPerRow || 10;
  return Array.from({ length: numRows }, (_, i) => ({
    label: String.fromCharCode(65 + (i % 26)),
    seats: numCols,
  }));
};

/* ═══════════════════════════════════════════════════════════
   COMPONENT: SeatDot — Một ghế đơn lẻ trên canvas
   ═══════════════════════════════════════════════════════════ */
const SeatDot = ({ x, y, radius, status, color, seatId, onToggle, onHoverIn, onHoverOut }) => {

  // Ghế đã bán — mờ, không tương tác
  if (status === 'sold') {
    return (
      <Group x={x} y={y} opacity={0.2}>
        <Circle radius={radius} fill={COLORS.sold} />
        <Line
          points={[-radius * 0.35, -radius * 0.35, radius * 0.35, radius * 0.35]}
          stroke={COLORS.soldCross}
          strokeWidth={1.5}
          lineCap="round"
        />
      </Group>
    );
  }

  return (
    <Group
      x={x}
      y={y}
      onClick={() => onToggle?.(seatId)}
      onTap={() => onToggle?.(seatId)}
      onMouseEnter={(e) => {
        document.body.style.cursor = 'pointer';
        onHoverIn?.(seatId, e);
      }}
      onMouseLeave={() => {
        document.body.style.cursor = 'default';
        onHoverOut?.();
      }}
    >
      {/* Vòng sáng khi đã chọn */}
      {status === 'selected' && (
        <Circle
          radius={radius + 3}
          fill="transparent"
          stroke={COLORS.selectedRing}
          strokeWidth={1.5}
          opacity={0.5}
        />
      )}

      {/* Ghế chính */}
      <Circle
        radius={radius}
        fill={status === 'selected' ? '#FFFFFF' : color}
        opacity={status === 'selected' ? 1 : 0.65}
      />

      {/* Dấu check khi đã chọn */}
      {status === 'selected' && radius >= 7 && (
        <Text
          x={-radius}
          y={-radius * 0.7}
          width={radius * 2}
          height={radius * 2}
          text="✓"
          fontSize={Math.max(7, radius)}
          fontStyle="bold"
          fill={COLORS.checkMark}
          align="center"
          verticalAlign="middle"
          listening={false}
        />
      )}
    </Group>
  );
};

/* ═══════════════════════════════════════════════════════════
   COMPONENT: SeatTooltip — Popup thông tin ghế khi hover
   ═══════════════════════════════════════════════════════════ */
const SeatTooltip = ({ info, stageWidth }) => {
  if (!info) return null;

  const tooltipW = 160;
  const tooltipH = 56;

  let tx = info.x - tooltipW / 2;
  let ty = info.y - 14 - tooltipH - 8;

  if (tx < 4) tx = 4;
  if (tx + tooltipW > stageWidth - 4) tx = stageWidth - tooltipW - 4;
  if (ty < 4) ty = info.y + 14 + 8;

  return (
    <Group x={tx} y={ty} listening={false}>
      <Rect
        width={tooltipW}
        height={tooltipH}
        fill={COLORS.tooltipBg}
        stroke={COLORS.tooltipBorder}
        strokeWidth={1}
        cornerRadius={8}
        shadowColor="#000"
        shadowBlur={12}
        shadowOpacity={0.5}
      />
      {/* Dòng 1: Tên ghế */}
      <Text
        x={10}
        y={9}
        text={info.label}
        fontSize={12}
        fontStyle="bold"
        fill={COLORS.textPrimary}
        listening={false}
      />
      {/* Dòng 2: Hạng vé + Giá */}
      <Text
        x={10}
        y={28}
        text={info.tierName}
        fontSize={10}
        fill={COLORS.textMuted}
        listening={false}
      />
      <Text
        x={tooltipW - 10}
        y={28}
        text={info.price}
        fontSize={10}
        fontStyle="bold"
        fill={COLORS.textPrimary}
        align="right"
        width={65}
        listening={false}
      />
    </Group>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT: SeatRenderer
   ═══════════════════════════════════════════════════════════ */
const SeatRenderer = ({
  section,
  tier,
  selectedSeats = [],
  soldSeats = [],
  onSeatToggle,
  onClose,
  formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + 'đ',
}) => {
  const containerRef = useRef(null);
  const stageRef = useRef(null);

  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [tooltipInfo, setTooltipInfo] = useState(null);

  // Parse dữ liệu rows từ section
  const parsedRows = useMemo(() => parseRows(section), [section]);
  const color = tier?.color || '#7C3AED';

  // Tính kích thước grid dựa trên dữ liệu thực tế
  const maxCols = useMemo(() => Math.max(...parsedRows.map((r) => r.seats), 1), [parsedRows]);
  const totalSeats = useMemo(() => parsedRows.reduce((sum, r) => sum + r.seats, 0), [parsedRows]);
  const seatRadius = useMemo(() => calcSeatRadius(totalSeats), [totalSeats]);
  const cellSize = seatRadius * 2 + SEAT_GAP;

  // Kích thước canvas nội bộ
  const gridWidth = ROW_LABEL_WIDTH + maxCols * cellSize + PADDING * 2;
  const gridHeight = COL_LABEL_HEIGHT + parsedRows.length * cellSize + PADDING * 2 + 36;

  // Responsive — theo dõi kích thước container
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

  // Fit scale — canvas vừa khít container
  const fitScale = useMemo(() => {
    const sx = dimensions.width / gridWidth;
    const sy = dimensions.height / gridHeight;
    return Math.min(sx, sy) * 0.92;
  }, [dimensions, gridWidth, gridHeight]);

  // Center offset — canh giữa grid
  const centerOffset = useMemo(() => ({
    x: (dimensions.width - gridWidth * fitScale) / 2,
    y: (dimensions.height - gridHeight * fitScale) / 2,
  }), [dimensions, gridWidth, gridHeight, fitScale]);

  // Khởi tạo scale/pos khi section thay đổi
  useEffect(() => {
    setStageScale(fitScale);
    setStagePos(centerOffset);
    setTooltipInfo(null);
  }, [fitScale, centerOffset]);

  // Zoom: Scroll chuột
  const handleWheel = useCallback((e) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    const oldScale = stageScale;
    const mousePointTo = {
      x: (pointer.x - stagePos.x) / oldScale,
      y: (pointer.y - stagePos.y) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const factor = 1.1;
    const newScale = direction > 0 ? oldScale * factor : oldScale / factor;
    const clampedScale = Math.min(Math.max(newScale, fitScale * 0.5), fitScale * 5);

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

  // Toggle ghế — gọi callback lên parent
  const handleSeatToggle = useCallback((seatId) => {
    const parts = seatId.split('-');
    const colIndex = parseInt(parts.pop(), 10);
    const rowLabel = parts.pop();
    const sectionId = parts.join('-');
    onSeatToggle?.(seatId, tier, sectionId, rowLabel, colIndex);
  }, [tier, onSeatToggle]);

  // Hover → tooltip
  const handleHoverIn = useCallback((seatId, e) => {
    const parts = seatId.split('-');
    const colIndex = parseInt(parts.pop(), 10);
    const rowLabel = parts.pop();

    // Tìm index row để tính tọa độ Y
    const rowIndex = parsedRows.findIndex((r) => r.label === rowLabel);
    if (rowIndex < 0) return;

    const rowData = parsedRows[rowIndex];
    // Tính offset X (ghế được căn giữa theo maxCols)
    const rowOffset = (maxCols - rowData.seats) / 2;
    const nodeX = PADDING + ROW_LABEL_WIDTH + (rowOffset + colIndex) * cellSize + cellSize / 2;
    const nodeY = PADDING + 36 + COL_LABEL_HEIGHT + rowIndex * cellSize + cellSize / 2;

    setTooltipInfo({
      x: nodeX,
      y: nodeY,
      label: `Hàng ${rowLabel} · Ghế ${colIndex + 1}`,
      tierName: tier?.name || 'Standard',
      price: formatPrice(tier?.price || 0),
    });
  }, [parsedRows, maxCols, cellSize, tier, formatPrice]);

  const handleHoverOut = useCallback(() => {
    setTooltipInfo(null);
  }, []);

  // Thống kê ghế
  const stats = useMemo(() => {
    let available = 0;
    let sold = 0;

    parsedRows.forEach((rowData) => {
      for (let c = 0; c < rowData.seats; c++) {
        const seatId = `${section?.id}-${rowData.label}-${c}`;
        if (soldSeats.includes(seatId)) {
          sold++;
        } else {
          available++;
        }
      }
    });

    const selected = selectedSeats.filter((s) => s.seatId?.startsWith(section?.id + '-')).length;
    return { total: totalSeats, available, sold, selected };
  }, [parsedRows, section, selectedSeats, soldSeats, totalSeats]);

  if (!section) return null;

  return (
    <div
      className="absolute top-0 left-0 right-0 bottom-0 z-20 flex flex-col bg-[#0A0A0F]/97 backdrop-blur-sm"
      style={{ animation: 'fadeIn 200ms ease-out' }}
    >
      {/* ═══ HEADER BAR ═══ */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#111]/90 border-b border-[#2A2A3D] shrink-0">
        <div className="flex items-center space-x-3">
          {/* Nút quay lại */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1C1C28] hover:bg-[#2A2A3D] flex items-center justify-center transition-colors duration-200"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Thông tin section */}
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
              <span className="text-sm font-bold text-white">{section.label || section.id}</span>
              <span className="text-xs text-gray-500">— {tier?.name || 'Standard'}</span>
            </div>
            <div className="flex items-center space-x-3 mt-0.5">
              <span className="text-[10px] text-gray-500">
                {stats.available} / {stats.total} ghế trống
              </span>
              {tier?.price > 0 && (
                <span className="text-[10px] font-bold text-white">{formatPrice(tier.price)}</span>
              )}
            </div>
          </div>
        </div>

        {/* Badge số ghế đã chọn + Zoom controls */}
        <div className="flex items-center space-x-2">
          {stats.selected > 0 && (
            <span className="text-xs font-bold bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
              {stats.selected} đã chọn
            </span>
          )}

          <div className="flex items-center space-x-1 ml-2">
            <button
              onClick={() => setStageScale((s) => Math.min(s * 1.3, fitScale * 5))}
              className="w-7 h-7 rounded bg-[#1C1C28] hover:bg-[#2A2A3D] flex items-center justify-center text-gray-400 text-xs font-bold transition-colors"
            >+</button>
            <button
              onClick={() => setStageScale((s) => Math.max(s / 1.3, fitScale * 0.5))}
              className="w-7 h-7 rounded bg-[#1C1C28] hover:bg-[#2A2A3D] flex items-center justify-center text-gray-400 text-xs font-bold transition-colors"
            >−</button>
            <button
              onClick={resetZoom}
              className="w-7 h-7 rounded bg-[#1C1C28] hover:bg-[#2A2A3D] flex items-center justify-center transition-colors"
              title="Reset zoom"
            >
              <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M4 4v5h5M20 20v-5h-5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.5 3A9 9 0 0 1 21 10.5M10.5 21A9 9 0 0 1 3 13.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ═══ KONVA CANVAS — Khu vực render ghế ═══ */}
      <div ref={containerRef} className="flex-1 min-h-0 relative" style={{ background: COLORS.background }}>
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
            {/* Nền tối cho khu vực ghế */}
            <Rect
              x={0}
              y={0}
              width={gridWidth}
              height={gridHeight}
              fill={COLORS.surface}
              cornerRadius={12}
              stroke={color}
              strokeWidth={1.5}
              opacity={0.8}
            />

            {/* Tên section ở đầu */}
            <Text
              x={0}
              y={PADDING / 2}
              width={gridWidth}
              text={section.label || section.id}
              fontSize={16}
              fontStyle="bold"
              fill={color}
              align="center"
              letterSpacing={2}
              listening={false}
            />

            {/* Column labels (1, 2, 3...) — dùng maxCols */}
            {Array.from({ length: maxCols }).map((_, c) => (
              <Text
                key={`col-${c}`}
                x={PADDING + ROW_LABEL_WIDTH + c * cellSize}
                y={PADDING + 28}
                width={cellSize}
                text={String(c + 1)}
                fontSize={9}
                fill={COLORS.textMuted}
                align="center"
                listening={false}
              />
            ))}

            {/* Row labels + Ghế ngồi — dựa trên parsedRows */}
            {parsedRows.map((rowData, rowIndex) => {
              const baseY = PADDING + 36 + COL_LABEL_HEIGHT + rowIndex * cellSize + cellSize / 2;
              // Offset X để căn giữa hàng ngắn hơn
              const rowOffset = (maxCols - rowData.seats) / 2;

              return (
                <Group key={`row-${rowData.label}-${rowIndex}`}>
                  {/* Label hàng (AA, BB, CC... hoặc A, B, C...) */}
                  <Text
                    x={PADDING}
                    y={baseY - 5}
                    width={ROW_LABEL_WIDTH - 4}
                    text={rowData.label}
                    fontSize={10}
                    fontStyle="bold"
                    fill={COLORS.textMuted}
                    align="center"
                    listening={false}
                  />

                  {/* Render từng ghế trong hàng */}
                  {Array.from({ length: rowData.seats }).map((_, c) => {
                    const seatId = `${section.id}-${rowData.label}-${c}`;
                    const cx = PADDING + ROW_LABEL_WIDTH + (rowOffset + c) * cellSize + cellSize / 2;

                    // Trạng thái ghế: dùng soldSeats từ API (không hash giả lập)
                    let status = 'available';
                    if (soldSeats.includes(seatId)) {
                      status = 'sold';
                    } else if (selectedSeats.some((s) => s.seatId === seatId)) {
                      status = 'selected';
                    }

                    return (
                      <SeatDot
                        key={seatId}
                        x={cx}
                        y={baseY}
                        radius={seatRadius}
                        status={status}
                        color={color}
                        seatId={seatId}
                        onToggle={handleSeatToggle}
                        onHoverIn={handleHoverIn}
                        onHoverOut={handleHoverOut}
                      />
                    );
                  })}
                </Group>
              );
            })}
          </Layer>

          {/* Tooltip layer — luôn trên cùng */}
          <Layer listening={false}>
            <SeatTooltip info={tooltipInfo} stageWidth={gridWidth} />
          </Layer>
        </Stage>

        {/* Zoom indicator */}
        {Math.abs(stageScale - fitScale) > 0.01 && (
          <div className="absolute top-3 right-3 text-[9px] text-gray-500 bg-black/50 px-2 py-1 rounded pointer-events-none">
            {Math.round((stageScale / fitScale) * 100)}%
          </div>
        )}
      </div>

      {/* ═══ FOOTER — Legend + Phím tắt ═══ */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0f1014] border-t border-[#2A2A3D] shrink-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color, opacity: 0.65 }}></div>
            <span className="text-[9px] font-bold text-gray-400">Còn trống</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-white border border-gray-400 flex items-center justify-center">
              <span className="text-[5px] font-black text-black">✓</span>
            </div>
            <span className="text-[9px] font-bold text-white">Đã chọn</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-gray-700 opacity-30"></div>
            <span className="text-[9px] font-bold text-gray-600">Đã bán</span>
          </div>
        </div>

        <span className="text-[9px] text-gray-600">
          Scroll → zoom · Kéo → di chuyển · Click ghế → chọn/bỏ chọn
        </span>
      </div>
    </div>
  );
};

export default SeatRenderer;
