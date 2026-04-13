/**
 * Per-Event Venue Data — Each event gets a completely custom map.
 * 
 * JSON schema per venue:
 *   venueType: 'circuit' | 'stadium' | 'arena'
 *   width/height: canvas dimensions
 *   elements: array of shapes (path, rect, ellipse, text)
 *   sections: array of clickable seat sections
 * 
 * When Spring Boot backend is ready, this comes from a single API endpoint.
 * Frontend renders whatever JSON it receives — change the map by changing JSON only.
 */

// ============================================
// EVT001: VPW WRESTLING — ARENA with center RING
// ============================================
export const VENUE_EVT001 = {
  venueType: 'arena',
  width: 1000,
  height: 750,
  // Stage/Ring background for TicketmasterSeatMap rendering
  background: {
    type: 'ring',
    path: 'M 380,260 L 620,260 L 620,460 L 380,460 Z',
    label: 'RING',
    color: '#ef4444'
  },
  // Decorative / background elements (not clickable)
  elements: [
    // Ring ropes
    { type: 'rect', x: 380, y: 260, width: 240, height: 200, fill: '#1a0505', stroke: '#ef4444', strokeWidth: 4, cornerRadius: 8, glow: true, glowColor: '#ef4444' },
    { type: 'rect', x: 395, y: 275, width: 210, height: 170, fill: 'transparent', stroke: '#ef4444', strokeWidth: 1.5, cornerRadius: 4, opacity: 0.3 },
    // Ring label
    { type: 'text', x: 500, y: 345, text: 'RING', fontSize: 28, fill: '#ef4444', fontStyle: 'bold', align: 'center', opacity: 0.5 },
    { type: 'text', x: 500, y: 375, text: 'VPW SPRING BASH', fontSize: 10, fill: '#666', fontStyle: 'bold', align: 'center', letterSpacing: 3 },
    // Corner posts
    { type: 'circle', x: 392, y: 272, radius: 5, fill: '#ef4444' },
    { type: 'circle', x: 608, y: 272, radius: 5, fill: '#ef4444' },
    { type: 'circle', x: 392, y: 448, radius: 5, fill: '#ef4444' },
    { type: 'circle', x: 608, y: 448, radius: 5, fill: '#ef4444' },
  ],
  // Clickable sections
  sections: [
    // RINGSIDE (t1) — 4 sides
    { id: 'RS-N', x: 380, y: 190, width: 240, height: 55, rotation: 0, fill: '#ef4444', label: 'RS-N', price: 1200000, totalSeats: 24, availableSeats: 4, tierId: 't1', rows: 2, seatsPerRow: 12 },
    { id: 'RS-S', x: 380, y: 475, width: 240, height: 55, rotation: 0, fill: '#ef4444', label: 'RS-S', price: 1200000, totalSeats: 24, availableSeats: 8, tierId: 't1', rows: 2, seatsPerRow: 12 },
    { id: 'RS-W', x: 280, y: 270, width: 85, height: 190, rotation: 0, fill: '#ef4444', label: 'RS-W', price: 1200000, totalSeats: 16, availableSeats: 2, tierId: 't1', rows: 8, seatsPerRow: 2 },
    { id: 'RS-E', x: 635, y: 270, width: 85, height: 190, rotation: 0, fill: '#ef4444', label: 'RS-E', price: 1200000, totalSeats: 16, availableSeats: 5, tierId: 't1', rows: 8, seatsPerRow: 2 },
    // FRONT ROW (t2) — 4 sides  
    { id: 'FR-N', x: 280, y: 115, width: 440, height: 60, rotation: 0, fill: '#f59e0b', label: 'FR-N', price: 800000, totalSeats: 40, availableSeats: 12, tierId: 't2', rows: 3, seatsPerRow: 14 },
    { id: 'FR-S', x: 280, y: 545, width: 440, height: 60, rotation: 0, fill: '#f59e0b', label: 'FR-S', price: 800000, totalSeats: 40, availableSeats: 15, tierId: 't2', rows: 3, seatsPerRow: 14 },
    { id: 'FR-W', x: 170, y: 190, width: 95, height: 340, rotation: 0, fill: '#f59e0b', label: 'FR-W', price: 800000, totalSeats: 30, availableSeats: 10, tierId: 't2', rows: 10, seatsPerRow: 3 },
    { id: 'FR-E', x: 735, y: 190, width: 95, height: 340, rotation: 0, fill: '#f59e0b', label: 'FR-E', price: 800000, totalSeats: 30, availableSeats: 7, tierId: 't2', rows: 10, seatsPerRow: 3 },
    // SECOND ROW (t3) — sides
    { id: 'SR-N', x: 180, y: 40, width: 640, height: 60, rotation: 0, fill: '#3b82f6', label: 'SR-N', price: 600000, totalSeats: 60, availableSeats: 25, tierId: 't3', rows: 3, seatsPerRow: 20 },
    { id: 'SR-S', x: 180, y: 620, width: 640, height: 60, rotation: 0, fill: '#3b82f6', label: 'SR-S', price: 600000, totalSeats: 60, availableSeats: 30, tierId: 't3', rows: 3, seatsPerRow: 20 },
    { id: 'SR-W', x: 60, y: 115, width: 95, height: 490, rotation: 0, fill: '#3b82f6', label: 'SR-W', price: 600000, totalSeats: 45, availableSeats: 20, tierId: 't3', rows: 14, seatsPerRow: 3 },
    { id: 'SR-E', x: 845, y: 115, width: 95, height: 490, rotation: 0, fill: '#3b82f6', label: 'SR-E', price: 600000, totalSeats: 45, availableSeats: 18, tierId: 't3', rows: 14, seatsPerRow: 3 },
    // GENERAL (t4) — corners
    { id: 'GA-NW', x: 60, y: 40, width: 105, height: 60, rotation: 0, fill: '#8b5cf6', label: 'GA-NW', price: 450000, totalSeats: 15, availableSeats: 8, tierId: 't4', rows: 3, seatsPerRow: 5 },
    { id: 'GA-NE', x: 835, y: 40, width: 105, height: 60, rotation: 0, fill: '#8b5cf6', label: 'GA-NE', price: 450000, totalSeats: 15, availableSeats: 6, tierId: 't4', rows: 3, seatsPerRow: 5 },
    { id: 'GA-SW', x: 60, y: 620, width: 105, height: 60, rotation: 0, fill: '#8b5cf6', label: 'GA-SW', price: 450000, totalSeats: 15, availableSeats: 3, tierId: 't4', rows: 3, seatsPerRow: 5 },
    { id: 'GA-SE', x: 835, y: 620, width: 105, height: 60, rotation: 0, fill: '#8b5cf6', label: 'GA-SE', price: 450000, totalSeats: 15, availableSeats: 11, tierId: 't4', rows: 3, seatsPerRow: 5 },
  ]
};

