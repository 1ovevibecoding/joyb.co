import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { VENUE_TEMPLATES, applyTemplate } from '../data/venueTemplates';

const DEFAULT_TIERS = [];
const TIER_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#22d3ee', '#ec4899', '#10b981', '#f97316'];

const STEPS = [
  { id: 1, title: 'Thông tin tổ chức' },
  { id: 2, title: 'Ghép Sơ đồ & Góc nhìn' },
  { id: 3, title: 'Cài đặt' },
  { id: 4, title: 'Thông tin xuất bản' }
];

const OrganizerDashboard = ({ editMode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoadingEvent, setIsLoadingEvent] = useState(editMode);

  // Form state
  const [eventName, setEventName] = useState('');
  const [artist, setArtist] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [venue, setVenue] = useState('');
  const [description, setDescription] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [tiers, setTiers] = useState(DEFAULT_TIERS);
  const [orgName, setOrgName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Seatmap state
  const [selectedTemplate, setSelectedTemplate] = useState('stadium');
  const [builtLayout, setBuiltLayout] = useState(null);

  // Modal states
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [editingTierIdx, setEditingTierIdx] = useState(null);
  const [modalTier, setModalTier] = useState({ name: '', price: '', qty: 10, min: 1, max: 10, startTime: '', endTime: '', description: '', color: TIER_COLORS[0], isFree: false, previewImage: '' });

  // Section Config Modal State
  const [showSectionConfigModal, setShowSectionConfigModal] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState('');
  const [sectionOverrides, setSectionOverrides] = useState({});

  useEffect(() => {
    if (editMode && id) {
      const fetchEvent = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/events/${id}`);
          const data = await res.json();
          if (data) {
            setEventName(data.ten_show || '');
            setArtist(data.ca_si || '');
            if (data.ngay_gio) {
              const d = new Date(data.ngay_gio);
              setStartDate(new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
            }
            setVenue(data.dia_diem || '');
            setDescription(data.about_event || '');
            setBannerUrl(data.anh_banner || '');
            setOrgName(data.organizer_name || '');
            if (data.ticket_tiers) {
              try {
                const parsed = typeof data.ticket_tiers === 'string' ? JSON.parse(data.ticket_tiers) : data.ticket_tiers;
                if (Array.isArray(parsed)) setTiers(parsed);
              } catch (e) {}
            }
            if (data.venueLayout && data.venueLayout.templateKey) {
                setSelectedTemplate(data.venueLayout.templateKey);
                if (data.venueLayout.sections) {
                   const loadedOverrides = {};
                   data.venueLayout.sections.forEach(s => {
                      loadedOverrides[s.id] = {
                         tierId: s.tierId,
                         rows: s.rows,
                         seatsPerRow: s.seatsPerRow,
                         viewUrl: s.viewUrl
                      };
                   });
                   setSectionOverrides(loadedOverrides);
                }
                setBuiltLayout(data.venueLayout);
            }
          }
        } catch (err) {
          console.error('Failed to load event:', err);
        } finally {
          setIsLoadingEvent(false);
        }
      };
      fetchEvent();
    }
  }, [editMode, id]);

  // Sync builtLayout whenever template, tiers, or overrides change
  useEffect(() => {
     if (selectedTemplate) {
        setBuiltLayout(applyTemplate(selectedTemplate, tiers, sectionOverrides));
     }
  }, [selectedTemplate, tiers, sectionOverrides]);

  const openAddTicketModal = () => {
    setModalTier({ name: '', price: '0', qty: 10, min: 1, max: 10, startTime: '', endTime: '', description: '', color: TIER_COLORS[tiers.length % TIER_COLORS.length], isFree: false, previewImage: '' });
    setEditingTierIdx(null);
    setShowTicketModal(true);
  };

  const handleSaveModalTicket = () => {
    if (!modalTier.name.trim()) return;
    const newTier = {
      id: `t${Date.now()}`,
      name: modalTier.name,
      price: modalTier.isFree ? 0 : parseInt(modalTier.price) || 0,
      description: modalTier.description,
      color: modalTier.color,
      previewImage: modalTier.previewImage,
      qty: parseInt(modalTier.qty) || 10,
      min: parseInt(modalTier.min) || 1,
      max: parseInt(modalTier.max) || 10,
      startTime: modalTier.startTime,
      endTime: modalTier.endTime
    };

    if (editingTierIdx !== null) {
      setTiers(prev => {
        const next = [...prev];
        next[editingTierIdx] = { ...next[editingTierIdx], ...newTier };
        return next;
      });
    } else {
      setTiers(prev => [...prev, newTier]);
    }
    setShowTicketModal(false);
  };

  const removeTier = (index) => {
    setTiers(prev => prev.filter((_, i) => i !== index));
  };

  const buildEventObject = () => {
    const validTiers = tiers.filter(t => t.name.trim());
    const finalOrgName = orgName || user?.name || 'Đơn vị tổ chức';
    const acronym = finalOrgName.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase();

    return {
      ten_show: eventName.toUpperCase(),
      ca_si: artist,
      ngay_gio: startDate ? new Date(startDate).toISOString() : new Date(Date.now() + 30 * 86400000).toISOString(),
      dia_diem: venue,
      organizer_name: finalOrgName,
      organizer_avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(acronym)}&background=random&color=fff`,
      about_event: description,
      ticket_tiers: validTiers.map((t, idx) => ({
        id: t.id || `t${idx + 1}`,
        name: t.name.toUpperCase(),
        price: parseInt(t.price) || 0,
        description: t.description,
        color: t.color,
        previewImage: t.previewImage,
        isSoldOut: false
      })),
      venueLayout: builtLayout,
      anh_banner: bannerUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80'
    };
  };

  const handleSubmitForApproval = async () => {
    setIsSaving(true);
    try {
      const newEvent = buildEventObject();
      const method = editMode ? 'PUT' : 'POST';
      const endpoint = editMode ? `http://localhost:5000/api/events/${id}` : 'http://localhost:5000/api/events';
      
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });
      if (!res.ok) {
        setIsSaving(false);
        return;
      }
      setIsSaving(false);
      setShowSuccess(true);
    } catch (err) {
      console.error('Lỗi kết nối:', err);
      setIsSaving(false);
    }
  };

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + ' đ';

  if (isLoadingEvent) {
    return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-2 border-green-500 rounded-full border-t-transparent"></div></div>;
  }

  if (showSuccess) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-black text-white mb-4">{editMode ? 'Cập nhật thành công!' : 'Tạo sự kiện thành công!'}</h2>
        <button onClick={() => navigate('/organizer/my-events')} className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded">Quản lý sự kiện</button>
      </div>
    );
  }

  return (
    <div className="w-full pb-20 font-sans">
      <h1 className="text-xl md:text-2xl font-bold text-white mb-6">Tạo sự kiện</h1>

      <div className="bg-[#1a1a1c] border-b border-[#27272a] mb-6 flex overflow-x-auto scroolbar-hide">
        {STEPS.map((step, idx) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          return (
            <div key={step.id} 
              className={`flex items-center space-x-2 px-6 py-4 border-b-2 cursor-pointer transition-colors whitespace-nowrap
                ${isActive ? 'border-green-500 text-green-500' : isCompleted ? 'border-transparent text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}
              `}
              onClick={() => { if(isCompleted || isActive) setCurrentStep(step.id); }}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${isActive ? 'bg-green-500 text-black' : isCompleted ? 'bg-white text-black' : 'bg-[#27272a] text-gray-400'}`}>
                {isCompleted ? '✓' : step.id}
              </div>
              <span className="text-sm font-semibold">{step.title}</span>
              {idx < STEPS.length - 1 && <svg className="w-4 h-4 ml-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>}
            </div>
          );
        })}
      </div>

      <div className="bg-[#1a1a1c] border border-[rgba(255,255,255,0.05)] rounded p-6 shadow-xl">
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            
            {/* STEP 1: 2-Column Layout */}
            {currentStep === 1 && (
              <div className="flex flex-col lg:flex-row gap-8">
                 {/* LEFT COLUMN: About Event & Timings */}
                 <div className="flex-1 space-y-6">
                    <h3 className="font-bold text-white text-lg border-b border-[#333] pb-2">Mô tả sự kiện</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 sm:col-span-1">
                           <label className="block text-xs font-semibold text-gray-400 mb-1.5"><span className="text-red-500 mr-1">*</span> Tên sự kiện</label>
                           <input type="text" value={eventName} onChange={e => setEventName(e.target.value)} className="w-full bg-[#1e1e20] border border-[#333] rounded px-3 py-2 text-white text-sm outline-none focus:border-green-500" />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                           <label className="block text-xs font-semibold text-gray-400 mb-1.5">Ban tổ chức</label>
                           <input type="text" value={orgName} onChange={e => setOrgName(e.target.value)} className="w-full bg-[#1e1e20] border border-[#333] rounded px-3 py-2 text-white text-sm outline-none focus:border-green-500" />
                        </div>
                        <div className="col-span-2">
                           <label className="block text-xs font-semibold text-gray-400 mb-1.5"><span className="text-red-500 mr-1">*</span> Địa điểm tổ chức</label>
                           <input type="text" value={venue} onChange={e => setVenue(e.target.value)} className="w-full bg-[#1e1e20] border border-[#333] rounded px-3 py-2 text-white text-sm outline-none focus:border-green-500" />
                        </div>
                        
                        {/* Timings */}
                        <div className="col-span-2 sm:col-span-1">
                           <label className="block text-xs font-semibold text-gray-400 mb-1.5">Thời gian bắt đầu</label>
                           <input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-[#1e1e20] border border-[#333] rounded px-3 py-2 text-white text-sm outline-none focus:border-green-500" />
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                           <label className="block text-xs font-semibold text-gray-400 mb-1.5">Thời gian kết thúc</label>
                           <input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-[#1e1e20] border border-[#333] rounded px-3 py-2 text-white text-sm outline-none focus:border-green-500" />
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="flex items-center text-xs font-semibold text-gray-400 mb-1.5">Chi tiết sự kiện (Hỗ trợ chèn phương tiện)</label>
                        <div className="bg-[#242427] border border-[#333] rounded-md overflow-hidden">
                           <div className="px-3 py-2 border-b border-[#333] flex items-center justify-between bg-[#1a1a1c]">
                              <div className="flex items-center space-x-3 text-gray-400">
                                <button className="font-bold hover:text-white">B</button>
                                <button className="italic hover:text-white">I</button>
                                <button className="underline hover:text-white">U</button>
                              </div>
                              <button className="flex items-center text-xs text-[#10b981] font-semibold hover:text-green-400 transition-colors bg-[#10b981]/10 px-2 py-1 rounded">
                                 <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg> 
                                 Chèn Ảnh / Video
                              </button>
                           </div>
                           <textarea 
                              value={description} onChange={e => setDescription(e.target.value)}
                              placeholder="Kể về sự kiện của bạn..."
                              className="w-full bg-[#1e1e20] text-gray-300 text-sm p-4 min-h-[250px] outline-none resize-y" 
                           />
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        <label className="block text-xs font-semibold text-gray-400 mb-1.5">Ảnh nền / Banner chính</label>
                        <input type="text" value={bannerUrl} onChange={e => setBannerUrl(e.target.value)} placeholder="https://..." className="w-full bg-[#1e1e20] border border-[#333] rounded px-3 py-2 text-white text-sm outline-none focus:border-green-500" />
                    </div>
                 </div>

                 {/* RIGHT COLUMN: Ticket Tiers */}
                 <div className="lg:w-80 shrink-0">
                    <h3 className="font-bold text-white text-lg border-b border-[#333] pb-2 mb-6">Cài đặt Hạng Vé</h3>
                    
                    <div className="bg-[#1e1e20] border border-[#333] rounded-lg p-4">
                       <label className="flex items-center text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Danh sách vé ({tiers.length})</label>
                       
                       {tiers.length > 0 ? (
                          <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto pr-2">
                             {tiers.map((t, idx) => (
                                <div key={idx} className="bg-[#1a1a1c] border border-[#333] rounded p-3 flex flex-col pl-4 border-l-4 relative group" style={{borderLeftColor: t.color}}>
                                   <div className="flex justify-between items-start">
                                      <p className="font-bold text-white text-sm">{t.name}</p>
                                      <button onClick={() => removeTier(idx)} className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
                                   </div>
                                   <p className="text-xs text-gray-400 mt-1">{t.isFree ? 'Miễn phí' : formatPrice(t.price)}</p>
                                   <div className="flex justify-between items-center mt-2">
                                     <span className="text-[10px] bg-[#333] text-gray-300 px-2 py-0.5 rounded">Qty: {t.qty}</span>
                                     <span className="text-[10px] text-gray-500">{t.min} - {t.max} /đơn</span>
                                   </div>
                                </div>
                             ))}
                          </div>
                       ) : (
                          <div className="text-center py-8 bg-[#1a1a1c] rounded border border-dashed border-[#333] mb-6">
                             <p className="text-gray-500 text-xs">Chưa có hạng vé nào.</p>
                          </div>
                       )}

                       <button onClick={openAddTicketModal} className="w-full bg-[#27272a] hover:bg-[#333] text-[#10b981] text-sm font-bold py-3 rounded transition-colors flex justify-center items-center">
                           <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                           + Tạo loại vé
                       </button>
                    </div>
                 </div>
              </div>
            )}

            {/* STEP 2: Tạo Sơ đồ & Góc nhìn */}
            {currentStep === 2 && (
               <div className="space-y-6">
                  <div className="flex flex-col lg:flex-row gap-8">
                     {/* Template Selector Left Sidebar */}
                     <div className="lg:w-64 shrink-0 space-y-4">
                        <h3 className="font-bold text-white text-lg border-b border-[#333] pb-2">Khởi tạo Template</h3>
                        <p className="text-xs text-gray-400 mb-4">Mô phỏng Stage layout chuyên nghiệp. Các hạng vé đã tạo sẽ được map tự động.</p>
                        
                        <div className="space-y-2">
                           {Object.keys(VENUE_TEMPLATES).map(tmplKey => (
                              <button 
                                 key={tmplKey}
                                 onClick={() => setSelectedTemplate(tmplKey)}
                                 className={`w-full text-left px-4 py-3 rounded-lg border flex justify-between items-center transition-colors ${selectedTemplate === tmplKey ? 'bg-gradient-to-r from-blue-900/40 to-blue-800/20 border-blue-500 text-white shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]' : 'bg-[#1e1e20] border-[#333] text-gray-400 hover:border-gray-500'}`}
                              >
                                 <span className="font-semibold text-sm capitalize">{VENUE_TEMPLATES[tmplKey].name || tmplKey}</span>
                                 {selectedTemplate === tmplKey && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>}
                              </button>
                           ))}
                        </div>

                        {/* View Perspective Trigger */}
                        <div className="mt-8 pt-6 border-t border-[#333]">
                           <h4 className="text-sm font-bold text-white mb-2">Trải nghiệm tương tác</h4>
                           <p className="text-[11px] text-gray-400 mb-4 block">Cài đặt ảnh chụp góc nhìn (Xem trước góc nhìn) 3D cho từng khu vực.</p>
                           <button 
                              onClick={() => {
                                 if(!builtLayout?.sections) return;
                                 setActiveSectionId(builtLayout.sections[0]?.id || '');
                                 setShowSectionConfigModal(true);
                              }}
                              className="w-full bg-[#1e1e20] hover:bg-[#27272a] text-[#8b5cf6] border border-[#8b5cf6]/30 px-4 py-2.5 rounded text-sm font-bold flex items-center justify-center transition-colors shadow-[0_0_10px_-2px_rgba(139,92,246,0.2)]"
                           >
                              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                              Xem trước góc nhìn
                           </button>
                        </div>
                     </div>

                     {/* SVG Layout Preview */}
                     <div className="flex-1">
                         <div className="bg-[#0a0a0c] border border-[#333] rounded-xl h-[600px] flex items-center justify-center relative overflow-hidden group">
                           {builtLayout ? (
                              <svg viewBox={builtLayout.viewBox} className="w-full h-full max-h-[550px] drop-shadow-2xl">
                                 {/* Background / Stage */}
                                 {builtLayout.background && (
                                    <path 
                                       d={builtLayout.background.path} 
                                       fill={builtLayout.background.color} 
                                       opacity="0.8"
                                       className="drop-shadow-[0_0_15px_currentColor]" 
                                    />
                                 )}
                                 
                                 {/* Sections */}
                                 {builtLayout.sections.map((sec, idx) => {
                                    // find tier color
                                    const t = tiers.find(x => x.id === sec.tierId);
                                    const col = t ? t.color : '#4b5563';
                                    return (
                                       <g key={sec.id || idx} className="cursor-pointer transition-all duration-300 hover:brightness-125 focus:brightness-125" onClick={() => { setActiveSectionId(sec.id); setShowSectionConfigModal(true); }}>
                                          <path d={sec.path} fill={col} stroke="#000" strokeWidth="2" opacity="0.9" />
                                          <text x={sec.cx} y={sec.cy} fill="#fff" fontSize="14" fontWeight="bold" textAnchor="middle" transform={`translate(0, 5)`} className="pointer-events-none drop-shadow-md">{sec.label}</text>
                                       </g>
                                    );
                                 })}
                              </svg>
                           ) : (
                              <p className="text-gray-500 bg-[#1e1e20] px-4 py-2 rounded">Chưa sinh được Sơ đồ</p>
                           )}
                           <div className="absolute top-4 right-4 bg-black/60 px-3 py-1.5 rounded text-[10px] font-bold text-gray-300 backdrop-blur pointer-events-none">
                              Click vào Block để Cài đặt Hình ảnh góc nhìn
                           </div>
                         </div>
                     </div>
                  </div>
               </div>
            )}

            {/* STEP 3: Cài đặt */}
            {currentStep === 3 && (
               <div className="space-y-4">
                  <h3 className="font-bold text-white text-lg mb-2">Cài đặt sự kiện hiển thị</h3>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="bg-[#1e1e20] p-4 rounded border border-[#333]">
                        <p className="text-sm text-gray-300 font-semibold mb-2">Hiển thị số lượng vé tồn</p>
                        <select className="bg-[#1a1a1c] border border-[#333] text-gray-300 rounded px-3 py-2 w-full outline-none"><option>Chỉ hiển thị khi sắp hết</option><option>Luôn hiển thị</option></select>
                     </div>
                     <div className="bg-[#1e1e20] p-4 rounded border border-[#333]">
                        <p className="text-sm text-gray-300 font-semibold mb-2">Cho phép chuyển nhượng vé</p>
                        <select className="bg-[#1a1a1c] border border-[#333] text-gray-300 rounded px-3 py-2 w-full outline-none"><option>Cho phép</option><option>Không cho phép</option></select>
                     </div>
                  </div>
               </div>
            )}

            {/* STEP 4: Thông tin thanh toán / Xuất bản */}
            {currentStep === 4 && (
               <div className="space-y-6">
                  <h3 className="font-bold text-white text-lg mb-2">Xác nhận & Xuất bản sự kiện</h3>
                  <div className="bg-yellow-900/20 border border-yellow-700/50 p-4 rounded-md">
                     <p className="text-sm text-yellow-500 font-semibold mb-1">Lưu ý trước khi xuất bản!</p>
                     <p className="text-sm text-yellow-600/80">Sự kiện này sẽ được gửi lên hệ thống JoyB cho Admin xét duyệt. Nếu được duyệt, trang sự kiện sẽ công khai theo mẫu Tiers và Sơ đồ bạn đã chọn.</p>
                  </div>
                  
                  <div className="border border-[#333] bg-[#1e1e20] rounded p-6 shadow-inner">
                       <h4 className="text-xl text-white font-black mb-1 uppercase tracking-tight">{eventName || "Sự kiện chưa có tên"}</h4>
                       <p className="text-sm text-gray-400 mb-6 font-medium">{venue || "Địa điểm trống"} • {startDate || "Chưa định ngày"}</p>
                       
                       <div className="grid grid-cols-2 gap-4">
                          <div className="bg-[#1a1a1c] rounded p-3 border border-[#333]">
                             <p className="text-xs text-gray-500 font-bold mb-1">HẠNG VÉ</p>
                             <p className="text-white text-lg">{tiers.length} hạng</p>
                          </div>
                          <div className="bg-[#1a1a1c] rounded p-3 border border-[#333]">
                             <p className="text-xs text-gray-500 font-bold mb-1">SƠ ĐỒ (SEATMAP)</p>
                             <p className="text-white text-lg capitalize">{selectedTemplate}</p>
                          </div>
                       </div>
                  </div>

                  <button onClick={handleSubmitForApproval} disabled={isSaving} className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-bold py-3 rounded-md transition-colors shadow-[0_4px_20px_-5px_rgba(16,185,129,0.5)] flex justify-center items-center">
                     {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Lưu & Gửi Xét Duyệt'}
                  </button>
               </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* FOOTER BUTTONS */}
      <div className="fixed top-20 right-6 z-40 flex space-x-3">
         {currentStep > 1 && (
            <button onClick={() => setCurrentStep(prev => prev - 1)} className="bg-[#27272a] text-gray-300 font-semibold text-sm px-6 py-2 rounded shadow hover:bg-[#333] transition-colors border border-[#444]">
               Trở lại
            </button>
         )}
         {currentStep < 4 && (
            <button onClick={() => setCurrentStep(prev => prev + 1)} className="bg-[#10b981] text-white font-semibold text-sm px-8 py-2 rounded shadow-lg hover:bg-[#059669] transition-colors tracking-wide">
               Tiếp tục
            </button>
         )}
      </div>

      {/* --------------------- MODALS --------------------- */}

      {/* 1. MODAL: Tạo loại vé mới */}
      <AnimatePresence>
         {showTicketModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
               <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="bg-[#1a1a1c] p-6 rounded-xl w-full max-w-4xl shadow-2xl relative border border-[#333] text-white"
               >
                  <button onClick={() => setShowTicketModal(false)} className="absolute top-4 right-4 p-2 bg-[#27272a] rounded-full text-gray-400 hover:text-white transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
                  <h2 className="text-xl font-bold mb-6 tracking-tight text-white/90">Thông số Hạng vé</h2>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="col-span-1 md:col-span-8 space-y-5">
                         {/* Row 1 */}
                         <div>
                            <label className="flex items-center text-xs font-semibold text-gray-400 mb-1.5"><span className="text-red-500 mr-1">*</span> Tên hạng vé</label>
                            <input type="text" value={modalTier.name} onChange={e => setModalTier({...modalTier, name: e.target.value})} placeholder="Vd: VIP Diamond" className="w-full bg-[#27272a] text-white border border-[#444] rounded px-3 py-2 text-sm outline-none focus:border-green-500" />
                         </div>

                         {/* Row 2 */}
                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                             <div>
                                <label className="flex items-center text-xs font-semibold text-gray-400 mb-1.5"><span className="text-red-500 mr-1">*</span> Giá vé (VND)</label>
                                <div className="flex flex-col space-y-2">
                                  <input type="number" disabled={modalTier.isFree} value={modalTier.price} onChange={e => setModalTier({...modalTier, price: e.target.value})} className="w-full bg-[#27272a] text-white border border-[#444] rounded px-3 py-2 text-sm outline-none focus:border-green-500 disabled:opacity-50" />
                                  <label className="flex items-center text-xs text-gray-300 cursor-pointer w-fit"><input type="checkbox" checked={modalTier.isFree} onChange={e => setModalTier({...modalTier, isFree: e.target.checked, price: '0'})} className="mr-1.5 accent-green-500"/> Thu vé Miễn phí</label>
                                </div>
                             </div>
                             <div>
                                <label className="flex items-center text-xs font-semibold text-gray-400 mb-1.5"><span className="text-red-500 mr-1">*</span> Tổng vé</label>
                                <input type="number" value={modalTier.qty} onChange={e => setModalTier({...modalTier, qty: e.target.value})} className="w-full bg-[#27272a] text-white border border-[#444] rounded px-3 py-2 text-sm outline-none focus:border-green-500" />
                             </div>
                             <div>
                                <label className="flex items-center text-xs font-semibold text-gray-400 mb-1.5"><span className="text-red-500 mr-1">*</span> Mua tối thiểu</label>
                                <input type="number" value={modalTier.min} onChange={e => setModalTier({...modalTier, min: e.target.value})} className="w-full bg-[#27272a] text-white border border-[#444] rounded px-3 py-2 text-sm outline-none focus:border-green-500" />
                             </div>
                             <div>
                                <label className="flex items-center text-xs font-semibold text-gray-400 mb-1.5"><span className="text-red-500 mr-1">*</span> Mua tối đa</label>
                                <input type="number" value={modalTier.max} onChange={e => setModalTier({...modalTier, max: e.target.value})} className="w-full bg-[#27272a] text-white border border-[#444] rounded px-3 py-2 text-sm outline-none focus:border-green-500" />
                             </div>
                         </div>

                         {/* Row 3 */}
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div>
                                <label className="flex items-center text-xs font-semibold text-gray-400 mb-1.5"><span className="text-red-500 mr-1">*</span> Mở bán (Start)</label>
                                <input type="datetime-local" value={modalTier.startTime} onChange={e => setModalTier({...modalTier, startTime: e.target.value})} className="w-full bg-[#27272a] text-white border border-[#444] rounded px-3 py-2 text-sm outline-none focus:border-green-500" />
                             </div>
                             <div>
                                <label className="flex items-center text-xs font-semibold text-gray-400 mb-1.5"><span className="text-red-500 mr-1">*</span> Đóng bán (End)</label>
                                <input type="datetime-local" value={modalTier.endTime} onChange={e => setModalTier({...modalTier, endTime: e.target.value})} className="w-full bg-[#27272a] text-white border border-[#444] rounded px-3 py-2 text-sm outline-none focus:border-green-500" />
                             </div>
                         </div>

                         {/* Row 4 */}
                         <div>
                            <label className="flex items-center text-xs font-semibold text-gray-400 mb-1.5">Mô tả đặc quyền của hạng vé này</label>
                            <textarea value={modalTier.description} onChange={e => setModalTier({...modalTier, description: e.target.value})} placeholder="Ex: Tặng kèm áo thun, xếp hàng ưu tiên..." rows="3" className="w-full bg-[#27272a] text-white border border-[#444] rounded px-3 py-2 text-sm outline-none focus:border-green-500 resize-y"></textarea>
                         </div>
                      </div>

                      {/* Right column: Formats */}
                      <div className="col-span-1 md:col-span-4 md:pl-6 md:border-l border-[#333] pt-2">
                          <label className="block text-xs font-semibold text-gray-400 mb-2">Ảnh xem trước góc nhìn (View Preview)</label>
                          <div className="space-y-3">
                              <input 
                                  type="text" 
                                  value={modalTier.previewImage} 
                                  onChange={e => setModalTier({...modalTier, previewImage: e.target.value})} 
                                  placeholder="Nhập URL hình ảnh (https://...)" 
                                  className="w-full bg-[#27272a] text-white border border-[#444] rounded px-3 py-2 text-sm outline-none focus:border-green-500" 
                              />
                              <div className="w-full aspect-video border-2 border-dashed border-[#444] rounded-lg bg-[#202024] flex items-center justify-center overflow-hidden">
                                  {modalTier.previewImage ? (
                                      <img src={modalTier.previewImage} alt="Preview" className="w-full h-full object-cover" />
                                  ) : (
                                      <div className="flex flex-col items-center text-gray-500">
                                          <svg className="w-8 h-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                          </svg>
                                          <span className="text-[10px] font-bold uppercase">Chưa có ảnh</span>
                                      </div>
                                  )}
                              </div>
                          </div>
                          
                          <div className="mt-8">
                            <label className="block text-xs font-semibold text-gray-400 mb-3 tracking-wide">Mã màu (Đồng bộ với Sơ đồ)</label>
                            <div className="flex flex-wrap gap-3">
                                {TIER_COLORS.map(c => (
                                    <button key={c} onClick={() => setModalTier({...modalTier, color: c})}
                                      className={`w-7 h-7 rounded-full shadow-inner transition-transform ${modalTier.color === c ? 'ring-2 ring-white ring-offset-4 ring-offset-[#1a1a1c] scale-110' : 'opacity-40 hover:opacity-100 mix-blend-screen'}`}
                                      style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                          </div>
                      </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                     <button onClick={handleSaveModalTicket} className="bg-[#10b981] hover:bg-[#059669] text-white font-bold px-10 py-2.5 rounded transition-colors shadow">Lưu hạng vé</button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      {/* 2. MODAL: Cấu hình Khu vực (Section Configuration) */}
      <AnimatePresence>
         {showSectionConfigModal && builtLayout && activeSectionId && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#0f0f12] rounded-xl w-full max-w-6xl overflow-hidden shadow-2xl border border-[#27272a] text-white flex flex-col h-[90vh]"
               >
                  {/* Modal Header inside the black box */}
                  <div className="p-4 border-b border-[#27272a] flex items-center justify-between shrink-0">
                     <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-[#8b5cf6]/20 flex items-center justify-center text-[#8b5cf6]">
                           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
                        </div>
                        <div>
                           <h2 className="text-lg font-bold tracking-wide">Cấu hình khu vực (Zone Setup)</h2>
                           <p className="text-[11px] text-gray-500">Khu vực đang chọn: <strong className="text-white">{activeSectionId}</strong></p>
                        </div>
                     </div>
                     <div className="flex space-x-2">
                        <button onClick={() => setShowSectionConfigModal(false)} className="p-2 text-gray-500 hover:text-red-400 rounded bg-[#1a1a1c]"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
                     </div>
                  </div>

                  {/* Tabs / Selectors for quickly switching zones */}
                  <div className="bg-[#151518] border-b border-[#27272a] px-4 py-2 flex overflow-x-auto whitespace-nowrap space-x-2 shrink-0">
                     {builtLayout.sections.map(sec => (
                        <button 
                           key={sec.id}
                           onClick={() => setActiveSectionId(sec.id)}
                           className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${activeSectionId === sec.id ? 'bg-[#2563eb] text-white shadow-md ring-2 ring-[#026cdf]' : 'bg-[#1e1e20] text-gray-400 hover:bg-[#27272a] hover:text-gray-200'}`}
                        >
                           {sec.label || sec.id}
                        </button>
                     ))}
                  </div>

                  {/* Modal Body: Split Columns */}
                  <div className="flex-1 overflow-auto flex flex-col md:flex-row">
                      {/* Left: Configuration Form */}
                      {(() => {
                         const currentSec = builtLayout.sections.find(s => s.id === activeSectionId);
                         if (!currentSec) return null;
                         
                         // To update local state changes instantly
                         const handleOverrideChange = (key, value) => {
                             setSectionOverrides(prev => ({
                                 ...prev,
                                 [activeSectionId]: {
                                     ...prev[activeSectionId],
                                     tierId: prev[activeSectionId]?.tierId || currentSec.tierId,
                                     rows: prev[activeSectionId]?.rows || currentSec.rows,
                                     seatsPerRow: prev[activeSectionId]?.seatsPerRow || currentSec.seatsPerRow,
                                     viewUrl: prev[activeSectionId]?.viewUrl || currentSec.viewUrl,
                                     [key]: value
                                 }
                             }));
                         };
                         
                         const activeOverrides = sectionOverrides[activeSectionId] || {};
                         const currentTierId = activeOverrides.tierId || currentSec.tierId;
                         const currentRows = activeOverrides.rows || currentSec.rows;
                         const currentCols = activeOverrides.seatsPerRow || currentSec.seatsPerRow;
                         const currentViewUrl = activeOverrides.viewUrl || currentSec.viewUrl;
                         const activeTierObj = tiers.find(t => t.id === currentTierId);

                         return (
                            <>
                               <div className="w-full md:w-[400px] bg-[#111] p-6 shrink-0 border-r border-[#27272a] space-y-6">
                                  <div>
                                     <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">1. Gán Hạng Vé (Ticket Tier)</label>
                                     <select 
                                        className="w-full bg-[#1e1e20] text-white border border-[#333] rounded-lg px-4 py-3 outline-none focus:border-blue-500 font-semibold"
                                        value={currentTierId}
                                        onChange={(e) => handleOverrideChange('tierId', e.target.value)}
                                     >
                                        <option value="" disabled>-- Chọn Hạng Vé --</option>
                                        {tiers.map(t => (
                                           <option key={t.id} value={t.id}>{t.name} - {t.isFree ? 'Miễn phí' : formatPrice(t.price)}</option>
                                        ))}
                                     </select>
                                     {activeTierObj && (
                                        <div className="mt-3 flex items-center space-x-2">
                                           <div className="w-4 h-4 rounded-full" style={{ backgroundColor: activeTierObj.color }}></div>
                                           <span className="text-sm text-gray-300">Màu hiển thị trên Sơ đồ</span>
                                        </div>
                                     )}
                                  </div>

                                  <div className="pt-4 border-t border-[#27272a]">
                                     <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-wide">2. Thiết lập Lưới Ghế (Seat Grid)</label>
                                     <div className="grid grid-cols-2 gap-4">
                                        <div>
                                           <label className="text-xs text-gray-500 block mb-1">Số Hàng (Rows)</label>
                                           <input 
                                              type="number" min="1" max="100" 
                                              value={currentRows}
                                              onChange={(e) => handleOverrideChange('rows', parseInt(e.target.value)||1)}
                                              className="w-full bg-[#1e1e20] border border-[#333] rounded px-3 py-2 text-white font-bold outline-none focus:border-blue-500 text-center" 
                                           />
                                        </div>
                                        <div>
                                           <label className="text-xs text-gray-500 block mb-1">Ghế / Hàng (Cols)</label>
                                           <input 
                                              type="number" min="1" max="100" 
                                              value={currentCols}
                                              onChange={(e) => handleOverrideChange('seatsPerRow', parseInt(e.target.value)||1)}
                                              className="w-full bg-[#1e1e20] border border-[#333] rounded px-3 py-2 text-white font-bold outline-none focus:border-blue-500 text-center" 
                                           />
                                        </div>
                                     </div>
                                     <div className="mt-4 bg-[#1a1a1c] border border-dashed border-[#444] rounded p-3 text-center">
                                         <p className="text-xs text-gray-500 mb-1">Tổng sức chứa khả dụng</p>
                                         <p className="text-xl font-black text-[#10b981]">{currentRows * currentCols} Ghế</p>
                                     </div>
                                  </div>

                                  <div className="pt-4 border-t border-[#27272a]">
                                     <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">3. Ảnh Góc Nhìn Tương Tác</label>
                                     <input 
                                        type="text" 
                                        placeholder="Nhập URL Hình ảnh (https://...)" 
                                        value={currentViewUrl}
                                        onChange={(e) => handleOverrideChange('viewUrl', e.target.value)}
                                        className="w-full bg-[#1e1e20] border border-[#333] rounded px-3 py-3 text-sm text-white outline-none focus:border-blue-500" 
                                     />
                                     <p className="text-[10px] text-gray-500 mt-2">Ảnh xem trước 3D/Góc nhìn thực tế từ khu vực này xuống sân khấu.</p>
                                  </div>
                               </div>

                               {/* Right: Live Preview Rendering */}
                               <div className="flex-1 bg-black relative flex flex-col items-center justify-center">
                                   {currentViewUrl ? (
                                      <img src={currentViewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                                   ) : (
                                      <div className="absolute inset-0 flex items-center justify-center flex-col z-0 opacity-50">
                                         <div className="w-20 h-20 rounded-full border border-dashed border-gray-600 flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                         </div>
                                         <p className="text-gray-600 text-sm font-semibold tracking-wider">CHƯA CÓ ẢNH</p>
                                      </div>
                                   )}
                                   
                                   {/* Mimic the 3D grid layout on screen based on Row x Col */}
                                   <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-t from-black via-black/40 to-transparent">
                                       <div className="mb-8 border-b-2 border-dashed border-gray-600 w-1/2 flex items-center justify-center pb-2">
                                           <span className="text-xs text-gray-500 font-bold uppercase tracking-widest bg-black/50 px-3 py-1 rounded">Sân Khấu Hướng Này</span>
                                       </div>
                                       {/* Mini dot grid simulation (max 10 rows and 20 cols shown to prevent lag) */}
                                       <div className="flex flex-col gap-1.5 items-center opacity-80" style={{ perspective: '1000px', transform: 'rotateX(40deg)' }}>
                                           {Array.from({ length: Math.min(10, currentRows) }).map((_, rIdx) => (
                                              <div key={rIdx} className="flex gap-1.5 justify-center" style={{ width: `${Math.min(25, currentCols) * 16}px` }}>
                                                 {Array.from({ length: Math.min(25, currentCols) }).map((_, cIdx) => (
                                                    <div key={cIdx} className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: activeTierObj?.color || '#3b82f6' }}></div>
                                                 ))}
                                              </div>
                                           ))}
                                           {currentRows > 10 || currentCols > 25 ? <p className="text-white mt-4 text-xs font-bold">+ {currentRows * currentCols - (Math.min(10, currentRows) * Math.min(25, currentCols))} ghế khác...</p> : null}
                                       </div>

                                       <div className="absolute bottom-8 left-8">
                                          <h3 className="text-4xl font-black text-white">{activeSectionId}</h3>
                                          <p className="text-lg text-gray-300 font-bold tracking-wide mt-1">{activeTierObj?.name || 'Chưa Gán Tier'}</p>
                                       </div>
                                       <div className="absolute bottom-8 right-8 text-right">
                                          <p className="text-3xl font-black text-white">{activeTierObj ? formatPrice(activeTierObj.price) : '0đ'}</p>
                                       </div>
                                   </div>
                               </div>
                            </>
                         )
                      })()}
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

    </div>
  );
};

export default OrganizerDashboard;
