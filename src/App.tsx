import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import Layout from '@/components/Layout';

import HomePage from '@/pages/HomePage';
import ProductsPage from '@/pages/ProductsPage';
import ServicesPage from '@/pages/ServicesPage';
import ExplorePage from '@/pages/ExplorePage';
import ProductPage from '@/pages/ProductPage';
import ProfilePage from '@/pages/ProfilePage';
import SellPage from '@/pages/SellPage';
import DashboardPage from '@/pages/DashboardPage';
import VerificationPage from '@/pages/VerificationPage';
import MessagesPage from '@/pages/MessagesPage';
import CommunityPage from '@/pages/CommunityPage';
import FavouritesPage from '@/pages/FavouritesPage';
import NotificationsPage from '@/pages/NotificationsPage';
import SearchPage from '@/pages/SearchPage';
import AdminPage from '@/pages/AdminPage';
import AboutPage from '@/pages/AboutPage';
import HowItWorksPage from '@/pages/HowItWorksPage';
import SafetyPage from '@/pages/SafetyPage';
import ProhibitedPage from '@/pages/ProhibitedPage';
import SignInPage from '@/pages/SignInPage';
import JoinPage from '@/pages/JoinPage';
import WantedPage from '@/pages/WantedPage';
import TermsPage from '@/pages/TermsPage';
import PrivacyPage from '@/pages/PrivacyPage';
import CommunityGuidelinesPage from '@/pages/CommunityGuidelinesPage';
import ContactPage from '@/pages/ContactPage';
import ReportProblemPage from '@/pages/ReportProblemPage';
import { ToastProvider } from '@/components/ui/Toast';
import StartupDirectoryPage from '@/pages/StartupDirectoryPage';
import StartupProfilePage from '@/pages/StartupProfilePage';
import ServiceDetailPage from '@/pages/ServiceDetailPage';
import OrdersPage from '@/pages/OrdersPage';
import OrderDetailPage from '@/pages/OrderDetailPage';
import SettingsPage from '@/pages/SettingsPage';
import LookingForPage from '@/pages/LookingForPage';
import { Navigate } from 'react-router-dom';

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
            <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
            <Route path="/service/:id" element={<Layout><ServiceDetailPage /></Layout>} />
            <Route path="/services/:id" element={<Layout><ServiceDetailPage /></Layout>} />
            <Route path="/startups" element={<Layout><StartupDirectoryPage /></Layout>} />
            <Route path="/startups/looking-for" element={<Layout><LookingForPage /></Layout>} />
            <Route path="/looking-for" element={<Layout><LookingForPage /></Layout>} />
            <Route path="/opportunities" element={<Layout><LookingForPage /></Layout>} />
            <Route path="/startups/:slug" element={<Layout><StartupProfilePage /></Layout>} />
            <Route path="/orders" element={<Layout><OrdersPage /></Layout>} />
            <Route path="/orders/:id" element={<Layout><OrderDetailPage /></Layout>} />
            <Route path="/explore" element={<Layout><StartupDirectoryPage /></Layout>} />
            <Route path="/product/:id" element={<Layout><ProductPage /></Layout>} />
            <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
            <Route path="/profile/:id" element={<Layout><ProfilePage /></Layout>} />
            <Route path="/sell" element={<Layout><SellPage /></Layout>} />
            <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
            <Route path="/verify" element={<Layout><VerificationPage /></Layout>} />
            <Route path="/messages" element={<Navigate to="/dashboard" replace />} />
            <Route path="/community" element={<Layout><CommunityPage /></Layout>} />
            <Route path="/favourites" element={<Navigate to="/products" replace />} />
            <Route path="/notifications" element={<Layout><NotificationsPage /></Layout>} />
            <Route path="/search" element={<Layout><SearchPage /></Layout>} />
            <Route path="/wanted" element={<Layout><WantedPage /></Layout>} />
            <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
            <Route path="/admin" element={<Layout><AdminPage /></Layout>} />
            <Route path="/about" element={<Layout><AboutPage /></Layout>} />
            <Route path="/how-it-works" element={<Layout><HowItWorksPage /></Layout>} />
            <Route path="/safety" element={<Layout><SafetyPage /></Layout>} />
            <Route path="/prohibited" element={<Layout><ProhibitedPage /></Layout>} />
            <Route path="/terms" element={<Layout><TermsPage /></Layout>} />
            <Route path="/privacy" element={<Layout><PrivacyPage /></Layout>} />
            <Route path="/community-guidelines" element={<Layout><CommunityGuidelinesPage /></Layout>} />
            <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
            <Route path="/report-problem" element={<Layout><ReportProblemPage /></Layout>} />
            <Route path="/signin" element={<Layout showFooter={false}><SignInPage /></Layout>} />
            <Route path="/join" element={<Layout showFooter={false}><JoinPage /></Layout>} />
            <Route path="*" element={<Layout><HomePage /></Layout>} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
