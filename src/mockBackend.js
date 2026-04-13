import { mockEvents, mockUsers } from './mockData.js';

const originalFetch = window.fetch;

console.log('[MockBackend] Interceptor initialized.');

window.fetch = async (...args) => {
  const url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url ? args[0].url : '');
  
  if (url.includes('/api/events')) {
    // Handling /api/events/:id/availability
    if (url.includes('/availability')) {
        return new Response(JSON.stringify({
            soldSeats: ["1-1", "1-2"],
            lockedSeats: {}
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // Handling /api/events/:id/approval etc. Just return success
    if (url.match(/\/events\/\d+\/(approve|reject|hide)/)) {
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // Handling /api/events/:id
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
    
    // Handling /api/events (All events)
    return new Response(JSON.stringify(mockEvents), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // Auth Context Mocks
  if (url.includes('/api/login') || url.includes('/api/register')) {
     return new Response(JSON.stringify({ 
         token: "fake-jwt-token-for-demo", 
         user: url.includes('login') ? mockUsers[0] : mockUsers[1] 
     }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // Seat Locking
  if (url.includes('/api/seat-locks')) {
      return new Response(JSON.stringify({ success: true, message: "Mock seat lock" }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // Orders & Dashboard Stats
  if (url.includes('/api/orders') || url.includes('/api/orders/user/')) {
      return new Response(JSON.stringify([{
           id: "order-1", total_amount: 1000000, status: "completed", created_at: new Date().toISOString()
      }]), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
  if (url.includes('/api/admin/stats/overview')) {
      return new Response(JSON.stringify({
          totalRevenue: 25000000, totalTickets: 120, totalUsers: 35, activeEvents: 3
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // Fallback to original fetch for everything else (e.g. assets, third party)
  return originalFetch(...args);
};
