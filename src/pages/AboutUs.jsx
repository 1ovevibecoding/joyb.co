import React, { useEffect } from 'react';

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stats = [
    { label: 'Người dùng tích cực', value: '5M+' },
    { label: 'Sự kiện thành công', value: '12,000+' },
    { label: 'Đối tác chiến lược', value: '150+' },
    { label: 'CCU đỉnh điểm xử lý', value: '1.2M' },
  ];

  return (
    <div className="w-full bg-white dark:bg-[#0a0a0a] min-h-screen pb-20 flex flex-col items-center overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <div className="w-full relative py-20 mb-16 overflow-hidden flex justify-center">
         <div className="absolute inset-0 z-0">
           <img src="https://images.unsplash.com/photo-1540039155732-d674ce620da6?q=80&w=2560&auto=format&fit=crop" 
                alt="Concert stage background" 
                className="w-full h-full object-cover opacity-20 dark:opacity-40 select-none pointer-events-none" />
           <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a0a0a] via-white/80 dark:via-[#0a0a0a]/80 to-transparent"></div>
         </div>
         
         <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-10">
           <div className="inline-flex items-center space-x-2 bg-black/5 dark:bg-white/10 px-4 py-2 rounded-full mb-8 backdrop-blur-md border border-black/10 dark:border-white/10">
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-widest">Beyond Ticketing</span>
           </div>
           
           <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
              Chúng tôi không chỉ bán vé. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Chúng tôi kiến tạo cảm xúc.</span>
           </h1>
           <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium">
             Được thành lập vào năm 2024 bởi đội ngũ kỹ sư từ Thung lũng Silicon và các chuyên gia tổ chức sự kiện hàng đầu Đông Nam Á, JoyB ra đời với sứ mệnh đập tan những giới hạn công nghệ cũ kỹ, mang đến trải nghiệm phân phối vé mượt mà bậc nhất thế giới.
           </p>
         </div>
      </div>

      {/* 2. STATS SECTION */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-32 z-10 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 bg-white dark:bg-[#111] p-8 md:p-12 rounded-3xl shadow-2xl dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] border border-gray-100 dark:border-gray-800">
           {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                 <div className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2">{stat.value}</div>
                 <div className="text-xs md:text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">{stat.label}</div>
              </div>
           ))}
        </div>
      </div>

      {/* 3. TECHNOLOGY & VISION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center mb-32">
        <div className="order-2 lg:order-1 space-y-8">
          <div>
             <h2 className="text-sm font-bold text-purple-600 uppercase tracking-widest mb-2">Công nghệ cốt lõi</h2>
             <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">Hệ sinh thái công nghệ chịu tải siêu thực</h3>
             <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
               Đứng sau mỗi chiếc vé của JoyB là một cấu trúc hạ tầng đám mây phân tán vô cùng phức tạp. Chúng tôi sử dụng các công nghệ điều phối hàng đợi (Distributed Queue Engine) có khả năng cấp phát hàng triệu truy cập đồng thời, loại bỏ hoàn toàn khái niệm "sập trang" trong những sự kiện bom tấn.
             </p>
          </div>

          <ul className="space-y-6 text-gray-700 dark:text-gray-300">
            <li className="flex items-start bg-gray-50 dark:bg-[#18181A] p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="flex-shrink-0 mt-1">
                 <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                 </div>
              </div>
              <div className="ml-4">
                 <h4 className="font-bold text-gray-900 dark:text-white text-lg">JoyB Anti-Scalping AI™</h4>
                 <p className="text-sm mt-1 leading-relaxed text-gray-500 dark:text-gray-400">Trí tuệ nhân tạo độc quyền tự động phân tích hành vi người dùng, nhận diện và khóa vĩnh viễn các Bot Net gom vé chợ đen chỉ trong 0.02 giây.</p>
              </div>
            </li>
            <li className="flex items-start bg-gray-50 dark:bg-[#18181A] p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="flex-shrink-0 mt-1">
                 <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
                 </div>
              </div>
              <div className="ml-4">
                 <h4 className="font-bold text-gray-900 dark:text-white text-lg">WebGL Matrix Seatmap</h4>
                 <p className="text-sm mt-1 leading-relaxed text-gray-500 dark:text-gray-400">Hiển thị mượt mà sơ đồ sân vận động với sức chứa trên 100,000 chỗ, tốc độ render 60fps trên mọi thiết bị di động mà không cần tải lại trang.</p>
              </div>
            </li>
            <li className="flex items-start bg-gray-50 dark:bg-[#18181A] p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="flex-shrink-0 mt-1">
                 <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                 </div>
              </div>
              <div className="ml-4">
                 <h4 className="font-bold text-gray-900 dark:text-white text-lg">Smart Lock 10 Phút</h4>
                 <p className="text-sm mt-1 leading-relaxed text-gray-500 dark:text-gray-400">Đảm bảo công bằng tuyệt đối: Khi bạn chọn ghế, hạ tầng phân mảnh tự động cô lập ghế đó trong mạng lưới trong 10 phút, bất khả xâm phạm đối với các user khác.</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
           <div className="space-y-4 pt-10">
              <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop" alt="Event production" className="rounded-2xl w-full h-48 object-cover shadow-lg border border-gray-200 dark:border-gray-800" />
              <img src="https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=800&auto=format&fit=crop" alt="Massive crowd" className="rounded-2xl w-full h-64 object-cover shadow-lg border border-gray-200 dark:border-gray-800" />
           </div>
           <div className="space-y-4">
              <img src="https://images.unsplash.com/photo-1470229722913-7c090be5bb7a?q=80&w=800&auto=format&fit=crop" alt="Concert light" className="rounded-2xl w-full h-64 object-cover shadow-lg border border-gray-200 dark:border-gray-800" />
              <img src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop" alt="DJ performance" className="rounded-2xl w-full h-48 object-cover shadow-lg border border-gray-200 dark:border-gray-800" />
           </div>
        </div>
      </div>

      {/* 4. ĐỐI TÁC - MARQUEE */}
      <div className="w-full bg-gray-50 dark:bg-[#111] py-24 border-y border-gray-200 dark:border-gray-900 overflow-hidden mb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
          <h2 className="text-sm font-bold text-purple-600 uppercase tracking-widest mb-2">Được tin dùng bởi</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Các Tập Đoàn Giải Trí Toàn Cầu</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg pt-4">
            JoyB tự hào là đơn vị phân phối vé độc quyền cho những lễ hội âm nhạc và nhà thi đấu quy mô nhất khu vực Châu Á - Thái Bình Dương.
          </p>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: scroll-left 40s linear infinite;
            display: flex;
            width: max-content;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}} />

        <div className="relative w-full flex overflow-hidden group">
          <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 dark:from-[#111] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 dark:from-[#111] to-transparent z-10 pointer-events-none"></div>
          
          <div className="animate-marquee items-center flex" style={{ width: 'max-content' }}>
            {[...Array(2)].map((_, loopIndex) => (
              <div key={loopIndex} className="flex gap-20 px-10 items-center" style={{ minWidth: '100%', flexShrink: 0 }}>
                {[
                  { name: 'VNG Games', logo: 'https://ui-avatars.com/api/?name=VNG&background=f97316&color=fff&size=150' },
                  { name: 'Metub Network', logo: 'https://ui-avatars.com/api/?name=MTB&background=000&color=fff&size=150' },
                  { name: 'Warner Music Asia', logo: 'https://ui-avatars.com/api/?name=WMA&background=cf2027&color=fff&size=150' },
                  { name: 'Symphony VN', logo: 'https://ui-avatars.com/api/?name=SYM&background=0284c7&color=fff&size=150' },
                  { name: 'VinWonders', logo: 'https://ui-avatars.com/api/?name=VIN&background=eab308&color=fff&size=150' },
                  { name: 'Live Nation', logo: 'https://ui-avatars.com/api/?name=LNE&background=14b8a6&color=fff&size=150' },
                  { name: 'SpaceSpeakers', logo: 'https://ui-avatars.com/api/?name=SS&background=1e293b&color=fff&size=150' },
                  { name: 'Tiger Beer', logo: 'https://ui-avatars.com/api/?name=TIG&background=0f172a&color=3b82f6&size=150' },
                  { name: '88rising', logo: 'https://ui-avatars.com/api/?name=88&background=ef4444&color=fff&size=150' }
                ].map((sponsor, idx) => (
                  <div 
                    key={`${loopIndex}-${idx}`} 
                    className="flex flex-col items-center justify-center flex-shrink-0 w-40 transition-transform hover:scale-110 duration-300"
                  >
                    <div className="w-28 h-28 rounded-full border-4 border-gray-200 dark:border-gray-800 p-1 mb-4 shadow-xl bg-white">
                      <img src={sponsor.logo} alt={sponsor.name} className="w-full h-full rounded-full object-cover grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                    </div>
                    <span className="font-extrabold text-sm text-gray-800 dark:text-gray-300 text-center whitespace-nowrap tracking-wide">
                      {sponsor.name}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. VĂN PHÒNG & LIÊN HỆ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-10">
         <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-12">Mạng lưới vận hành toàn cầu</h2>
         <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 border border-gray-200 dark:border-gray-800 rounded-3xl bg-white dark:bg-[#111] shadow-sm hover:shadow-xl transition-shadow text-left">
               <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-6 text-2xl">🇸🇬</div>
               <h4 className="font-bold text-gray-900 dark:text-white text-xl mb-2">Trụ Sở HQ - Singapore</h4>
               <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">Marina Bay Financial Centre Tower 1, 8 Marina Blvd, Singapore 018981</p>
               <a href="mailto:hq@joyb.io" className="text-sm font-bold text-blue-600 hover:text-blue-800">hq@joyb.io &rarr;</a>
            </div>
            
            <div className="p-8 border border-purple-200 dark:border-purple-900/50 rounded-3xl bg-purple-50/50 dark:bg-purple-900/10 shadow-md hover:shadow-xl transition-shadow text-left relative overflow-hidden">
               <div className="absolute top-0 right-0 py-1 px-3 bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-xl">Tech Hub</div>
               <div className="w-12 h-12 bg-white dark:bg-black rounded-xl border border-purple-200 dark:border-purple-800 flex items-center justify-center mb-6 text-2xl">🇻🇳</div>
               <h4 className="font-bold text-gray-900 dark:text-white text-xl mb-2">Engineering - Vietnam</h4>
               <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">Tầng 69, Landmark 81, Vinhomes Central Park, Q.Bình Thạnh, TP.HCM</p>
               <a href="mailto:vn@joyb.io" className="text-sm font-bold text-purple-600 hover:text-purple-800">vn@joyb.io &rarr;</a>
            </div>

            <div className="p-8 border border-gray-200 dark:border-gray-800 rounded-3xl bg-white dark:bg-[#111] shadow-sm hover:shadow-xl transition-shadow text-left">
               <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-6 text-2xl">🇯🇵</div>
               <h4 className="font-bold text-gray-900 dark:text-white text-xl mb-2">R&D Center - Tokyo</h4>
               <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">Roppongi Hills Mori Tower, 6-10-1 Roppongi, Minato City, Tokyo 106-6108</p>
               <a href="mailto:jp@joyb.io" className="text-sm font-bold text-blue-600 hover:text-blue-800">jp@joyb.io &rarr;</a>
            </div>
         </div>
      </div>

    </div>
  );
};

export default AboutUs;