// ============================================
// EVT002: KOSMIK CONCERT — ARENA with T-STAGE
// ============================================
export const VENUE_EVT002 = {
  venueType: 'arena',
  width: 960,
  height: 700,
  // Stage background for TicketmasterSeatMap rendering
  background: {
    type: 'stage',
    path: 'M 280,25 L 680,25 L 680,115 L 530,115 L 530,275 L 430,275 L 430,115 L 280,115 Z',
    label: 'STAGE',
    color: '#fbbf24'
  },
  elements: [
    // Main stage
    { type: 'rect', x: 280, y: 25, width: 400, height: 90, fill: '#1a1500', stroke: '#fbbf24', strokeWidth: 3, cornerRadius: 6, glow: true, glowColor: '#fbbf24' },
    { type: 'text', x: 480, y: 60, text: 'STAGE', fontSize: 22, fill: '#fbbf24', fontStyle: 'bold', align: 'center', opacity: 0.6 },
    { type: 'text', x: 480, y: 85, text: 'KOSMIK LIVE', fontSize: 9, fill: '#666', fontStyle: 'bold', align: 'center', letterSpacing: 3 },
    // Catwalk
    { type: 'rect', x: 455, y: 115, width: 50, height: 160, fill: '#1a1500', stroke: '#fbbf24', strokeWidth: 2, cornerRadius: 3, glow: true, glowColor: '#fbbf24', opacity: 0.7 },
    // Laser lines
    { type: 'line', points: [480, 70, 200, 30], stroke: '#fbbf24', strokeWidth: 0.5, opacity: 0.15 },
    { type: 'line', points: [480, 70, 760, 30], stroke: '#fbbf24', strokeWidth: 0.5, opacity: 0.15 },
    { type: 'line', points: [480, 70, 100, 500], stroke: '#fbbf24', strokeWidth: 0.3, opacity: 0.08 },
    { type: 'line', points: [480, 70, 860, 500], stroke: '#fbbf24', strokeWidth: 0.3, opacity: 0.08 },
  ],
  sections: [
    // VIP ZONE (t1)
    { id: 'VIP-L', x: 160, y: 130, width: 270, height: 140, fill: '#fbbf24', label: 'VIP-L', price: 2500000, totalSeats: 60, availableSeats: 8, tierId: 't1', rows: 5, seatsPerRow: 12 },
    { id: 'VIP-R', x: 530, y: 130, width: 270, height: 140, fill: '#fbbf24', label: 'VIP-R', price: 2500000, totalSeats: 60, availableSeats: 12, tierId: 't1', rows: 5, seatsPerRow: 12 },
    // FANZONE (t2)
    { id: 'FZ-L', x: 60, y: 180, width: 80, height: 250, fill: '#ec4899', label: 'FZ-L', price: 1500000, totalSeats: 40, availableSeats: 15, tierId: 't2', rows: 8, seatsPerRow: 5 },
    { id: 'FZ-C', x: 200, y: 295, width: 560, height: 120, fill: '#ec4899', label: 'FZ-C', price: 1500000, totalSeats: 100, availableSeats: 35, tierId: 't2', rows: 5, seatsPerRow: 20 },
    { id: 'FZ-R', x: 820, y: 180, width: 80, height: 250, fill: '#ec4899', label: 'FZ-R', price: 1500000, totalSeats: 40, availableSeats: 18, tierId: 't2', rows: 8, seatsPerRow: 5 },
    // GA (t3)
    { id: 'GA-L', x: 60, y: 445, width: 300, height: 130, fill: '#3b82f6', label: 'GA-L', price: 800000, totalSeats: 120, availableSeats: 55, tierId: 't3', rows: 6, seatsPerRow: 20 },
    { id: 'GA-C', x: 380, y: 430, width: 200, height: 145, fill: '#3b82f6', label: 'GA-C', price: 800000, totalSeats: 80, availableSeats: 40, tierId: 't3', rows: 6, seatsPerRow: 14 },
    { id: 'GA-R', x: 600, y: 445, width: 300, height: 130, fill: '#3b82f6', label: 'GA-R', price: 800000, totalSeats: 120, availableSeats: 48, tierId: 't3', rows: 6, seatsPerRow: 20 },
    { id: 'GA-BAL', x: 120, y: 590, width: 720, height: 70, fill: '#3b82f6', label: 'GA-BAL', price: 800000, totalSeats: 200, availableSeats: 130, tierId: 't3', rows: 4, seatsPerRow: 50 },
  ]
};

