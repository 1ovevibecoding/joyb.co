import { useState, useEffect } from 'react';
import { HashRouter as BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import EventDetail from './pages/EventDetail';
import Checkout from './pages/Checkout';
import OrganizerDashboard from './pages/OrganizerDashboard';
import OrganizerMyEvents from './pages/OrganizerMyEvents';
import MyTickets from './pages/MyTickets';
import Login from './pages/Login';
import OrganizerRegister from './pages/OrganizerRegister';
import OrganizerProfile from './pages/OrganizerProfile';
import InfoPage from './pages/InfoPage';
import UserSettings from './pages/UserSettings';
import Dashboard from './pages/Dashboard';
import AboutUs from './pages/AboutUs';
import LegalPage from './pages/LegalPage';
import ChatWidget from './components/ChatWidget';
import OrganizerLayout from './components/OrganizerLayout';
import PaymentResult from './pages/PaymentResult';
import PendingCheckoutBanner from './components/PendingCheckoutBanner';

// Protected route for organizer-only pages
const OrganizerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  const role = user.role?.toLowerCase();
  if (role !== 'organizer' && role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

// Protected route for admin-only pages
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role?.toLowerCase() !== 'admin') return <Navigate to="/" replace />;
  return children;
};

function AppContent() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      localStorage.setItem('theme', 'light');
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isOrganizer = location.pathname.startsWith('/organizer');
  const isCheckout = location.pathname.startsWith('/checkout') || location.pathname.startsWith('/payment-result');
  const hideHeaderFooter = isDashboard || isOrganizer || isCheckout;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 w-full overflow-x-hidden ${hideHeaderFooter ? 'bg-[#1a1a1c] dark:bg-[#1a1a1c]' : 'bg-transparent'}`}>
      {!hideHeaderFooter && <Header theme={theme} toggleTheme={toggleTheme} />}
      {/* Spacer for fixed header */}
      {!hideHeaderFooter && <div className="h-16"></div>}
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><AboutUs /></PageWrapper>} />
          <Route path="/event/:id" element={<PageWrapper><EventDetail /></PageWrapper>} />
          <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
          <Route path="/payment-result" element={<PageWrapper><PaymentResult /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/my-tickets" element={<PageWrapper><MyTickets /></PageWrapper>} />
          <Route path="/profile" element={<PageWrapper><UserSettings /></PageWrapper>} />
          <Route path="/organizer/register" element={<PageWrapper><OrganizerRegister /></PageWrapper>} />
          <Route path="/organizer/create-event" element={
            <PageWrapper><OrganizerRoute><OrganizerLayout><OrganizerDashboard /></OrganizerLayout></OrganizerRoute></PageWrapper>
          } />
          <Route path="/organizer/edit-event/:id" element={
            <PageWrapper><OrganizerRoute><OrganizerLayout><OrganizerDashboard editMode={true} /></OrganizerLayout></OrganizerRoute></PageWrapper>
          } />
          <Route path="/organizer/my-events" element={
            <PageWrapper><OrganizerRoute><OrganizerLayout><OrganizerMyEvents /></OrganizerLayout></OrganizerRoute></PageWrapper>
          } />
          <Route path="/organizer/:name" element={<PageWrapper><OrganizerProfile /></PageWrapper>} />
          <Route path="/dashboard" element={
            <AdminRoute><Dashboard /></AdminRoute>
          } />
          <Route path="/info/:slug" element={<PageWrapper><InfoPage /></PageWrapper>} />
          <Route path="/legal/:slug" element={<PageWrapper><LegalPage /></PageWrapper>} />
        </Routes>
      </AnimatePresence>

      {!hideHeaderFooter && <Footer />}
      {!hideHeaderFooter && <ChatWidget />}
      <PendingCheckoutBanner />
    </div>
  );
}

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
    >
      {children}
    </motion.div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
