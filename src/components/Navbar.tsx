import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Compass,
  PlusCircle,
  MessageCircle,
  Bell,
  User,
  Menu,
  X,
  Search,
  Store,
  Info,
  HelpCircle,
  Heart,
  Users,
  Shield,
  Settings,
  Search as SearchIcon,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Navbar() {
  const { isAuthed, currentUser, unreadNotificationCount, conversations } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const unreadMessages = conversations.reduce((sum, c) => sum + c.unread, 0);
  const hasNotifications = unreadNotificationCount > 0;
  const hasMessages = unreadMessages > 0;

  interface NavLinkItem {
    to: string;
    label: string;
    icon: typeof Home;
    badge?: number;
  }

  const authedLinks: NavLinkItem[] = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/explore', label: 'Explore', icon: Compass },
    { to: '/community', label: 'Community', icon: Users },
    { to: '/messages', label: 'Messages', icon: MessageCircle, badge: hasMessages ? unreadMessages : undefined },
    { to: '/notifications', label: 'Notifications', icon: Bell, badge: hasNotifications ? unreadNotificationCount : undefined },
    { to: '/favourites', label: 'Favourites', icon: Heart },
  ];

  const guestLinks: NavLinkItem[] = [
    { to: '/explore', label: 'Explore', icon: Compass },
    { to: '/about', label: 'About', icon: Info },
    { to: '/how-it-works', label: 'How It Works', icon: HelpCircle },
  ];

  const links = isAuthed ? authedLinks : guestLinks;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 glass border-b border-ink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-soft">
            <Store size={20} className="text-white" />
          </div>
          <span className="font-bold text-lg text-ink-800 hidden sm:block tracking-tight">AMPLOFY</span>
        </Link>

        {isAuthed && (
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products, sellers, posts..."
                className="w-full bg-ink-50 border border-transparent rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:bg-white focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all"
                aria-label="Search AMPLOFY"
              />
            </div>
          </form>
        )}

        <nav className="hidden lg:flex items-center gap-1 ml-auto">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-50 hover:text-ink-800'
                }`
              }
            >
              <link.icon size={18} />
              {link.label}
              {link.badge ? (
                <span className="ml-0.5 min-w-[18px] h-[18px] px-1 bg-error-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {link.badge}
                </span>
              ) : null}
            </NavLink>
          ))}
          {isAuthed && (
            <NavLink
              to="/sell"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3.5 py-2 ml-1 rounded-xl text-sm font-semibold transition-colors ${
                  isActive ? 'bg-brand-700 text-white' : 'bg-brand-600 text-white hover:bg-brand-700'
                }`
              }
            >
              <PlusCircle size={18} />
              Sell Something
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-2 ml-auto lg:ml-2">
          {isAuthed && (
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden w-10 h-10 rounded-xl hover:bg-ink-50 flex items-center justify-center transition-colors"
              aria-label="Search"
            >
              <Search size={20} className="text-ink-600" />
            </button>
          )}

          {isAuthed && currentUser ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-ink-50 transition-colors"
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name || 'Profile'}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-100"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-brand-100 ring-2 ring-brand-50 flex items-center justify-center">
                  <User size={16} className="text-brand-600" />
                </div>
              )}
              {currentUser.name && <span className="hidden xl:block text-sm font-medium text-ink-700">{currentUser.name}</span>}
            </Link>
          ) : !isAuthed ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/signin"
                className="px-4 py-2 text-sm font-semibold text-ink-700 hover:text-brand-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/join"
                className="px-4 py-2 text-sm font-semibold bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors"
              >
                Join
              </Link>
            </div>
          ) : null}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-xl hover:bg-ink-50 flex items-center justify-center transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={22} className="text-ink-700" /> : <Menu size={22} className="text-ink-700" />}
          </button>
        </div>
      </div>

      {searchOpen && isAuthed && (
        <div className="lg:hidden px-4 pb-3 animate-fade-in">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products, sellers, posts..."
                className="w-full bg-ink-50 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-brand-200"
                autoFocus
              />
            </div>
          </form>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-ink-100 bg-white animate-fade-in">
          <nav className="px-4 py-3 space-y-1">
            {links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-50'
                  }`
                }
              >
                <link.icon size={20} />
                {link.label}
                {link.badge ? (
                  <span className="ml-auto min-w-[20px] h-5 px-1.5 bg-error-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {link.badge}
                  </span>
                ) : null}
              </NavLink>
            ))}
            {isAuthed && (
              <>
                <NavLink
                  to="/sell"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 mt-2 rounded-xl text-sm font-semibold bg-brand-600 text-white"
                >
                  <PlusCircle size={20} /> Sell Something
                </NavLink>
                <NavLink
                  to="/wanted"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-600 hover:bg-ink-50"
                >
                  <SearchIcon size={20} /> Wanted Board
                </NavLink>
                <NavLink
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-600 hover:bg-ink-50"
                >
                  <User size={20} /> Seller Dashboard
                </NavLink>
                <NavLink
                  to="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-600 hover:bg-ink-50"
                >
                  <Settings size={20} /> Settings
                </NavLink>
                <NavLink
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-600 hover:bg-ink-50"
                >
                  <Shield size={20} /> Admin Dashboard
                </NavLink>
              </>
            )}
            {!isAuthed && (
              <div className="pt-2 border-t border-ink-100 flex gap-2">
                <Link
                  to="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2.5 text-sm font-semibold text-ink-700 border border-ink-200 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/join"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2.5 text-sm font-semibold bg-brand-600 text-white rounded-xl"
                >
                  Join
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
