import { mockEvents, mockUsers } from './mockData.js';

const originalFetch = window.fetch;

console.log('[MockBackend] Interceptor initialized.');

window.fetch = async (...args) => {
  const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url ? args[0].url : '');
  const options = args[1] || {};
  
  // Only intercept API calls to localhost backend
  if (!url.includes('/api/')) {
    return originalFetch(...args);
  }

  // --- Events ---
  if (url.includes('/api/events')) {
    // /api/events/:id/availability
    if (url.includes('/availability')) {
      return new Response(JSON.stringify({
        soldSeats: [],
        lockedSeats: {}
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // /api/events/:id/approve|reject|hide|approval
    if (url.match(/\/events\/\d+\/(approve|reject|hide|approval)/)) {
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // /api/events/:id (single event)
    const match = url.match(/\/api\/events\/(\d+)$/);
    if (match) {
      const id = parseInt(match[1]);
      const event = mockEvents.find(e => e.id === id);
      if (event) {
        return new Response(JSON.stringify(event), { status: 200, headers: { 'Content-Type': 'application/json' } });
      } else {
        return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: { 'Content-Type': 'application/json' } });
      }
    }
    
    // /api/events (all events list)
    return new Response(JSON.stringify(mockEvents), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // --- Auth: Login ---
  if (url.includes('/api/login')) {
    try {
      const body = JSON.parse(options.body || '{}');
      // Check against localStorage users first (seeded by AuthContext)
      const users = JSON.parse(localStorage.getItem('vibee_users') || '[]');
      const found = users.find(u => u.email === body.email && u.password === body.password);
      if (found) {
        const { password, ...safeUser } = found;
        return new Response(JSON.stringify({ 
          token: "mock-jwt-" + Date.now(), 
          user: safeUser 
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      // Fallback: return error
      return new Response(JSON.stringify({ 
        error: "Email hoặc mật khẩu không đúng" 
      }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    } catch {
      return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
  }

  // --- Auth: Register ---
  if (url.includes('/api/register')) {
    try {
      const body = JSON.parse(options.body || '{}');
      const users = JSON.parse(localStorage.getItem('vibee_users') || '[]');
      
      // Check if email already exists
      if (users.find(u => u.email === body.email)) {
        return new Response(JSON.stringify({ error: "Email đã được sử dụng" }), { status: 409, headers: { 'Content-Type': 'application/json' } });
      }

      const newUser = {
        id: 'USER_' + Date.now(),
        name: body.name || 'New User',
        email: body.email,
        phone: body.phone || '',
        password: body.password,
        role: (body.role || 'user').toLowerCase(),
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      localStorage.setItem('vibee_users', JSON.stringify(users));

      const { password, ...safeUser } = newUser;
      return new Response(JSON.stringify({ 
        token: "mock-jwt-" + Date.now(), 
        user: safeUser 
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch {
      return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
  }

  // --- Seat Locking ---
  if (url.includes('/api/seat-locks')) {
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // --- Orders ---
  if (url.includes('/api/orders')) {
    return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // --- Admin Stats ---
  if (url.includes('/api/admin/stats/overview')) {
    return new Response(JSON.stringify({
      totalRevenue: 25000000, totalTickets: 120, totalUsers: 35, activeEvents: mockEvents.length
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
  if (url.includes('/api/admin/')) {
    // Generic admin endpoints - return empty arrays/objects
    return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // --- Payment ---
  if (url.includes('/api/payment/')) {
    return new Response(JSON.stringify({ success: true, paymentUrl: '#' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // --- Chat (Groq AI) ---
  if (url.includes('/api/chat')) {
    return new Response(JSON.stringify({ 
      reply: "Xin chào! Tôi là JoyB Assistant. Hiện tại tôi đang ở chế độ demo nên không thể trả lời chi tiết. Hãy truy cập trang chủ để xem các sự kiện nhé!" 
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // Fallback to original fetch for everything else
  return originalFetch(...args);
};
