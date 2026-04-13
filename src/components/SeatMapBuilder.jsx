import { useState, useRef, useCallback, useEffect } from 'react';
import { VENUE_TEMPLATES, applyTemplate } from '../data/venueTemplates';

const GRID = 20;
const CANVAS_W = 960;
const CANVAS_H = 700;

/**
 * SeatMapBuilder — Template-based venue editor for organizers.
 * 
 * 1. Pick a template (Stadium, Concert, Arena, Theater)
 * 2. Sections auto-generated with SVG paths
 * 3. Assign tiers to sections
 * 4. Output: JSON venueLayout that SeatMap renders
 */
const SeatMapBuilder = ({ tiers = [], onChange }) => {
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [generatedLayout, setGeneratedLayout] = useState(null);
  const [sectionTiers, setSectionTiers] = useState({}); // sectionId -> tierId overrides
  const [selectedSection, setSelectedSection] = useState(null);
  const [hoveredSection, setHoveredSection] = useState(null);
  const svgRef = useRef(null);

  // Apply template
  const handleApplyTemplate = (key) => {
    setActiveTemplate(key);
    const layout = applyTemplate(key, tiers);
    if (layout) {
      setGeneratedLayout(layout);
      setSectionTiers({});
      setSelectedSection(null);
    }
  };

  // Override a section's tier
  const assignTier = (sectionId, tierId) => {
    setSectionTiers(prev => ({ ...prev, [sectionId]: tierId }));
  };

  // Emit the venueLayout to parent whenever anything changes
  useEffect(() => {
    if (!onChange || !generatedLayout) return;

    const sections = generatedLayout.sections.map(s => ({
      ...s,
      tierId: sectionTiers[s.id] || s.tierId
    }));

    onChange({
      ...generatedLayout,
      sections
    });
  }, [generatedLayout, sectionTiers, tiers]);

  // Also emit on initial render if no template selected (legacy support)
  useEffect(() => {
    if (!onChange || generatedLayout) return;
    // Send empty layout so parent knows no custom map
    onChange(null);
  }, []);

  const selectedSec = generatedLayout?.sections?.find(s => s.id === selectedSection);

  return (
    <div className="space-y-4">
      {/* ===== TEMPLATE PICKER ===== */}
      <div className="bg-[#111] border border-[#2a2a30] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-white">Chọn kiểu địa điểm</span>
          <span className="text-[9px] text-gray-600">Click để tự động tạo sơ đồ chuyên nghiệp</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(VENUE_TEMPLATES).map(([key, tmpl]) => (
            <button
              key={key}
              onClick={() => handleApplyTemplate(key)}
              className={`flex flex-col items-center p-4 rounded-xl border transition-all ${
                activeTemplate === key
                  ? 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/30 shadow-lg shadow-purple-500/10'
                  : 'border-[#2a2a30] bg-[#0a0a0a] hover:border-gray-600 hover:bg-[#151515]'
              }`}
            >
              {/* Mini preview SVG */}
              <div className="w-full h-20 mb-2 rounded bg-[#0a0a0a] overflow-hidden">
                <svg viewBox={tmpl.viewBox} className="w-full h-full">
                  {tmpl.background && (
                    <path d={tmpl.background.path} fill={tmpl.background.color} opacity="0.15" stroke={tmpl.background.color} strokeWidth="2" />
                  )}
                  {tmpl.sections.map(s => (
                    <path key={s.id} d={s.path} fill={tiers[s.tierIndex]?.color || '#666'} opacity="0.35" stroke={tiers[s.tierIndex]?.color || '#666'} strokeWidth="1" />
                  ))}
                </svg>
              </div>
              <span className={`text-[11px] font-bold ${activeTemplate === key ? 'text-purple-300' : 'text-gray-400'}`}>
                {tmpl.name}
              </span>
              <span className="text-[9px] text-gray-600 mt-0.5">{tmpl.sections.length} khu vực</span>
            </button>
          ))}
        </div>
      </div>

      {/* ===== CANVAS + SIDEBAR ===== */}
      {generatedLayout && (
        <div className="flex gap-4">
          {/* SVG Canvas */}
          <div className="flex-1 bg-[#0a0b0f] border border-[#2a2a30] rounded-xl overflow-hidden">
            <svg
              ref={svgRef}
              viewBox={generatedLayout.viewBox}
              preserveAspectRatio="xMidYMid meet"
              className="w-full"
              style={{ aspectRatio: '5/4' }}
              onClick={() => setSelectedSection(null)}
            >
              {/* Background */}
              {generatedLayout.background && (
                <g>
                  <path d={generatedLayout.background.path}
                    fill={generatedLayout.background.color} opacity="0.1"
                    stroke={generatedLayout.background.color} strokeWidth="2" />
                  {generatedLayout.background.innerPath && (
                    <path d={generatedLayout.background.innerPath}
                      fill="none" stroke={generatedLayout.background.color} strokeWidth="1" opacity="0.25" />
                  )}
                  {/* Label */}
                  {(() => {
                    const nums = generatedLayout.background.path.match(/-?\d+\.?\d*/g)?.map(Number) || [];
                    let sx = 0, sy = 0, cnt = 0;
                    for (let i = 0; i < nums.length - 1; i += 2) { sx += nums[i]; sy += nums[i + 1]; cnt++; }
                    const lx = cnt ? sx / cnt : 500;
                    const ly = cnt ? sy / cnt : 400;
                    return <text x={lx} y={ly + 5} textAnchor="middle" fill={generatedLayout.background.color} fontWeight="900" fontSize="16" letterSpacing="3" opacity="0.5">{generatedLayout.background.label}</text>;
                  })()}
                </g>
              )}

              {/* Decorations */}
              {generatedLayout.decorations?.map((d, i) => {
                if (d.type === 'line') return <line key={i} x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2} stroke={d.color} strokeWidth="1" opacity={d.opacity} />;
                if (d.type === 'circle') return <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="none" stroke={d.color} strokeWidth="1" opacity={d.opacity} />;
                return null;
              })}

              {/* Sections */}
              {generatedLayout.sections.map(section => {
                const tierId = sectionTiers[section.id] || section.tierId;
                const tier = tiers.find(t => t.id === tierId);
                const color = tier?.color || '#666';
                const isHovered = hoveredSection === section.id;
                const isSelected = selectedSection === section.id;

                return (
                  <g key={section.id}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredSection(section.id)}
                    onMouseLeave={() => setHoveredSection(null)}
                    onClick={(e) => { e.stopPropagation(); setSelectedSection(section.id); }}
                  >
                    <path d={section.path}
                      fill={color}
                      opacity={isHovered ? 0.55 : 0.3}
                      stroke={isSelected ? '#3b82f6' : (isHovered ? '#fff' : color)}
                      strokeWidth={isSelected ? 2.5 : (isHovered ? 2 : 1)}
                      style={{ transition: 'all 0.15s ease', filter: isHovered ? `drop-shadow(0 0 8px ${color}60)` : 'none' }}
                    />
                    <text x={section.cx} y={section.cy + 1} textAnchor="middle" dominantBaseline="middle"
                      fill="#fff" fontWeight="700" fontSize="10" pointerEvents="none">{section.label}</text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Sidebar */}
          <div className="w-56 shrink-0 space-y-3">
            {selectedSec ? (
              <div className="bg-[#18181b] border border-[#2a2a30] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{selectedSec.label || selectedSec.id}</span>
                  <span className="text-[10px] text-gray-600">{selectedSec.totalSeats || '??'} ghế</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-[#0a0a0a] rounded p-2">
                    <span className="text-gray-600 block">Rows</span>
                    <span className="text-white font-bold">{selectedSec.rows}</span>
                  </div>
                  <div className="bg-[#0a0a0a] rounded p-2">
                    <span className="text-gray-600 block">Seats/Row</span>
                    <span className="text-white font-bold">{selectedSec.seatsPerRow}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1.5">Gán hạng vé</label>
                  <div className="space-y-1">
                    {tiers.filter(t => t.name?.trim()).map(t => {
                      const tierId = sectionTiers[selectedSec.id] || selectedSec.tierId;
                      return (
                        <button key={t.id} onClick={() => assignTier(selectedSec.id, t.id)}
                          className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded text-xs transition-colors ${
                            tierId === t.id ? 'bg-white/10 ring-1 ring-white/20' : 'hover:bg-white/5'
                          }`}
                        >
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: t.color }}></div>
                          <span className="text-gray-300 font-medium truncate">{t.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#18181b] border border-[#2a2a30] rounded-xl p-4 text-center">
                <p className="text-[11px] text-gray-500">Click vào khu vực trên canvas để gán hạng vé</p>
              </div>
            )}

            {/* Stats */}
            <div className="bg-[#18181b] border border-[#2a2a30] rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-white">Thống kê</span>
              <div className="text-[10px] text-gray-500 space-y-1">
                <div className="flex justify-between">
                  <span>Tổng khu vực</span>
                  <span className="text-white font-bold">{generatedLayout.sections.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tổng ghế</span>
                  <span className="text-white font-bold">
                    {generatedLayout.sections.reduce((sum, s) => sum + (s.totalSeats || s.rows * s.seatsPerRow || 0), 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-gray-600 px-1 space-y-1">
              <p>• Chọn <strong className="text-gray-500">template</strong> phía trên</p>
              <p>• <strong className="text-gray-500">Click</strong> khu vực để gán tier</p>
              <p>• Layout sẽ <strong className="text-gray-500">tự động</strong> cập nhật</p>
            </div>
          </div>
        </div>
      )}

      {/* No template selected */}
      {!generatedLayout && (
        <div className="bg-[#111] border border-[#2a2a30] rounded-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 border-2 border-purple-500/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-white mb-1">Chọn kiểu địa điểm</h3>
          <p className="text-xs text-gray-500">Click vào một trong các mẫu phía trên để tự động tạo sơ đồ chỗ ngồi chuyên nghiệp</p>
        </div>
      )}
    </div>
  );
};

export default SeatMapBuilder;
