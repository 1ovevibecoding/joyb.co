import React, { useState, useEffect } from 'react';

const VenueLayoutBuilder = ({ tiers = [], initialLayout = null, onSave }) => {
  const [sections, setSections] = useState([]);
  const [centerLabel, setCenterLabel] = useState('MAIN STAGE');

  useEffect(() => {
    if (initialLayout && initialLayout.sections) {
      setSections(initialLayout.sections);
      if (initialLayout.centerLabel) setCenterLabel(initialLayout.centerLabel);
    } else {
      // Default basic layout if tiers exist
      if (tiers.length > 0) {
        setSections([
          {
            id: 'SEC-1',
            label: 'Khu vực 1',
            tierId: tiers[0]?.id || 't1',
            floor: 1,
            rows: [
              { label: 'A', seats: 10 },
              { label: 'B', seats: 10 },
              { label: 'C', seats: 12 }
            ]
          }
        ]);
      }
    }
  }, [initialLayout, tiers]);

  // Sync to parent automatically
  useEffect(() => {
    const layout = {
      type: 'end-stage',
      centerLabel,
      centerElement: { x: 400, y: 50, width: 400, height: 80 },
      sections
    };
    onSave && onSave(layout);
  }, [sections, centerLabel]);

  const handleAddSection = () => {
    const newSectionId = `SEC-${sections.length + 1}`;
    setSections([
      ...sections,
      {
        id: newSectionId,
        label: `Khu vực ${sections.length + 1}`,
        tierId: tiers[0]?.id || '',
        floor: 1,
        rows: [
          { label: 'A', seats: 10 },
          { label: 'B', seats: 10 }
        ]
      }
    ]);
  };

  const handleRemoveSection = (idx) => {
    if (sections.length <= 1) return;
    const newSections = [...sections];
    newSections.splice(idx, 1);
    setSections(newSections);
  };

  const handeSectionChange = (idx, field, val) => {
    const newSections = [...sections];
    newSections[idx][field] = val;
    setSections(newSections);
  };

  const handleRowChange = (secIdx, rowIdx, field, val) => {
    const newSections = [...sections];
    if (field === 'seats') val = parseInt(val) || 0;
    newSections[secIdx].rows[rowIdx][field] = val;
    setSections(newSections);
  };

  const handleAddRow = (secIdx) => {
    const newSections = [...sections];
    const prevLabel = newSections[secIdx].rows.length > 0 ? newSections[secIdx].rows[newSections[secIdx].rows.length - 1].label : 'A';
    const nextLabel = String.fromCharCode(prevLabel.charCodeAt(0) + 1);
    newSections[secIdx].rows.push({ label: nextLabel, seats: 10 });
    setSections(newSections);
  };

  const handleRemoveRow = (secIdx, rowIdx) => {
    const newSections = [...sections];
    newSections[secIdx].rows.splice(rowIdx, 1);
    setSections(newSections);
  };

  const calculateTotalSeats = () => {
    return sections.reduce((acc, sec) => acc + sec.rows.reduce((rAcc, r) => rAcc + (r.seats || 0), 0), 0);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">Sơ đồ ghế JoyB Native</h3>
          <p className="text-sm text-gray-500">Tổng cộng: {calculateTotalSeats()} ghế trong {sections.length} khu vực</p>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded transition-colors text-sm"
          onClick={handleAddSection}
        >
          + Thêm Khu vực
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((sec, secIdx) => (
          <div key={secIdx} className="bg-[#111] border border-[#2a2a30] rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold text-white text-sm">Phân khu {secIdx + 1}</h4>
              <button onClick={() => handleRemoveSection(secIdx)} className="text-gray-500 hover:text-red-500 text-xs">Xóa</button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">Tên khu hiển thị</label>
                <input 
                  type="text" 
                  value={sec.label} 
                  onChange={e => handeSectionChange(secIdx, 'label', e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a30] rounded-lg px-2 py-1 text-white text-xs focus:border-purple-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">Hạng vé áp dụng</label>
                <select 
                  value={sec.tierId}
                  onChange={e => handeSectionChange(secIdx, 'tierId', e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a30] rounded-lg px-2 py-1.5 text-white text-xs focus:border-purple-500 transition-colors cursor-pointer"
                >
                  <option value="">Chọn hạng</option>
                  {tiers.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({new Intl.NumberFormat('vi-VN').format(t.price)}đ)</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-gray-400">Các hàng ghế ({sec.rows.length})</label>
                <button onClick={() => handleAddRow(secIdx)} className="text-[10px] text-blue-400 hover:text-blue-300">+ Thêm hàng</button>
              </div>
              
              <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                {sec.rows.map((row, rowIdx) => (
                  <div key={rowIdx} className="flex gap-2 items-center">
                    <input 
                      type="text" 
                      value={row.label} 
                      onChange={e => handleRowChange(secIdx, rowIdx, 'label', e.target.value)}
                      placeholder="Label"
                      className="w-16 bg-[#1a1a1f] border border-[#2a2a30] rounded px-2 py-1 flex-shrink-0 text-white text-xs text-center"
                    />
                    <input 
                      type="number" 
                      value={row.seats} 
                      onChange={e => handleRowChange(secIdx, rowIdx, 'seats', e.target.value)}
                      min="1" max="100"
                      className="w-full bg-[#1a1a1f] border border-[#2a2a30] rounded px-2 py-1 text-white text-xs text-center"
                    />
                    <button onClick={() => handleRemoveRow(secIdx, rowIdx)} className="text-gray-600 hover:text-red-400 px-1">✕</button>
                  </div>
                ))}
            </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VenueLayoutBuilder;