// ============================================
// EVT003: COMEDY SHOW — SMALL THEATER
// ============================================
export const VENUE_EVT003 = {
  venueType: 'arena',
  width: 800,
  height: 550,
  // Stage background for TicketmasterSeatMap rendering
  background: {
    type: 'stage',
    path: 'M 240,20 L 560,20 L 560,90 L 240,90 Z',
    label: 'STAGE',
    color: '#a855f7'
  },
  elements: [
    // Stage
    { type: 'rect', x: 240, y: 20, width: 320, height: 70, fill: '#1a0a20', stroke: '#a855f7', strokeWidth: 3, cornerRadius: 8, glow: true, glowColor: '#a855f7' },
    { type: 'text', x: 400, y: 50, text: 'STAND-UP STAGE', fontSize: 16, fill: '#a855f7', fontStyle: 'bold', align: 'center', opacity: 0.6 },
    // Spotlight
    { type: 'circle', x: 400, y: 55, radius: 60, fill: '#a855f720', stroke: '#a855f7', strokeWidth: 0.5, opacity: 0.15 },
  ],
  sections: [
    { id: 'VVIP', x: 280, y: 110, width: 240, height: 60, fill: '#fbbf24', label: 'VVIP', price: 800000, totalSeats: 16, availableSeats: 2, tierId: 't1', rows: 2, seatsPerRow: 8 },
    { id: 'A-L', x: 120, y: 110, width: 140, height: 100, fill: '#ef4444', label: 'A-L', price: 500000, totalSeats: 20, availableSeats: 7, tierId: 't2', rows: 4, seatsPerRow: 5 },
    { id: 'A-R', x: 540, y: 110, width: 140, height: 100, fill: '#ef4444', label: 'A-R', price: 500000, totalSeats: 20, availableSeats: 9, tierId: 't2', rows: 4, seatsPerRow: 5 },
    { id: 'B-L', x: 80, y: 190, width: 180, height: 110, fill: '#3b82f6', label: 'B-L', price: 350000, totalSeats: 30, availableSeats: 15, tierId: 't3', rows: 5, seatsPerRow: 6 },
    { id: 'B-C', x: 280, y: 190, width: 240, height: 110, fill: '#3b82f6', label: 'B-C', price: 350000, totalSeats: 40, availableSeats: 20, tierId: 't3', rows: 5, seatsPerRow: 8 },
    { id: 'B-R', x: 540, y: 190, width: 180, height: 110, fill: '#3b82f6', label: 'B-R', price: 350000, totalSeats: 30, availableSeats: 12, tierId: 't3', rows: 5, seatsPerRow: 6 },
    { id: 'GA', x: 80, y: 330, width: 640, height: 100, fill: '#8b5cf6', label: 'General', price: 200000, totalSeats: 80, availableSeats: 45, tierId: 't4', rows: 5, seatsPerRow: 16 },
    { id: 'BAL', x: 120, y: 450, width: 560, height: 70, fill: '#6b7280', label: 'Balcony', price: 150000, totalSeats: 60, availableSeats: 38, tierId: 't4', rows: 3, seatsPerRow: 20 },
  ]
};

