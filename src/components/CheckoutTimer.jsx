import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';

/**
 * CheckoutTimer — 10-minute countdown popup like Viagogo.
 * Shows a lock icon with countdown before navigating to checkout.
 * 
 * Props:
 *   isOpen: boolean
 *   listing: selected listing object
 *   section: section object
 *   event: event object  
 *   onStart(): navigate to checkout
 *   onClose(): dismiss
 */
const CheckoutTimer = ({ isOpen, listing, section, event, onStart, onClose }) => {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    if (!isOpen) { setTimeLeft(600); return; }
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, onClose]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p) + 'đ';

  if (!isOpen || !listing) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
        {/* Timer header */}
        <div className="bg-gray-50 border-b border-gray-200 p-6 text-center">
          {/* Lock icon */}
          <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h2 className="text-lg font-bold text-gray-900 mb-1">
            {t.checkoutTimePrefix} <span className="text-blue-600">{formatTime(timeLeft)}</span> {t.checkoutTimeSuffix}
          </h2>
          <p className="text-sm text-gray-500">
            {t.checkoutPriceLocked}
          </p>
        </div>

        {/* Order summary */}
        <div className="p-6">
          {/* Event info */}
          {event && (
            <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-100">
              <img src={event.anh_banner} alt="" className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{event.ten_show}</p>
                <p className="text-xs text-gray-500">{section?.label || section?.id}</p>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">{t.summary}</span>
            <span className="text-sm text-gray-600">{listing.seats || 1} × {formatPrice(listing.pricePerSeat || listing.price)}</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-gray-900">{t.total}</span>
            <span className="text-lg font-bold text-blue-600">{formatPrice((listing.pricePerSeat || listing.price) * (listing.seats || 1))}</span>
          </div>

          {/* Start button */}
          <button
            onClick={onStart}
            className="w-full py-3.5 bg-[#3d7b3f] hover:bg-[#346e36] text-white font-bold rounded-lg text-sm transition-colors"
          >
            {t.start}
          </button>

          <p className="text-[10px] text-gray-400 text-center mt-3">
            {t.termsAgreed}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutTimer;
