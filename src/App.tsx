import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import Layout from '@/components/Layout';

import HomePage from '@/pages/HomePage';
import ServicesPage from '@/pages/ServicesPage';
import ServiceDetailPage from '@/pages/ServiceDetailPage';
import StartupDirectoryPage from '@/pages/StartupDirectoryPage';
import StartupProfilePage from '@/pages/StartupProfilePage';
import LookingForPage from '@/pages/LookingForPage';
import OrdersPage from '@/pages/OrdersPage';
import OrderDetailPage from '@/pages/OrderDetailPage';
import ProfilePage from '@/pages/ProfilePage';
import SellPage from '@/pages/SellPage';
import DashboardPage from '@/pages/DashboardPage';
import VerificationPage from '@/pages/VerificationPage';
import CommunityPage from '@/pages/CommunityPage';
import NotificationsPage from '@/pages/NotificationsPage';
import SearchPage from '@/pages/SearchPage';
import WantedPage from '@/pages/WantedPage';
import SettingsPage from '@/pages/SettingsPage';
import AdminPage from '@/pages/AdminPage';
import AboutPage from '@/pages/AboutPage';
import HowItWorksPage from '@/pages/HowItWorksPage';
import SafetyPage from '@/pages/SafetyPage';
import ProhibitedPage from '@/pages/ProhibitedPage';
import TermsPage from '@/pages/TermsPage';
import PrivacyPage from '@/pages/PrivacyPage';
import CommunityGuidelinesPage from '@/pages/CommunityGuidelinesPage';
import ContactPage from '@/pages/ContactPage';
import ReportProblemPage from '@/pages/ReportProblemPage';
import SignInPage from '@/pages/SignInPage';
import JoinPage from '@/pages/JoinPage';
import { ToastProvider } from '@/components/ui/Toast';

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Primary Marketplace Routes */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
            <Route path="/service/:id" element={<Layout><ServiceDetailPage /></Layout>} />
            <Route path="/services/:id" element={<Layout><ServiceDetailPage /></Layout>} />

            {/* Legacy Product Routes -> Redirected to Services */}
            <Route path="/products" element={<Navigate to="/services" replace />} />
            <Route path="/product/:id" element={<Navigate to="/services" replace />} />
            <Route path="/favourites" element={<Navigate to="/services" replace />} />

            {/* Startup Ventures & Discovery */}
            <Route path="/startups" element={<Layout><StartupDirectoryPage /></Layout>} />
            <Route path="/explore" element={<Layout><StartupDirectoryPage /></Layout>} />
            <Route path="/startups/:slug" element={<Layout><StartupProfilePage /></Layout>} />

            {/* Startup Collaboration & "Looking For" */}
            <Route path="/startups/looking-for" element={<Layout><LookingForPage /></Layout>} />
            <Route path="/looking-for" element={<Layout><LookingForPage /></Layout>} />
            <Route path="/opportunities" element={<Layout><LookingForPage /></Layout>} />

            {/* Orders & Milestones */}
            <Route path="/orders" element={<Layout><OrdersPage /></Layout>} />
            <Route path="/orders/:id" element={<Layout><OrderDetailPage /></Layout>} />

            {/* Management & Profiles */}
            <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
            <Route path="/profile/:id" element={<Layout><ProfilePage /></Layout>} />
            <Route path="/sell" element={<Layout><SellPage /></Layout>} />
            <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
            <Route path="/verify" element={<Layout><VerificationPage /></Layout>} />
            <Route path="/messages" element={<Navigate to="/dashboard" replace />} />

            {/* Community, Search & Meta */}
            <Route path="/community" element={<Layout><CommunityPage /></Layout>} />
            <Route path="/notifications" element={<Layout><NotificationsPage /></Layout>} />
            <Route path="/search" element={<Layout><SearchPage /></Layout>} />
            <Route path="/wanted" element={<Layout><WantedPage /></Layout>} />
            <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
            <Route path="/admin" element={<Layout><AdminPage /></Layout>} />

            {/* Policy & Trust */}
            <Route path="/about" element={<Layout><AboutPage /></Layout>} />
            <Route path="/how-it-works" element={<Layout><HowItWorksPage /></Layout>} />
            <Route path="/safety" element={<Layout><SafetyPage /></Layout>} />
            <Route path="/prohibited" element={<Layout><ProhibitedPage /></Layout>} />
            <Route path="/terms" element={<Layout><TermsPage /></Layout>} />
            <Route path="/privacy" element={<Layout><PrivacyPage /></Layout>} />
            <Route path="/community-guidelines" element={<Layout><CommunityGuidelinesPage /></Layout>} />
            <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
            <Route path="/report-problem" element={<Layout><ReportProblemPage /></Layout>} />

            {/* Auth */}
            <Route path="/signin" element={<Layout showFooter={false}><SignInPage /></Layout>} />
            <Route path="/join" element={<Layout showFooter={false}><JoinPage /></Layout>} />

            {/* Catch-all */}
            <Route path="*" element={<Layout><HomePage /></Layout>} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
