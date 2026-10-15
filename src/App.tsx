import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import Layout from '@/components/Layout';

import HomePage from '@/pages/HomePage';
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
import SettingsPage from '@/pages/SettingsPage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/explore" element={<Layout><ExplorePage /></Layout>} />
          <Route path="/product/:id" element={<Layout><ProductPage /></Layout>} />
          <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
          <Route path="/profile/:id" element={<Layout><ProfilePage /></Layout>} />
          <Route path="/sell" element={<Layout><SellPage /></Layout>} />
          <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
          <Route path="/verify" element={<Layout><VerificationPage /></Layout>} />
          <Route path="/messages" element={<Layout fullHeight><MessagesPage /></Layout>} />
          <Route path="/community" element={<Layout><CommunityPage /></Layout>} />
          <Route path="/favourites" element={<Layout><FavouritesPage /></Layout>} />
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
    </AppProvider>
  );
}

export default App;
