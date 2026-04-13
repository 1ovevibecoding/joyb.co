import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/';
  const { login, register } = useAuth();
  const [tab, setTab] = useState('login');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register fields (user only — no role picker)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);

  const isValidEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  const isValidPassword = (str) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(str);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (!isValidEmail(loginEmail)) {
      setError('Địa chỉ email không hợp lệ');
      return;
    }
    const result = await login(loginEmail, loginPassword);
    if (result.ok) {
      setSuccessMsg('Đăng nhập thành công! Đang chuyển hướng...');
      setTimeout(() => navigate(redirectTo), 1500);
    } else {
      setError(result.error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword.trim()) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (!isValidEmail(regEmail)) {
      setError('Địa chỉ email không hợp lệ');
      return;
    }
    if (!isValidPassword(regPassword)) {
      setError('Mật khẩu ít nhất 8 ký tự, gồm chữ hoa, thường và số');
      return;
    }
    if (regPassword !== regConfirm) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    if (!agreedTerms) {
      setError('Vui lòng đồng ý với Điều khoản dịch vụ');
      return;
    }
    const result = await register({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      role: 'user'
    });
    if (result.ok) {
      setSuccessMsg('Đăng ký thành công! Đang tự động đăng nhập...');
      setTimeout(() => navigate(redirectTo), 2000);
    } else {
      setError(result.error);
    }
  };

  const inputClass = "w-full bg-[#0a0a0a] border border-[#2a2a30] rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all";

  return (
    <div className="flex-grow flex items-center justify-center min-h-[80vh] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="#/" className="inline-flex items-center space-x-2">
            <img src={`${import.meta.env.BASE_URL}joyb-logo.png`} alt="JoyB" className="w-10 h-10 rounded-lg" />
            <span className="text-3xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">JoyB.VN</span>
          </a>
          <p className="text-gray-500 text-sm mt-2">Nền tảng mua vé sự kiện trực tuyến</p>
        </div>

        {/* Card */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[#27272a]">
            <button
              onClick={() => { setTab('login'); setError(''); }}
              className={`flex-1 py-3.5 text-sm font-bold uppercase tracking-wider transition-all relative ${tab === 'login' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Đăng nhập
              {tab === 'login' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>}
            </button>
            <button
              onClick={() => { setTab('register'); setError(''); }}
              className={`flex-1 py-3.5 text-sm font-bold uppercase tracking-wider transition-all relative ${tab === 'register' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Đăng ký
              {tab === 'register' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>}
            </button>
          </div>

          {/* Error & Success Messages */}
          {error && (
            <div className="mx-6 mt-4 px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-medium flex items-center space-x-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="mx-6 mt-4 px-4 py-2.5 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs font-medium flex items-center space-x-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span>{successMsg}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Email</label>
                <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="your@email.com" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Mật khẩu</label>
                <div className="relative">
                  <input type={showLoginPassword ? "text" : "password"} value={loginPassword} onChange={e => setLoginPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
                  <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                    {showLoginPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl text-sm uppercase tracking-wider transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40">
                Đăng nhập
              </button>
              <p className="text-center text-[11px] text-gray-600">
                Chưa có tài khoản? <button type="button" onClick={() => setTab('register')} className="text-purple-400 hover:underline font-medium">Đăng ký ngay</button>
              </p>
            </form>
          )}

          {/* REGISTER FORM (User only) */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Họ và tên</label>
                <input type="text" value={regName} onChange={e => setRegName(e.target.value)} placeholder="Nguyễn Văn A" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Email</label>
                <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="your@email.com" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Số điện thoại</label>
                <input type="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)} placeholder="0901 234 567" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Mật khẩu</label>
                  <div className="relative">
                    <input type={showRegPassword ? "text" : "password"} value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="Từ 8 ký tự" className={inputClass} />
                    <button type="button" onClick={() => setShowRegPassword(!showRegPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                      {showRegPassword ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">Xác nhận</label>
                  <input type={showRegPassword ? "text" : "password"} value={regConfirm} onChange={e => setRegConfirm(e.target.value)} placeholder="Nhập lại" className={inputClass} />
                </div>
              </div>

              {/* Terms & Conditions Checkbox */}
              <div>
                <label className="flex items-start space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-[#2a2a30] bg-[#111] text-purple-500 focus:ring-purple-500/30 cursor-pointer"
                  />
                  <span className="text-[11px] text-gray-400 group-hover:text-gray-300 transition-colors">
                    Tôi đồng ý với <a href="#" className="text-purple-400 hover:underline">Điều khoản dịch vụ</a> và <a href="#" className="text-purple-400 hover:underline">Chính sách bảo mật</a>
                  </span>
                </label>
              </div>

              <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl text-sm uppercase tracking-wider transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40">
                Tạo tài khoản
              </button>
              <p className="text-center text-[11px] text-gray-600">
                Đã có tài khoản? <button type="button" onClick={() => setTab('login')} className="text-purple-400 hover:underline font-medium">Đăng nhập</button>
              </p>
            </form>
          )}
        </div>

        {/* Organizer CTA */}
        <div className="mt-6 bg-[#18181b] border border-[#27272a] rounded-2xl p-5 text-center">
          <p className="text-gray-400 text-xs mb-2">Bạn là nhà tổ chức sự kiện?</p>
          <a href="#/organizer/register" className="inline-flex items-center space-x-2 text-pink-400 hover:text-pink-300 font-bold text-sm transition-colors">
            <span>Đăng ký tài khoản Organizer</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </div>

        <p className="text-center text-[10px] text-gray-600 mt-4">
          Bằng việc tiếp tục, bạn đồng ý với <a href="#" className="text-gray-500 hover:underline">Điều khoản dịch vụ</a> và <a href="#" className="text-gray-500 hover:underline">Chính sách bảo mật</a> của JoyB.VN
        </p>
      </div>
    </div>
  );
};

export default Login;
