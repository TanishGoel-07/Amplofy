import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Store,
  Search,
  Plus,
  ChevronDown,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  LogOut,
  Repeat,
  Menu,
  X,
  Sparkles,
  Briefcase,
  Users,
  Compass,
  GraduationCap,
  Handshake,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useUserMode } from '@/hooks/useUserMode';

export default function Navbar() {
  const { isAuthed, currentUser, signOut } = useApp();
  const { mode, toggleMode } = useUserMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [marketplaceOpen, setMarketplaceOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const navigate = useNavigate();
  const marketplaceRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (marketplaceRef.current && !marketplaceRef.current.contains(e.target as Node)) {
        setMarketplaceOpen(false);
      }
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    setAvatarMenuOpen(false);
    setMobileMenuOpen(false);
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Desktop Nav Links */}
        <div className="flex items-center gap-6 shrink-0">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#0F766E] flex items-center justify-center text-white shadow-sm group-hover:bg-[#115E59] transition-colors">
              <Store className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-900 tracking-tight leading-none">
                AMPLOFY
              </span>
              <span className="text-[10px] font-medium text-slate-400 tracking-wider">
                Find. Create. Belong.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Items */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Marketplace Dropdown */}
            <div className="relative" ref={marketplaceRef}>
              <button
                type="button"
                onClick={() => setMarketplaceOpen(prev => !prev)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  marketplaceOpen
                    ? 'bg-teal-50 text-[#0F766E]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                aria-expanded={marketplaceOpen}
              >
                <span>Marketplace</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    marketplaceOpen ? 'rotate-180 text-[#0F766E]' : 'text-slate-400'
                  }`}
                />
              </button>

              {marketplaceOpen && (
                <div className="absolute left-0 mt-1.5 w-60 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-fade-in">
                  <Link
                    to="/products"
                    onClick={() => setMarketplaceOpen(false)}
                    className="flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-teal-50 text-[#0F766E] shrink-0 mt-0.5">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Products</p>
                      <p className="text-xs text-slate-500">Books, electronics, dorm gear & more</p>
                    </div>
                  </Link>

                  <Link
                    to="/services"
                    onClick={() => setMarketplaceOpen(false)}
                    className="flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0 mt-0.5">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Services</p>
                      <p className="text-xs text-slate-500">Tutoring, design, dev, photo & skills</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Startups */}
            <NavLink
              to="/startups"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-teal-50 text-[#0F766E]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Startups</span>
            </NavLink>

            {/* Looking For (Startup Collabs) */}
            <NavLink
              to="/looking-for"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-teal-50 text-[#0F766E]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Handshake className="w-4 h-4 text-purple-600" />
              <span>Looking For</span>
              <span className="hidden xl:inline-block px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                Collabs
              </span>
            </NavLink>

            {/* Community */}
            <NavLink
              to="/community"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-teal-50 text-[#0F766E]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Users className="w-4 h-4 text-slate-400" />
              <span>Community</span>
            </NavLink>
          </nav>
        </div>

        {/* Center: Search input (desktop) */}
        <div className="hidden lg:flex flex-1 max-w-md mx-2">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products, services, campus startups..."
                className="w-full bg-slate-100 border border-transparent rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 transition-all outline-none"
              />
            </div>
          </form>
        </div>

        {/* Right: Actions, Log in / Avatar Menu, and Post button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search toggle */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(prev => !prev)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* "+ Post" Button */}
          <Link to="/sell">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              className="hidden sm:inline-flex"
            >
              Post
            </Button>
          </Link>

          {/* User Auth or Avatar Dropdown */}
          {isAuthed && currentUser ? (
            <div className="relative" ref={avatarRef}>
              <button
                type="button"
                onClick={() => setAvatarMenuOpen(prev => !prev)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-slate-200 transition-all focus:outline-none"
                aria-label="User menu"
              >
                <Avatar
                  src={currentUser.avatar}
                  name={currentUser.name}
                  size="sm"
                  verified={currentUser.verified}
                />
              </button>

              {/* Logged-in Avatar Menu */}
              {avatarMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-scale-in">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {currentUser.name || 'Campus Member'}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {currentUser.campus || currentUser.username || 'Student'}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-600">Active mode:</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-[#0F766E] border border-teal-200">
                        {mode === 'seller' ? 'Seller' : 'Buyer'}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/dashboard"
                      onClick={() => setAvatarMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      to="/dashboard?tab=listings"
                      onClick={() => setAvatarMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <Package className="w-4 h-4 text-slate-400" />
                      <span>My Listings</span>
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setAvatarMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <ShoppingBag className="w-4 h-4 text-slate-400" />
                      <span>Orders</span>
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setAvatarMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Settings</span>
                    </Link>
                  </div>

                  <div className="py-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        toggleMode();
                      }}
                      className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 text-left"
                    >
                      <span className="flex items-center gap-2">
                        <Repeat className="w-4 h-4 text-slate-400" />
                        <span>Switch mode</span>
                      </span>
                      <span className="text-[11px] font-bold text-[#0F766E]">
                        {mode === 'buyer' ? 'Go to Seller' : 'Go to Buyer'}
                      </span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/signin">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/join">
                <Button variant="secondary" size="sm">
                  Join
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile hamburger menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Expand */}
      {mobileSearchOpen && (
        <div className="lg:hidden px-4 pb-3 pt-1 border-b border-slate-200 bg-white animate-fade-in">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products, services, startups..."
                className="w-full bg-slate-100 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                autoFocus
              />
            </div>
          </form>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 animate-fade-in shadow-xl">
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider px-2">
              Marketplace
            </p>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <ShoppingBag className="w-4 h-4 text-[#0F766E]" />
              <span>Products</span>
            </Link>
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Services</span>
            </Link>
            <Link
              to="/startups"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Startups</span>
            </Link>
            <Link
              to="/looking-for"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <Handshake className="w-4 h-4 text-purple-600" />
                <span>Looking For (Collabs)</span>
              </div>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                Opportunities
              </span>
            </Link>
            <Link
              to="/community"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Users className="w-4 h-4 text-slate-500" />
              <span>Community</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <Link
              to="/sell"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#0F766E] text-white font-semibold text-sm shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>+ Post a Listing</span>
            </Link>
          </div>

          {isAuthed && currentUser && (
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider px-2">
                My Account ({mode === 'seller' ? 'Seller Mode' : 'Buyer Mode'})
              </p>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-400" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/dashboard?tab=listings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Package className="w-4 h-4 text-slate-400" />
                <span>My Listings</span>
              </Link>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <ShoppingBag className="w-4 h-4 text-slate-400" />
                <span>Orders</span>
              </Link>
              <Link
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Settings</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  toggleMode();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <span className="flex items-center gap-3">
                  <Repeat className="w-4 h-4 text-slate-400" />
                  <span>Switch mode</span>
                </span>
                <span className="text-xs font-bold text-[#0F766E]">
                  {mode === 'buyer' ? 'Seller mode' : 'Buyer mode'}
                </span>
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