// ============================================
// EVT004: STADIUM CONCERT — OVAL STADIUM
// ============================================
export const VENUE_EVT004 = {
  venueType: 'stadium',
  width: 1000,
  height: 800,
  // Stage background for TicketmasterSeatMap rendering
  background: {
    type: 'stage',
    path: 'M 340,185 L 660,185 L 660,245 L 340,245 Z',
    label: 'MAIN STAGE',
    color: '#a855f7'
  },
  elements: [
    // Football field
    { type: 'rect', x: 310, y: 260, width: 380, height: 240, fill: '#0a2e0a', stroke: '#22c55e', strokeWidth: 2, cornerRadius: 4, glow: true, glowColor: '#22c55e' },
    // Center line
    { type: 'line', points: [500, 260, 500, 500], stroke: '#fff', strokeWidth: 1, opacity: 0.15 },
    // Center circle
    { type: 'circle', x: 500, y: 380, radius: 35, fill: 'transparent', stroke: '#fff', strokeWidth: 0.8, opacity: 0.12 },
    // Stage at one end
    { type: 'rect', x: 340, y: 185, width: 320, height: 60, fill: '#1a1020', stroke: '#a855f7', strokeWidth: 3, cornerRadius: 6, glow: true, glowColor: '#a855f7' },
    { type: 'text', x: 500, y: 210, text: 'MAIN STAGE', fontSize: 18, fill: '#a855f7', fontStyle: 'bold', align: 'center', opacity: 0.6 },
    // Field label
    { type: 'text', x: 500, y: 385, text: 'PITCH', fontSize: 20, fill: '#22c55e', fontStyle: 'bold', align: 'center', opacity: 0.3 },
  ],
  sections: [
    // CAT 1 — closest to stage
    { id: 'CAT1-L', x: 120, y: 175, width: 200, height: 70, fill: '#ef4444', label: 'CAT 1-L', price: 3500000, totalSeats: 50, availableSeats: 4, tierId: 't1', rows: 4, seatsPerRow: 13 },
    { id: 'CAT1-R', x: 680, y: 175, width: 200, height: 70, fill: '#ef4444', label: 'CAT 1-R', price: 3500000, totalSeats: 50, availableSeats: 6, tierId: 't1', rows: 4, seatsPerRow: 13 },
    // CAT 2 — sides
    { id: 'CAT2-NW', x: 100, y: 260, width: 190, height: 110, fill: '#ec4899', label: 'CAT 2-NW', price: 2600000, totalSeats: 70, availableSeats: 15, tierId: 't2', rows: 5, seatsPerRow: 14 },
    { id: 'CAT2-NE', x: 710, y: 260, width: 190, height: 110, fill: '#ec4899', label: 'CAT 2-NE', price: 2600000, totalSeats: 70, availableSeats: 20, tierId: 't2', rows: 5, seatsPerRow: 14 },
    { id: 'CAT2-SW', x: 100, y: 390, width: 190, height: 110, fill: '#ec4899', label: 'CAT 2-SW', price: 2600000, totalSeats: 70, availableSeats: 22, tierId: 't2', rows: 5, seatsPerRow: 14 },
    { id: 'CAT2-SE', x: 710, y: 390, width: 190, height: 110, fill: '#ec4899', label: 'CAT 2-SE', price: 2600000, totalSeats: 70, availableSeats: 18, tierId: 't2', rows: 5, seatsPerRow: 14 },
    // CAT 3 — behind field
    { id: 'CAT3-S', x: 250, y: 520, width: 500, height: 80, fill: '#3b82f6', label: 'CAT 3-S', price: 2000000, totalSeats: 120, availableSeats: 55, tierId: 't3', rows: 5, seatsPerRow: 24 },
    // CAT 4 — upper bowl
    { id: 'CAT4-NW', x: 50, y: 110, width: 240, height: 55, fill: '#6b7280', label: 'CAT 4-NW', price: 1200000, totalSeats: 80, availableSeats: 45, tierId: 't3', rows: 3, seatsPerRow: 27 },
    { id: 'CAT4-NE', x: 710, y: 110, width: 240, height: 55, fill: '#6b7280', label: 'CAT 4-NE', price: 1200000, totalSeats: 80, availableSeats: 50, tierId: 't3', rows: 3, seatsPerRow: 27 },
    { id: 'CAT4-W', x: 50, y: 260, width: 35, height: 240, fill: '#6b7280', label: 'CAT4-W', price: 1200000, totalSeats: 40, availableSeats: 28, tierId: 't3', rows: 12, seatsPerRow: 3 },
    { id: 'CAT4-E', x: 915, y: 260, width: 35, height: 240, fill: '#6b7280', label: 'CAT4-E', price: 1200000, totalSeats: 40, availableSeats: 30, tierId: 't3', rows: 12, seatsPerRow: 3 },
    { id: 'CAT4-S', x: 120, y: 615, width: 760, height: 65, fill: '#6b7280', label: 'CAT 4-S', price: 1200000, totalSeats: 150, availableSeats: 100, tierId: 't3', rows: 3, seatsPerRow: 50 },
  ]
};

