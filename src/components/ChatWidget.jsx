import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Offline FAQ Bot ─────────────────────────────────────────
const FAQ_PATTERNS = [
  {
    keywords: ['mua vé', 'đặt vé', 'mua ve', 'dat ve', 'book', 'ticket', 'cách mua', 'buy'],
    reply: 'Để mua vé trên JoyB, bạn thực hiện các bước sau:\n\n1. Chọn sự kiện bạn muốn tham dự\n2. Nhấn "Mua vé" hoặc "Buy Tickets"\n3. Chọn khu vực và ghế ngồi trên sơ đồ\n4. Xác nhận đơn hàng và điền thông tin\n5. Chọn hình thức thanh toán\n6. Nhận vé điện tử qua email\n\nNếu cần hỗ trợ thêm, bạn cứ hỏi nhé.'
  },
  {
    keywords: ['hoàn vé', 'hoan ve', 'trả vé', 'tra ve', 'refund', 'cancel'],
    reply: 'Chính sách hoàn vé của JoyB:\n\n- Hoàn vé trước 72 giờ: hoàn 100% giá vé\n- Hoàn vé trước 24 giờ: hoàn 70% giá vé\n- Dưới 24 giờ: không hỗ trợ hoàn vé\n\nĐể yêu cầu hoàn vé, vào mục "Vé của tôi" > chọn vé cần hoàn > "Yêu cầu hoàn vé". Hệ thống sẽ xử lý trong 3-5 ngày làm việc.'
  },
  {
    keywords: ['thanh toán', 'thanh toan', 'payment', 'momo', 'vnpay', 'bank', 'ngân hàng', 'chuyển khoản'],
    reply: 'JoyB hỗ trợ các hình thức thanh toán:\n\n- Ví MoMo\n- VNPay (QR code)\n- Chuyển khoản ngân hàng\n- Thẻ Visa / Mastercard\n\nTất cả giao dịch đều được bảo mật theo tiêu chuẩn PCI DSS. Sau khi thanh toán thành công, vé sẽ được gửi đến email của bạn trong vòng 1-2 phút.'
  },
  {
    keywords: ['chọn ghế', 'chon ghe', 'seat', 'sơ đồ', 'so do', 'seat map', 'seatmap', 'chỗ ngồi', 'cho ngoi'],
    reply: 'Cách chọn ghế trên JoyB:\n\n1. Vào trang sự kiện, nhấn "Mua vé"\n2. Sơ đồ chỗ ngồi sẽ hiển thị toàn bộ venue\n3. Chọn khu vực (VIP, GA, Standing...)\n4. Click vào ghế cụ thể muốn chọn\n5. Ghế đã chọn sẽ được đánh dấu và khóa tạm 10 phút\n\nMàu sắc các khu vực tương ứng với mức giá khác nhau. Ghế màu xám là ghế đã bán.'
  },
  {
    keywords: ['giá', 'gia', 'price', 'bao nhiêu', 'bao nhieu', 'chi phí', 'phí'],
    reply: 'Giá vé trên JoyB phụ thuộc vào từng sự kiện và hạng ghế bạn chọn. Thông thường:\n\n- Standing / GA: từ 300.000đ - 800.000đ\n- Seated: từ 800.000đ - 2.000.000đ\n- VIP / VVIP: từ 2.000.000đ - 5.000.000đ\n\nBạn có thể xem giá chi tiết trên trang từng sự kiện. JoyB cam kết giá chính hãng từ ban tổ chức.'
  },
  {
    keywords: ['liên hệ', 'lien he', 'contact', 'support', 'hỗ trợ', 'ho tro', 'hotline', 'email'],
    reply: 'Bạn có thể liên hệ JoyB qua:\n\n- Email: support@joyb.vn\n- Hotline: 1900 1234 (8:00 - 22:00)\n- Facebook: fb.com/joyb.vn\n- Trực tiếp qua chatbox này\n\nĐội ngũ hỗ trợ sẽ phản hồi trong vòng 30 phút trong giờ làm việc.'
  },
  {
    keywords: ['joyb', 'là gì', 'la gi', 'giới thiệu', 'gioi thieu', 'about', 'trang web'],
    reply: 'JoyB.VN là nền tảng đặt vé sự kiện trực tuyến hàng đầu tại Việt Nam. Chúng tôi kết nối khán giả với các sự kiện âm nhạc, giải trí, thể thao và nghệ thuật trên toàn quốc.\n\nTính năng nổi bật:\n- Chọn ghế trực tiếp trên sơ đồ venue\n- Thanh toán nhanh, an toàn\n- Vé điện tử tiện lợi\n- Hỗ trợ khách hàng 24/7'
  },
  {
    keywords: ['vé điện tử', 've dien tu', 'e-ticket', 'eticket', 'nhận vé', 'nhan ve'],
    reply: 'Sau khi thanh toán thành công, vé điện tử sẽ được gửi qua:\n\n1. Email đăng ký tài khoản\n2. Mục "Vé của tôi" trên website\n\nKhi đến sự kiện, bạn chỉ cần xuất trình mã QR trên vé điện tử tại cổng vào. Không cần in vé giấy.'
  },
  {
    keywords: ['đăng ký', 'dang ky', 'tạo tài khoản', 'tao tai khoan', 'register', 'sign up'],
    reply: 'Để đăng ký tài khoản JoyB:\n\n1. Nhấn "Đăng nhập" trên góc phải\n2. Chọn "Đăng ký tài khoản mới"\n3. Điền họ tên, email và mật khẩu\n4. Xác nhận email\n\nSau khi đăng ký, bạn có thể mua vé, theo dõi sự kiện và quản lý lịch sử đặt vé.'
  },
  {
    keywords: ['tổ chức', 'to chuc', 'organizer', 'đăng sự kiện', 'dang su kien', 'host'],
    reply: 'Nếu bạn muốn tổ chức sự kiện trên JoyB:\n\n1. Đăng ký tài khoản Organizer\n2. Vào mục "Tạo sự kiện mới"\n3. Điền thông tin sự kiện, thiết lập giá vé\n4. Thiết kế sơ đồ chỗ ngồi\n5. Gửi duyệt và chờ phê duyệt từ admin\n\nSau khi được duyệt, sự kiện sẽ xuất hiện trên trang chủ JoyB.'
  },
];

