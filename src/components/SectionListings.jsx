import { useState, useMemo, useRef } from 'react';

// Seeded random to prevent re-renders from changing listings
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * SectionListings — Right panel showing available tickets when a section is clicked.
 * Like Viagogo's listing panel.
 * 
 * Props:
 *   section: selected section object from venue data
 *   tier: matching ticket tier
 *   event: event object
 *   onSelectTicket(listing): when user picks a listing
 *   onClose(): close the panel
 */
const SectionListings = ({ section, tier, event, onSelectTicket, onClose }) => {
  const [sortBy, setSortBy] = useState('price'); // price | seats

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + 'đ';

  // Generate pseudo-listings from section data
  const listings = useMemo(() => {
    if (!section) return [];
    const seed = section.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) * 1000 + (section.availableSeats || 10);
    const rng = seededRandom(seed);
    const result = [];
    const rows = section.rows || 4;
    const cols = section.seatsPerRow || 10;
    let remaining = section.availableSeats || 10;

    // Create realistic groupings
    let listingId = 1;
    for (let r = 0; r < rows && remaining > 0; r++) {
      // Group 1-4 consecutive seats per listing
      let c = 0;
      while (c < cols && remaining > 0) {
        const groupSize = Math.min(1 + Math.floor(rng() * 3), remaining, cols - c);
        const hash = (r * 17 + c * 31 + section.id.charCodeAt(0)) % 11;
        if (hash < 4) { c += groupSize; continue; } // skip some for realism

        // Price variation (+/- 10%)
        const basePrice = section.price || tier?.price || 500000;
        const variation = 1 + ((hash - 5) * 0.03);
        const price = Math.round(basePrice * variation);

        // Rating
        const rating = (7.5 + (hash * 0.2)).toFixed(1);
        const ratingLabel = parseFloat(rating) >= 9 ? 'Amazing' : parseFloat(rating) >= 8 ? 'Great' : 'Good';

        result.push({
          id: `${section.id}-listing-${listingId++}`,
          sectionId: section.id,
          row: String.fromCharCode(65 + r),
          seat: c + 1,
          seats: groupSize,
          price,
          pricePerSeat: price,
          rating: parseFloat(rating),
          ratingLabel,
          features: ['Instant Download', 'Clear view'],
          remaining: remaining <= 3 ? remaining : null,
        });

        remaining -= groupSize;
        c += groupSize + 1;
      }
    }

    // Sort
    if (sortBy === 'price') result.sort((a, b) => a.price - b.price);
    else result.sort((a, b) => b.seats - a.seats);

    return result.slice(0, 15); // cap at 15
  }, [section, tier, sortBy]);

  if (!section) return null;

  const color = tier?.color || section.fill || '#666';

  return (
    <div className="w-full h-full flex flex-col bg-white text-gray-900 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50 shrink-0">
        <div>
          <span className="text-sm font-bold text-gray-800">{listings.length} listing{listings.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1.5 hover:bg-gray-200 rounded transition-colors" title="Filter">
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white">
            <option value="price">Price</option>
            <option value="seats">Quantity</option>
          </select>
        </div>
      </div>

      {/* Listings */}
      <div className="flex-1 overflow-y-auto">
        {listings.map((listing, i) => (
          <div
            key={listing.id}
            onClick={(e) => { e.stopPropagation(); onSelectTicket?.(listing); }}
            className={`px-4 py-3 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors ${i === 0 ? 'bg-green-50 border-l-4 border-l-green-500' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-bold text-gray-900">{section.label || section.id}</span>
                  {listing.seats > 1 && (
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold flex items-center">
                      <svg className="w-3 h-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" /></svg>
                      {listing.seats} tickets together
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 space-y-0.5">
                  <p>Row {listing.row} | Seat {listing.seat}{listing.seats > 1 ? ` - ${listing.seat + listing.seats - 1}` : ''}</p>
                  <div className="flex items-center space-x-2">
                    {listing.features.map(f => (
                      <span key={f} className="flex items-center text-gray-400">
                        <svg className="w-3 h-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                {listing.remaining && (
                  <span className="inline-block mt-1 text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    {listing.remaining === 1 ? 'Only 1 ticket remaining' : `${listing.remaining} tickets remaining`}
                  </span>
                )}
              </div>
              <div className="text-right ml-3 shrink-0">
                <p className="text-sm font-bold text-gray-900">{formatPrice(listing.price)}</p>
                <p className="text-[10px] text-gray-500">incl. fees</p>
                <div className="flex items-center justify-end mt-1 space-x-1">
                  <span className="text-xs font-bold text-white px-1.5 py-0.5 rounded" style={{ backgroundColor: listing.rating >= 9 ? '#22c55e' : listing.rating >= 8 ? '#3b82f6' : '#f59e0b' }}>
                    {listing.rating}
                  </span>
                  <span className="text-[10px] font-bold" style={{ color: listing.rating >= 9 ? '#22c55e' : listing.rating >= 8 ? '#3b82f6' : '#f59e0b' }}>
                    {listing.ratingLabel}
                  </span>
                </div>
                {i === 0 && (
                  <div className="flex items-center mt-1 text-[10px] text-green-600 font-bold">
                    <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    Best price
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {listings.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            <p className="text-sm font-medium">No tickets available in this section</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionListings;