// ============================================
// CIRCUIT: EVT005 — RACING EVENT
// ============================================
export const VENUE_EVT005 = {
  venueType: 'circuit',
  width: 1100,
  height: 650,
  // Start/Finish line background for TicketmasterSeatMap rendering
  background: {
    type: 'stage',
    path: 'M 430,30 L 570,30 L 570,70 L 430,70 Z',
    label: 'START / FINISH',
    color: '#374151'
  },
  elements: [
    // Track outline (path)
    { type: 'path', pathData: 'M 150,200 C 150,100 300,50 500,50 C 700,50 900,80 950,200 C 1000,320 950,450 800,500 C 700,530 600,530 500,500 C 400,470 300,490 200,520 C 100,550 50,450 80,350 C 100,280 130,230 150,200 Z', fill: '#0a0a0a', stroke: '#333', strokeWidth: 50, opacity: 1 },
    { type: 'path', pathData: 'M 150,200 C 150,100 300,50 500,50 C 700,50 900,80 950,200 C 1000,320 950,450 800,500 C 700,530 600,530 500,500 C 400,470 300,490 200,520 C 100,550 50,450 80,350 C 100,280 130,230 150,200 Z', fill: 'transparent', stroke: '#fff', strokeWidth: 2, opacity: 0.15 },
    // Start/Finish line
    { type: 'line', points: [500, 40, 500, 65], stroke: '#fff', strokeWidth: 3, opacity: 0.6 },
    { type: 'text', x: 500, y: 28, text: 'START/FINISH', fontSize: 9, fill: '#fff', fontStyle: 'bold', align: 'center', opacity: 0.4 },
    // Track name
    { type: 'text', x: 500, y: 300, text: 'CIRCUIT', fontSize: 30, fill: '#333', fontStyle: 'bold', align: 'center', opacity: 0.3 },
  ],
  sections: [
    // Grandstands around the track
    { id: 'MAIN', x: 390, y: 75, width: 220, height: 45, fill: '#ef4444', label: 'Main Grandstand', price: 5000000, totalSeats: 60, availableSeats: 3, tierId: 't1', rows: 3, seatsPerRow: 20 },
    { id: 'T1', x: 180, y: 100, width: 120, height: 55, rotation: -20, fill: '#f59e0b', label: 'Turn 1', price: 3000000, totalSeats: 40, availableSeats: 8, tierId: 't2', rows: 4, seatsPerRow: 10 },
    { id: 'T2', x: 730, y: 85, width: 140, height: 50, rotation: 15, fill: '#f59e0b', label: 'Turn 2', price: 3000000, totalSeats: 40, availableSeats: 5, tierId: 't2', rows: 4, seatsPerRow: 10 },
    { id: 'T3', x: 880, y: 230, width: 50, height: 120, fill: '#3b82f6', label: 'T3', price: 2000000, totalSeats: 30, availableSeats: 12, tierId: 't3', rows: 6, seatsPerRow: 5 },
    { id: 'T4', x: 820, y: 420, width: 100, height: 50, rotation: -10, fill: '#3b82f6', label: 'Turn 4', price: 2000000, totalSeats: 30, availableSeats: 15, tierId: 't3', rows: 3, seatsPerRow: 10 },
    { id: 'T5', x: 540, y: 470, width: 140, height: 45, fill: '#3b82f6', label: 'Turn 5', price: 2000000, totalSeats: 35, availableSeats: 10, tierId: 't3', rows: 3, seatsPerRow: 12 },
    { id: 'T6', x: 270, y: 450, width: 120, height: 50, rotation: 10, fill: '#8b5cf6', label: 'Turn 6', price: 1500000, totalSeats: 30, availableSeats: 18, tierId: 't3', rows: 3, seatsPerRow: 10 },
    { id: 'GA-IN', x: 400, y: 220, width: 200, height: 120, fill: '#22c55e', label: 'GA Infield', price: 800000, totalSeats: 200, availableSeats: 120, tierId: 't3', rows: 10, seatsPerRow: 20 },
    { id: 'GA-S', x: 100, y: 550, width: 900, height: 60, fill: '#6b7280', label: 'General Admission', price: 500000, totalSeats: 300, availableSeats: 200, tierId: 't3', rows: 4, seatsPerRow: 75 },
  ]
};