const DEFAULT_REPLY = 'Cảm ơn bạn đã liên hệ. Hiện tại mình chưa tìm được câu trả lời phù hợp cho câu hỏi này.\n\nBạn có thể thử hỏi về:\n- Cách mua vé\n- Phương thức thanh toán\n- Chính sách hoàn vé\n- Cách chọn ghế\n- Thông tin về JoyB\n\nHoặc liên hệ hotline 1900 1234 để được hỗ trợ trực tiếp.';

function getOfflineReply(message) {
  const lower = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const originalLower = message.toLowerCase();

  // Greeting
  if (/^(hi|hello|xin chào|chào|hey|alo|yo)\b/i.test(originalLower)) {
    return 'Chào bạn! Mình là trợ lý ảo của JoyB. Bạn cần hỗ trợ gì hôm nay?\n\nBạn có thể hỏi mình về cách mua vé, thanh toán, chọn ghế, hoàn vé, hoặc thông tin chung về JoyB.';
  }

  // Thanks
  if (/^(cảm ơn|cam on|thanks|thank you|ok|được rồi)\b/i.test(originalLower)) {
    return 'Không có gì! Nếu bạn cần hỗ trợ thêm, cứ nhắn cho mình nhé.';
  }

  // Pattern match
  for (const faq of FAQ_PATTERNS) {
    if (faq.keywords.some(kw => originalLower.includes(kw) || lower.includes(kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '')))) {
      return faq.reply;
    }
  }

  return DEFAULT_REPLY;
}

// ─── Icons ───────────────────────────────────────────────────
const ChatIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const MinimizeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 14 10 14 10 20" />
    <polyline points="20 10 14 10 14 4" />
    <line x1="14" y1="10" x2="21" y2="3" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

// ─── Typing Dots Animation ──────────────────────────────────
const TypingIndicator = () => (
  <div style={styles.botBubble}>
    <div style={styles.typingDots}>
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          style={styles.dot}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  </div>
);

// ─── Message Bubble ─────────────────────────────────────────
const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      style={{
        ...styles.messageRow,
        justifyContent: isUser ? 'flex-end' : 'flex-start'
      }}
    >
      {!isUser && <div style={styles.avatar}>JB</div>}
      <div style={isUser ? styles.userBubble : styles.botBubble}>
        <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{message.content}</span>
      </div>
    </motion.div>
  );
};

