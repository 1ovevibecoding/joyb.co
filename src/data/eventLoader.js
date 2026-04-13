/**
 * Event data loader.
 * Fetches dynamic event data directly from the Prisma SQL Backend API.
 */
const API_BASE = 'http://localhost:5000/api';

/**
 * Get all events
 */
export async function getEnrichedEvents() {
  try {
    const res = await fetch(`${API_BASE}/events`);
    if (!res.ok) return [];
    const data = await res.json();
    // Return data directly from backend
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
}

/**
 * Get a single event by ID with seat map detail
 */
export async function getEnrichedEvent(id) {
  try {
    const res = await fetch(`${API_BASE}/events/${id}`);
    if (!res.ok) return null;
    const event = await res.json();
    
    // ticket_tiers may be JSON string from DB
    if (typeof event.ticket_tiers === 'string') {
      try { event.ticket_tiers = JSON.parse(event.ticket_tiers); } catch (e) {}
    }


    
    return event;
  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 * Custom event bypass
 */
export function enrichCustomEvent(event) {
  return event;
}

export default getEnrichedEvents;
