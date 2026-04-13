import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Stage, Layer, Rect, Group, Text } from 'react-konva';

/* ═══════════════════════════════════════════════════════
   CONFIG & CONSTANTS (Minimal Dark Theme)
   ═══════════════════════════════════════════════════════ */
const CANVAS_W = 1200;
const CANVAS_H = 800;

const TIERS = [
  { id: 't1', name: 'Category 1', color: '#E91E63', price: 2500000 },
  { id: 't2', name: 'Category 2', color: '#2196F3', price: 1500000 },
  { id: 't3', name: 'Category 3', color: '#4CAF50', price: 800000  },
  { id: 't4', name: 'Category 4', color: '#9C27B0', price: 450000  },
];

// Minimal initial layout (like a stadium or track)
const INIT_BLOCKS = [
  { id: 'OBJ-1', type: 'object',  name: 'MAIN STAGE', x: 400, y: 100, width: 400, height: 100 },
  { id: 'SEC-1', type: 'section', name: 'SEC 1', x: 280, y: 250, width: 220, height: 80, tier: 't2', price: 1500000, left: 12 },
  { id: 'SEC-2', type: 'section', name: 'SEC 2', x: 700, y: 250, width: 220, height: 80, tier: 't2', price: 1500000, left: 8  },
  { id: 'SEC-3', type: 'section', name: 'GA FLOOR', x: 280, y: 350, width: 640, height: 200, tier: 't3', price: 800000, left: 150 },
  { id: 'SEC-4', type: 'section', name: 'CAT 1 VIP', x: 500, y: 250, width: 200, height: 80, tier: 't1', price: 2500000, left: 4 },
];

const getTier = (id, tiers) => tiers.find(t => t.id === id) || tiers[0];
const fmt = p => new Intl.NumberFormat('vi-VN').format(p) + 'đ';

/* ═══════════════════════════════════════════════════════
   BLOCK — Minimal functional style
   ═══════════════════════════════════════════════════════ */
const Block = ({ b, sel, hov, onSel, onHov, onDrag, tiers }) => {
  const isObj = b.type === 'object';
  const t = getTier(b.tier, tiers);
  
  // Minimal styling colors
  const baseColor = isObj ? '#555555' : t.color;
  const fillOpacity = sel ? 0.9 : (hov ? 0.75 : 0.6);
  const strokeColor = sel ? '#FFFFFF' : (isObj ? '#666' : '#333');
  const strokeW = sel ? 2 : 1;

  return (
    <Group x={b.x} y={b.y} draggable={true}
      onDragEnd={e => onDrag(b.id, e.target.x(), e.target.y())}
      onClick={() => onSel(b.id)} onTap={() => onSel(b.id)}
      onMouseEnter={() => { onHov(b.id); document.body.style.cursor='pointer'; }}
      onMouseLeave={() => { onHov(null); document.body.style.cursor='default'; }}>

      {/* Tối giản: Hình chữ nhật cơ bản, góc bo cực nhẹ, mờ, viền mảnh */}
      <Rect
        width={b.width} height={b.height}
        fill={baseColor} opacity={fillOpacity}
        cornerRadius={6}
        stroke={strokeColor} strokeWidth={strokeW}
      />

      {/* Label: Text nhỏ, canh giữa, trắng/xám */}
      <Text x={0} y={b.height/2 - 6} width={b.width} align="center"
        text={b.name}
        fontSize={12}
        fontFamily="sans-serif"
        fill="#EEEEEE"
        listening={false}
      />
    </Group>
  );
};

/* ═══════════════════════════════════════════════════════
   LIVE PREVIEW — Mini SVG Canvas
   ═══════════════════════════════════════════════════════ */
const Preview = ({ blocks, tiers }) => (
  <div className="bg-[#0A0A0A] border border-[#222] rounded-lg overflow-hidden flex flex-col h-48">
    <div className="px-3 py-2 bg-[#111] border-b border-[#222] text-[11px] font-bold text-gray-400">
      Preview
    </div>
    <div className="p-2 flex-grow overflow-hidden relative">
      <svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} className="w-full h-full object-contain">
        {blocks.map(b => {
          const isObj = b.type === 'object';
          const baseColor = isObj ? '#555' : getTier(b.tier, tiers).color;
          return (
            <g key={b.id}>
              <rect x={b.x} y={b.y} width={b.width} height={b.height} rx={6}
                fill={baseColor} fillOpacity={0.5} stroke="#333" strokeWidth={2} />
              <text x={b.x+b.width/2} y={b.y+b.height/2+4} textAnchor="middle"
                fill="#DDD" fontSize={16} fontFamily="sans-serif">{b.name}</text>
            </g>
          );
        })}
      </svg>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════
   SIDEBAR — Functional form inputs
   ═══════════════════════════════════════════════════════ */