// ─── Main ChatWidget ────────────────────────────────────────
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(localStorage.getItem('joyb_chat_session') || null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Add welcome message when first opened
  const handleOpen = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: 'Xin chào! Mình là trợ lý ảo của JoyB.VN.\n\nBạn có thể hỏi mình về:\n- Cách mua vé, hoàn vé, đổi vé\n- Cách chọn ghế trên seat map\n- Phương thức thanh toán\n- Thông tin chung về JoyB.VN\n\nHãy nhắn tin cho mình nhé!'
      }]);
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Step 1: Try to call the JoyB AI Server (Groq/Gemini)
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId })
      });

      if (!res.ok) throw new Error('AI Server unreachable');

      const data = await res.json();
      
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        
        // Save session ID for context persistence
        if (data.sessionId && data.sessionId !== sessionId) {
          setSessionId(data.sessionId);
          localStorage.setItem('joyb_chat_session', data.sessionId);
        }
      } else {
        throw new Error('Invalid AI response');
      }
    } catch (err) {
      console.warn('AI Server Error (Falling back to Offline FAQ):', err);
      
      // Step 2: Graceful Fallback to Offline FAQ Bot
      await new Promise(r => setTimeout(r, 800)); // Natural delay
      const reply = getOfflineReply(text);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* ─── Chat Window ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            style={styles.chatWindow}
          >
            {/* Header */}
            <div style={styles.header}>
              <div style={styles.headerLeft}>
                <div style={styles.headerAvatar}>JB</div>
                <div>
                  <div style={styles.headerTitle}>JoyB Support</div>
                  <div style={styles.headerSubtitle}>Nhắn tin cho chúng mình</div>
                </div>
              </div>
              <div style={styles.headerActions}>
                <button onClick={() => setIsOpen(false)} style={styles.headerBtn} title="Thu nhỏ">
                  <MinimizeIcon />
                </button>
                <button onClick={() => setIsOpen(false)} style={styles.headerBtn} title="Đóng">
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div style={styles.messagesContainer}>
              {messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
              ))}
              {isLoading && (
                <div style={{ ...styles.messageRow, justifyContent: 'flex-start' }}>
                  <div style={styles.avatar}>JB</div>
                  <TypingIndicator />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={styles.inputContainer}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập tin nhắn..."
                style={styles.input}
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                style={{
                  ...styles.sendBtn,
                  opacity: (!input.trim() || isLoading) ? 0.5 : 1
                }}
              >
                <SendIcon />
              </button>
            </div>

            {/* Footer */}
            <div style={styles.poweredBy}>
              Powered by JoyB.VN AI (Groq & Gemini)
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Floating Button ─── */}
      <motion.button
        onClick={isOpen ? () => setIsOpen(false) : handleOpen}
        style={styles.fab}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 300 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <CloseIcon />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <ChatIcon />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification badge */}
        {!isOpen && messages.length === 0 && (
          <motion.div
            style={styles.badge}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: 'spring' }}
          >
            1
          </motion.div>
        )}
      </motion.button>
    </>
  );
}

// ─── Styles ─────────────────────────────────────────────────
const styles = {
  fab: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4), 0 0 40px rgba(139, 92, 246, 0.15)',
    zIndex: 10000,
  },
  badge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    background: '#ef4444',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #1a1a2e',
  },
  chatWindow: {
    position: 'fixed',
    bottom: '96px',
    right: '24px',
    width: '400px',
    maxWidth: 'calc(100vw - 32px)',
    height: '560px',
    maxHeight: 'calc(100vh - 120px)',
    borderRadius: '16px',
    background: '#1a1a2e',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 10000,
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 16px 12px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff',
    flexShrink: 0,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 700,
  },
  headerTitle: {
    fontWeight: 700,
    fontSize: '15px',
    letterSpacing: '-0.01em',
  },
  headerSubtitle: {
    fontSize: '12px',
    opacity: 0.85,
    marginTop: '1px',
  },
  headerActions: {
    display: 'flex',
    gap: '4px',
  },
  headerBtn: {
    background: 'rgba(255,255,255,0.15)',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    padding: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(255,255,255,0.1) transparent',
  },
  messageRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
  },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'rgba(99,102,241,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: 700,
    color: '#a5b4fc',
    flexShrink: 0,
  },
  userBubble: {
    maxWidth: '75%',
    padding: '10px 14px',
    borderRadius: '16px 16px 4px 16px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  botBubble: {
    maxWidth: '75%',
    padding: '10px 14px',
    borderRadius: '16px 16px 16px 4px',
    background: 'rgba(255,255,255,0.07)',
    color: '#e2e8f0',
    fontSize: '14px',
    lineHeight: '1.5',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  typingDots: {
    display: 'flex',
    gap: '4px',
    padding: '4px 0',
  },
  dot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#a5b4fc',
    display: 'inline-block',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: '#e2e8f0',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  },
  sendBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'opacity 0.2s',
  },
  poweredBy: {
    textAlign: 'center',
    padding: '6px',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.3)',
    flexShrink: 0,
  },
};
