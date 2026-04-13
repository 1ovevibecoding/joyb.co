import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const VenuePreview = ({ event, selectedSectionId }) => {
  const layout = event?.venueLayout;
  const tiers = event?.ticket_tiers || [];
  const [activeSection, setActiveSection] = useState(selectedSectionId || null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const previewRef = useRef(null);

  useEffect(() => {
    if (selectedSectionId) setActiveSection(selectedSectionId);
  }, [selectedSectionId]);

  if (!layout?.sections) return null;

  const sections = layout.sections;
  const getTier = (tierId) => tiers.find(t => t.id === tierId);
  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + 'đ';

  // Normalise to counts, supporting both old int format and new rows-array format
  const getRowCount = (sec) => {
    if (Array.isArray(sec.rows)) return sec.rows.length;
    if (typeof sec.rows === 'number') return sec.rows;
    return 8;
  };
  const getMaxSeats = (sec) => {
    if (Array.isArray(sec.rows)) return Math.max(...sec.rows.map(r => r.seats || 0), 1);
    if (sec.seatsPerRow) return sec.seatsPerRow;
    return 10;
  };

  const getPerspectiveStyle = (sec, secIdx, totalSecs) => {
    const rotateY = ((secIdx / Math.max(totalSecs - 1, 1)) - 0.5) * 14;
    const floor   = sec.floor ?? 1;
    const rotateX = floor === 1 ? 3 : floor === 2 ? 0 : -3;
    const scale   = floor === 1 ? 1.08 : floor === 2 ? 1.0 : 0.92;
    return { transform: `perspective(1200px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${scale})` };
  };

  const getViewDescription = (sec, secIdx, totalSecs) => {
    const floor   = sec.floor ?? 1;
    const side    = secIdx < totalSecs * 0.33 ? 'Bên trái' : secIdx > totalSecs * 0.67 ? 'Bên phải' : 'Chính giữa';
    const dist    = floor === 1 ? 'Rất gần sân khấu' : floor === 2 ? 'Tầm nhìn trung bình' : 'Bao quát toàn cảnh';
    return { side, distance: dist };
  };

  const getSectionGradient = (sec) => {
    const color = getTier(sec.tierId)?.color || '#6366f1';
    return `linear-gradient(135deg, ${color}22 0%, ${color}44 30%, #000 70%, #0a0a0a 100%)`;
  };

  const activeSectionData = sections.find(s => s.id === activeSection);
  const activeSectionIdx  = sections.findIndex(s => s.id === activeSection);
  const activeTier = activeSectionData ? getTier(activeSectionData.tierId) : null;
  const viewInfo   = activeSectionData ? getViewDescription(activeSectionData, activeSectionIdx, sections.length) : null;

  return (
    <div className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg">
            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Xem trước góc nhìn</h3>
            <p className="text-[10px] text-gray-500">Chọn khu vực để xem góc nhìn từ chỗ ngồi</p>
          </div>
        </div>
        <button onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
          title="Phóng to">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>

      {/* Section Pills */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex flex-wrap gap-2 overflow-x-auto">
        {sections.map((sec, si) => {
          const tier = getTier(sec.tierId);
          const isActive = activeSection === sec.id;
          return (
            <button key={sec.id} onClick={() => setActiveSection(sec.id)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all whitespace-nowrap ${
                isActive ? 'text-white shadow-lg scale-105' : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
              }`}
              style={isActive ? { backgroundColor: tier?.color || '#6366f1', boxShadow: `0 4px 15px ${tier?.color || '#6366f1'}40` } : {}}>
              {sec.label || sec.id}
            </button>
          );
        })}
      </div>

      {/* Preview Area */}
      <div ref={previewRef} className={`relative overflow-hidden bg-black ${isFullscreen ? 'fixed inset-0 z-50' : 'aspect-[16/9]'}`}>
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${event.anh_banner})`, filter: 'blur(30px) brightness(0.3)', transform: 'scale(1.3)' }} />

        <AnimatePresence mode="wait">
          {activeSectionData ? (
            <motion.div key={activeSection}
              initial={{ opacity: 0, filter: 'blur(20px)', scale: 1.05 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, filter: 'blur(20px)', scale: 0.95 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex flex-col">
              <div className="flex-1 relative overflow-hidden"
                style={activeSectionData.viewImage ? {} : getPerspectiveStyle(activeSectionData, activeSectionIdx, sections.length)}>
                
                {(activeTier?.previewImage || activeSectionData?.viewImage || event?.anh_banner) ? (
                  <img src={activeTier?.previewImage || activeSectionData?.viewImage || event?.anh_banner} alt={activeSectionData.label || 'Seat view'} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <div className="absolute inset-0" style={{ background: getSectionGradient(activeSectionData) }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <div className="w-48 h-24 sm:w-64 sm:h-32 rounded-xl border-2 flex items-center justify-center"
                          style={{ borderColor: `${activeTier?.color || '#fff'}80`, boxShadow: `0 0 60px ${activeTier?.color || '#fff'}30` }}>
                          <div className="text-center">
                            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{layout.centerLabel || 'STAGE'}</p>
                            <p className="text-white font-black text-base mt-1">{layout.centerSubLabel || event.ten_show}</p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end space-x-0.5">
                      {Array.from({ length: Math.min(getMaxSeats(activeSectionData), 20) }).map((_, i) => (
                        <div key={i} className="rounded-t-sm"
                          style={{ width: '8px', height: `${12 + Math.sin(i * 0.5) * 4}px`, backgroundColor: `${activeTier?.color || '#6366f1'}60` }} />
                      ))}
                    </motion.div>
                  </>
                )}
              </div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 pt-16">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: activeTier?.color }} />
                      <span className="text-white/60 text-[10px] font-bold uppercase tracking-wider">{activeTier?.name}</span>
                    </div>
                    <h4 className="text-white font-extrabold text-lg">{activeSectionData.label || activeSectionData.id}</h4>
                    <p className="text-white/60 text-xs mt-1">{viewInfo?.side} · {viewInfo?.distance} · {getRowCount(activeSectionData)} hàng × {getMaxSeats(activeSectionData)} ghế</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-white font-extrabold text-xl">{formatPrice(activeTier?.price || 0)}</p>
                    <p className="text-white/40 text-[10px]">mỗi vé</p>
                  </div>
                </div>
              </motion.div>
              <button onClick={() => { const i = sections.findIndex(s => s.id === activeSection); setActiveSection(sections[i > 0 ? i - 1 : sections.length - 1].id); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white/70 hover:text-white backdrop-blur-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={() => { const i = sections.findIndex(s => s.id === activeSection); setActiveSection(sections[i < sections.length - 1 ? i + 1 : 0].id); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white/70 hover:text-white backdrop-blur-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </motion.div>
          ) : (
            <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <p className="text-white/40 text-sm font-medium">Chọn khu vực để xem góc nhìn</p>
                <p className="text-white/20 text-xs mt-1">Click vào pill phía trên hoặc chọn trên sơ đồ</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isFullscreen && (
          <button onClick={() => setIsFullscreen(false)} className="absolute top-4 right-4 z-50 p-2 bg-black/60 rounded-full text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default VenuePreview;
