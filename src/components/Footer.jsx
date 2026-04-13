import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#121212] border-t border-gray-800 transition-colors duration-200 mt-auto text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2 pr-8">
            <h3 className="text-base font-bold mb-4">Goloco Company Limited</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><strong className="text-white">Messenger:</strong> joybvn</li>
              <li><strong className="text-white">Email:</strong> contact@joyb.vn</li>
              <li><strong className="text-white">Business Registration Certificate No:</strong> 0123456789</li>
              <li className="leading-relaxed"><strong className="text-white">First issued on:</strong> March 10, 2026 by Ho Chi Minh City Department of Planning and Investment</li>
              <li className="leading-relaxed"><strong className="text-white">Address:</strong> Tầng 12, Tòa nhà Bitexco, Số 2 Hải Triều, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold tracking-wider mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/legal/terms-of-service" className="text-sm text-gray-400 hover:text-white transition-colors">Quy chế hoạt động</Link></li>
              <li><Link to="/legal/privacy-policy" className="text-sm text-gray-400 hover:text-white transition-colors">Chính sách bảo mật</Link></li>
              <li><Link to="/legal/dispute-resolution" className="text-sm text-gray-400 hover:text-white transition-colors">Giải quyết tranh chấp</Link></li>
              <li><Link to="/legal/payment-privacy" className="text-sm text-gray-400 hover:text-white transition-colors">Bảo mật thanh toán</Link></li>
              <li className="pt-2">
                <img src="https://images.dmca.com/Badges/dmca_protected_sml_120n.png?ID=b97de5f5-7b58-45e3-9824-2c67b93cd5c6" alt="DMCA Protected" className="mt-2 h-10 w-auto opacity-90 rounded brightness-110 filter" />
              </li>
            </ul>
          </div>

          {/* Organizer */}
          <div>
            <h3 className="text-sm font-bold tracking-wider mb-4">Organizer</h3>
            <ul className="space-y-3">
              <li><Link to="/info/ticketing-for-organizers" className="text-sm text-gray-400 hover:text-white transition-colors">Ticketing for Organizers</Link></li>
              <li><Link to="/info/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/info/compare" className="text-sm text-gray-400 hover:text-white transition-colors">Compare To Others</Link></li>
              <li><Link to="/info/feature-updates" className="text-sm text-gray-400 hover:text-white transition-colors">Feature Updates</Link></li>
            </ul>
          </div>

          {/* Social + Support */}
          <div>
            <h3 className="text-sm font-bold tracking-wider mb-4">Social</h3>
            <ul className="space-y-3 mb-8">
              <li><a href="https://threads.net/@joybvn" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">Threads</a></li>
              <li><a href="https://facebook.com/joybvn" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">Facebook</a></li>
              <li><a href="https://instagram.com/joybvn" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">Instagram</a></li>
              <li><a href="https://blog.joyb.vn" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</a></li>
            </ul>

            <h3 className="text-sm font-bold tracking-wider mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/info/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/info/documentation" className="text-sm text-gray-400 hover:text-white transition-colors">Documentation</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-16 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
             <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tighter">
                J.
              </span>
            <p className="text-sm text-gray-400">
              &copy; 2026 JoyB, Inc. Hello from Vietnam
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
             <Link to="/legal/return-policy" className="text-sm text-gray-400 hover:text-white transition-colors">Chính sách đổi trả</Link>
             <Link to="/legal/shipping-policy" className="text-sm text-gray-400 hover:text-white transition-colors">Vận chuyển & giao nhận</Link>
             <Link to="/legal/payment-methods" className="text-sm text-gray-400 hover:text-white transition-colors">Phương thức thanh toán</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