const Side = ({ b, onChange, onDel, tiers }) => {
  if (!b) return (
    <div className="text-[13px] text-gray-500 text-center py-10">
      Chọn một section trên bản đồ để chỉnh sửa
    </div>
  );

  const isObj = b.type === 'object';
  const upd = (k, v) => onChange(b.id, { ...b, [k]: v });

  return (
    <div className="space-y-4">
      {/* Tên khu vực */}
      <div>
        <label className="block text-[11px] font-medium text-gray-400 mb-1">Tên {isObj ? 'đối tượng' : 'khu vực'}</label>
        <input value={b.name} onChange={e => upd('name', e.target.value)}
          className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-sm text-white focus:border-gray-400 outline-none" />
      </div>

      {!isObj && (
        <>
          {/* Hạng vé (Dropdown) */}
          <div>
            <label className="block text-[11px] font-medium text-gray-400 mb-1">Hạng vé (Category)</label>
            <select value={b.tier} onChange={e => upd('tier', e.target.value)}
              className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-sm text-white focus:border-gray-400 outline-none appearance-none">
              {tiers.map(tr => (
                <option key={tr.id} value={tr.id}>{tr.name} — {fmt(tr.price)}</option>
              ))}
            </select>
          </div>

          {/* Giá vé & Số lượng */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-gray-400 mb-1">Giá vé (đ)</label>
              <input type="number" value={b.price} onChange={e => upd('price', Number(e.target.value))}
                className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-sm text-white focus:border-gray-400 outline-none" />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-400 mb-1">Số lượng</label>
              <input type="number" value={b.left} onChange={e => upd('left', Number(e.target.value))}
                className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-sm text-white focus:border-gray-400 outline-none" />
            </div>
          </div>
          
          {/* View Image */}
          <div className="pt-2">
            <label className="block text-[11px] font-medium text-gray-400 mb-1">Ảnh góc nhìn (View Image URL)</label>
            <input type="text" value={b.viewImage || ''} onChange={e => upd('viewImage', e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-sm text-white focus:border-gray-400 outline-none" />
          </div>
        </>
      )}

      {/* Kích thước */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-medium text-gray-400 mb-1">Chiều rộng (W)</label>
          <input type="number" value={b.width} onChange={e => upd('width', Number(e.target.value))}
            className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-sm text-white focus:border-gray-400 outline-none" />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-gray-400 mb-1">Chiều cao (H)</label>
          <input type="number" value={b.height} onChange={e => upd('height', Number(e.target.value))}
            className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-sm text-white focus:border-gray-400 outline-none" />
        </div>
      </div>

      {/* Xóa */}
      <div className="pt-2">
        <button onClick={() => onDel(b.id)}
          className="w-full py-2 bg-[#222] hover:bg-red-500/20 hover:text-red-400 text-gray-300 rounded border border-[#333] hover:border-red-500/30 text-sm font-medium transition-colors">
          Xóa {isObj ? 'đối tượng' : 'khu vực'}
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   MAIN EDITOR COMPONENT
   ══════════════════════════════════════════════════════════ */
const OrganizerSeatMapEditor = ({ initialBlocks, onChange, tiers = TIERS }) => {
  const [blocks, setBlocks] = useState(initialBlocks || INIT_BLOCKS);
  const [selId, setSelId] = useState(null);
  const [hovId, setHovId] = useState(null);
  const [filterTier, setFilterTier] = useState(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x:0, y:0 });
  
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const [cW, setCW] = useState(800);

  // Responsive Width
  useEffect(() => {
    const u = () => { if (containerRef.current) setCW(containerRef.current.offsetWidth); };
    u(); window.addEventListener('resize', u);
    return () => window.removeEventListener('resize', u);
  }, []);

  useEffect(() => { onChange?.(blocks); }, [blocks]);

  // Zoom
  const handleWheel = useCallback(e => {
    e.evt.preventDefault();
    const s = stageRef.current;
    if (!s) return;
    const ptr = s.getPointerPosition();
    const mp = { x:(ptr.x-pos.x)/scale, y:(ptr.y-pos.y)/scale };
    const d = e.evt.deltaY > 0 ? -1 : 1;
    // Scale nhẹ: 1.05 cho mượt mà
    const next = Math.min(Math.max(scale*(d>0?1.05:1/1.05), 0.3), 3.0);
    setScale(next);
    setPos({ x:ptr.x-mp.x*next, y:ptr.y-mp.y*next });
  }, [scale, pos]);

  const zoomIn  = () => setScale(s => Math.min(s*1.2, 3.0));
  const zoomOut = () => setScale(s => Math.max(s/1.2, 0.3));
  const reset   = () => { setScale(1); setPos({x:0,y:0}); };

  // CRUD
  const addBlock = (type = 'section') => {
    const id = `${type==='object'?'OBJ':'SEC'}-${Date.now().toString(36)}`;
    const newBlock = type === 'object'
      ? { id, type, name:'NEW OBJECT', x:300, y:200, width:150, height:80 }
      : { id, type, name:'NEW SEC', x:400, y:300, width:120, height:60, tier:'t3', price:500000, left:50 };
      
    setBlocks(p => [...p, newBlock]);
    setSelId(id);
  };

  const updateBlock = (id, data) => setBlocks(p => p.map(b => b.id===id ? {...b,...data} : b));

  const deleteBlock = id => {
    setBlocks(p => p.filter(b => b.id!==id));
    if (selId===id) setSelId(null);
  };

  // Drag: không snap grid phức tạp, di chuyển tự do
  const handleDrag = (id, x, y) => {
    updateBlock(id, { x, y });
  };

  const deselect = e => { if (e.target === e.target.getStage()) setSelId(null); };

  const selBlock = blocks.find(b => b.id===selId);
  const cH = useMemo(() => Math.round(cW*CANVAS_H/CANVAS_W), [cW]);

  return (
    <div className="flex gap-6 w-full font-sans" style={{ minHeight: 600 }}>

      {/* ════ LEFT: MAIN MAP AREA ════ */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header / Legend (Top) */}
        <div className="flex items-center space-x-2 mb-4 overflow-x-auto pb-1">
          <button onClick={() => setFilterTier(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border ${
              !filterTier ? 'bg-[#333] text-white border-[#555]' : 'bg-transparent text-gray-500 border-[#222] hover:text-gray-300'
            }`}>
            All Categories
          </button>
          {TIERS.map(t => (
            <button key={t.id} onClick={() => setFilterTier(filterTier===t.id ? null : t.id)}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
                filterTier===t.id ? 'text-white' : 'bg-[#111] text-gray-400 border-[#222] hover:bg-[#1a1a1a]'
              }`}
              style={filterTier===t.id ? { backgroundColor: t.color+'30', borderColor: t.color } : {}}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor:t.color }} />
              <span>{t.name}</span>
              <span className="text-gray-500 ml-1">{fmt(t.price)}</span>
            </button>
          ))}
        </div>

        {/* Canvas Workspace: Nền đen tuyền/xám đậm, không grid */}
        <div ref={containerRef}
          className="rounded-lg overflow-hidden border border-[#222] relative flex-grow bg-[#0A0A0A]">

          <Stage ref={stageRef}
            width={cW} height={cH}
            scaleX={scale*(cW/CANVAS_W)} scaleY={scale*(cH/CANVAS_H)}
            x={pos.x} y={pos.y}
            draggable onWheel={handleWheel}
            onDragEnd={e => { if (e.target===stageRef.current) setPos({x:e.target.x(),y:e.target.y()}); }}
            onClick={deselect} onTap={deselect}>
            
            <Layer>
              {/* Vẽ Objects trước (Dưới) */}
              {blocks.filter(b=>b.type === 'object').map(b => (
                 <Block key={b.id} b={b} sel={selId===b.id} hov={hovId===b.id}
                   onSel={setSelId} onHov={setHovId} onDrag={handleDrag} tiers={tiers} />
              ))}

              {/* Vẽ Sections sau (Trên) */}
              {blocks.filter(b=>b.type !== 'object').map(b => (
                <Group key={b.id} opacity={filterTier && b.tier!==filterTier ? 0.3 : 1}>
                  <Block b={b} sel={selId===b.id} hov={hovId===b.id}
                    onSel={setSelId} onHov={setHovId} onDrag={handleDrag} tiers={tiers} />
                </Group>
              ))}
            </Layer>
          </Stage>

          {/* Floating Toolbar Mỏng, icon xám/trắng */}
          <div className="absolute bottom-4 right-4 flex flex-col space-y-2 bg-[#111] p-1.5 rounded-lg border border-[#222] shadow-lg">
            <button onClick={() => addBlock('section')} title="Thêm Khu Vực (Section)" className="w-8 h-8 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#222] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </button>
            <button onClick={() => addBlock('object')} title="Thêm Vật thể (Sân Khấu)" className="w-8 h-8 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#222] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" /></svg>
            </button>
            <div className="w-6 mx-auto h-px bg-[#333]" />
            <button onClick={zoomIn} title="Zoom in" className="w-8 h-8 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#222] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
            </button>
            <button onClick={zoomOut} title="Zoom out" className="w-8 h-8 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#222] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg>
            </button>
            <button onClick={reset} title="Reset" className="w-8 h-8 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#222] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 3A9 9 0 0121 10.5M10.5 21A9 9 0 013 13.5" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ════ RIGHT: SIDEBAR & PREVIEW ════ */}
      <div className="w-64 shrink-0 flex flex-col space-y-4">
        
        {/* Properties Form */}
        <div className="bg-[#0A0A0A] border border-[#222] rounded-lg p-4">
          <div className="text-[14px] font-bold text-gray-200 mb-4 pb-2 border-b border-[#222]">
            Properties
          </div>
          <Side b={selBlock} onChange={updateBlock} onDel={deleteBlock} tiers={tiers} />
        </div>

        {/* Live Preview */}
        <Preview blocks={blocks} tiers={tiers} />
      </div>

    </div>
  );
};

export default OrganizerSeatMapEditor;