// ============================================
// EVT006: Hòa nhạc thính phòng Bach & Mozart
// ============================================
export const VENUE_EVT006 = {
  venueType: 'theater',
  width: 1000,
  height: 1000,
  background: {
    type: 'stage',
    path: 'M 350,20 L 650,20 L 680,100 L 320,100 Z',
    label: 'ORCHESTRA STAGE',
    color: '#475569'
  },
  elements: [
    { type: 'path', pathData: 'M 350,20 L 650,20 L 680,100 L 320,100 Z', fill: '#1e293b', stroke: '#94a3b8', strokeWidth: 2 },
  ],
  sections: [
    // T1: Grand Tier (Yellow/Gold) - High price, central front area
    { id: 'GT-1', label: 'GRAND TIER C', tierId: 't1', x: 400, y: 700, width: 200, height: 80, fill: '#fbbf24', cx: 500, cy: 740, rows: 5, seatsPerRow: 12, path: 'M 400,700 Q 500,680 600,700 L 620,780 Q 500,800 380,780 Z' },
    { id: 'GT-L', label: 'GRAND TIER L', tierId: 't1', x: 220, y: 720, width: 150, height: 70, fill: '#fbbf24', cx: 295, cy: 755, rows: 4, seatsPerRow: 10, path: 'M 220,720 Q 300,710 380,720 L 360,790 Q 280,780 200,790 Z' },
    { id: 'GT-R', label: 'GRAND TIER R', tierId: 't1', x: 620, y: 720, width: 150, height: 70, fill: '#fbbf24', cx: 695, cy: 755, rows: 4, seatsPerRow: 10, path: 'M 620,720 Q 700,710 780,720 L 800,790 Q 720,780 640,790 Z' },

    // T2: Orchestra A (Red) - Prime area around Grand Tier
    { id: 'OA-1', label: 'ORCHESTRA A-C', tierId: 't2', x: 350, y: 550, width: 300, height: 100, fill: '#ef4444', cx: 500, cy: 600, rows: 8, seatsPerRow: 15, path: 'M 350,550 Q 500,520 650,550 L 680,650 Q 500,680 320,650 Z' },
    { id: 'OA-L', label: 'ORCHESTRA A-L', tierId: 't2', x: 100, y: 580, width: 220, height: 90, fill: '#ef4444', cx: 210, cy: 625, rows: 6, seatsPerRow: 12, path: 'M 100,580 Q 220,560 340,580 L 310,670 Q 190,650 70,670 Z' },
    { id: 'OA-R', label: 'ORCHESTRA A-R', tierId: 't2', x: 660, y: 580, width: 220, height: 90, fill: '#ef4444', cx: 770, cy: 625, rows: 6, seatsPerRow: 12, path: 'M 660,580 Q 780,560 900,580 L 930,670 Q 810,650 690,670 Z' },

    // T3: Orchestra B (Blue) - Wings and back
    { id: 'OB-1', label: 'ORCHESTRA B-C', tierId: 't3', x: 300, y: 400, width: 400, height: 100, fill: '#3b82f6', cx: 500, cy: 450, rows: 10, seatsPerRow: 20, path: 'M 300,400 Q 500,360 700,400 L 730,500 Q 500,540 270,500 Z' },
    { id: 'OB-L', label: 'ORCHESTRA B-L', tierId: 't3', x: 50, y: 420, width: 220, height: 100, fill: '#3b82f6', cx: 160, cy: 470, rows: 8, seatsPerRow: 14, path: 'M 50,420 Q 160,400 280,420 L 250,520 Q 130,500 20,520 Z' },
    { id: 'OB-R', label: 'ORCHESTRA B-R', tierId: 't3', x: 720, y: 420, width: 220, height: 100, fill: '#3b82f6', cx: 840, cy: 470, rows: 8, seatsPerRow: 14, path: 'M 720,420 Q 840,400 950,420 L 980,520 Q 870,500 750,520 Z' },

    // T4: Dress Circle (Green) - Higher level
    { id: 'DC-1', label: 'DRESS CIRCLE', tierId: 't4', x: 250, y: 250, width: 500, height: 100, fill: '#22c55e', cx: 500, cy: 300, rows: 12, seatsPerRow: 25, path: 'M 250,250 Q 500,200 750,250 L 780,350 Q 500,300 220,350 Z' },

    // T5: Upper Circle (Purple) - Highest level
    { id: 'UC-1', label: 'UPPER CIRCLE', tierId: 't5', x: 200, y: 120, width: 600, height: 80, fill: '#a855f7', cx: 500, cy: 160, rows: 10, seatsPerRow: 30, path: 'M 200,120 Q 500,80 800,120 L 830,200 Q 500,160 170,200 Z' },
  ],
};

// ============================================
// MAP: eventId → venue data
// ============================================
export const VENUE_MAP = {
  'EVT001': VENUE_EVT001,
  'EVT002': VENUE_EVT002,
  'EVT003': VENUE_EVT003,
  'EVT004': VENUE_EVT004,
  'EVT005': VENUE_EVT005,
  '26d3fa51-f735-4116-8f1b-f26985c69d00': VENUE_EVT006,
};

/**
 * Get venue data for a specific event.
 * Returns null if no custom venue exists — allows template system to take over.
 */
export function getVenueData(eventId) {
  return VENUE_MAP[eventId] || null;
}

export default VENUE_MAP;
