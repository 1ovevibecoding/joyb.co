import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OrganizerRegister = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // step 1: info, step 2: org details

  // Step 1
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  // Step 2 — Organizer details
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('');

  const orgTypes = [
    { value: 'company', label: 'Công ty / Doanh nghiệp', icon: '🏢' },
    { value: 'individual', label: 'Cá nhân / Freelancer', icon: '👤' },
    { value: 'venue', label: 'Địa điểm / Nhà hát', icon: '🏟️' },
    { value: 'agency', label: 'Agency / Đại lý', icon: '🎪' },
  ];

  const handleStep1 = (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (password !== confirm) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu tối thiểu 6 ký tự');
      return;
    }
    setStep(2);
  };

  const handleStep2 = (e) => {
    e.preventDefault();
    setError('');
    if (!orgName.trim()) {
      setError('Vui lòng nhập tên tổ chức');
      return;
    }
    if (!orgType) {
      setError('Vui lòng chọn loại hình tổ chức');
      return;
    }
    const result = register({
      name,
      email,
      phone,
      password,
      role: 'organizer',
      orgName,
      orgType
    });
    if (result.ok) {
      navigate('/organizer/create-event');
    } else {
      setError(result.error);
    }
  };

  const inputClass = "w-full bg-[#0a0a0a] border border-[#2a2a30] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/30 transition-all";

  return (
    <div className="flex-grow flex items-center justify-center min-h-[80vh] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="#/" className="inline-flex items-center space-x-2">
            <img src={`${import.meta.env.BASE_URL}joyb-logo.png`} alt="JoyB" className="w-10 h-10 rounded-lg" />
            <span className="text-3xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">JoyB.VN</span>
          </a>
          <p className="text-gray-500 text-sm mt-2">Đăng ký tài khoản Nhà tổ chức</p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center space-x-2 mb-6">
          <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-[#2a2a30]'}`}></div>
          <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-gradient-to-r from-pink-500 to-rose-500' : 'bg-[#2a2a30]'}`}></div>
        </div>

        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#27272a] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                {step === 1 ? 'Bước 1 — Thông tin cá nhân' : 'Bước 2 — Thông tin tổ chức'}
              </h2>
              <p className="text-[10px] text-gray-500 mt-0.5">Organizer Registration</p>
            </div>
            <span className="text-[10px] font-bold text-pink-400 bg-pink-500/10 px-2 py-1 rounded-full">🎪 ORG</span>
          </div>

          {/* Error */}
          {error && (
            <div className="mx-6 mt-4 px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-medium flex items-center space-x-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Họ và tên</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nguyễn Văn A" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="organizer@company.com" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Số điện thoại</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0901 234 567" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Mật khẩu</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Tối thiểu 6 ký tự" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Xác nhận</label>
                  <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Nhập lại" className={inputClass} />
                </div>
              </div>
              <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold rounded-xl text-sm uppercase tracking-wider transition-all shadow-lg shadow-pink-500/20">
                Tiếp tục →
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleStep2} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Tên tổ chức / Thương hiệu</label>
                <input type="text" value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="VPW Entertainment" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Loại hình</label>
                <div className="grid grid-cols-2 gap-2">
                  {orgTypes.map(t => (
                    <button key={t.value} type="button" onClick={() => setOrgType(t.value)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${orgType === t.value ? 'border-pink-500 bg-pink-500/10' : 'border-[#2a2a30] hover:border-[#3a3a40]'}`}
                    >
                      <div className="text-lg mb-1">{t.icon}</div>
                      <span className="text-[11px] font-bold text-white leading-tight block">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex space-x-3">
                <button type="button" onClick={() => { setStep(1); setError(''); }} className="flex-1 py-3 border border-[#2a2a30] text-gray-400 hover:text-white font-medium rounded-xl text-sm transition-colors">
                  ← Quay lại
                </button>
                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold rounded-xl text-sm uppercase tracking-wider transition-all shadow-lg shadow-pink-500/20">
                  Hoàn tất
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-4 text-center">
          <p className="text-[11px] text-gray-600">
            Đã có tài khoản? <a href="#/login" className="text-purple-400 hover:underline font-medium">Đăng nhập</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrganizerRegister;
