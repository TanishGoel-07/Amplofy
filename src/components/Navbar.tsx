import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Store,
  Search,
  Plus,
  LayoutDashboard,
  ShoppingBag,
  Settings,
  LogOut,
  Repeat,
  Menu,
  X,
  Sparkles,
  Briefcase,
  Users,
  Handshake,
  Rocket,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useUserMode } from '@/hooks/useUserMode';

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser, isAuthed, signOut } = useApp();
  const { mode, toggleMode, setMode } = useUserMode();

  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const avatarRef = useRef<HTMLDivElement>(null);

  // Close avatar dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setAvatarMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?q=${encodeURIComponent(searchQuery.trim())}`);
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
        <div className="flex items-center gap-3 xl:gap-6 shrink-0 min-w-0">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#0F766E] flex items-center justify-center text-white shadow-sm group-hover:bg-[#115E59] transition-colors">
              <Store className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight leading-none">
                  AMPLOFY
                </span>
                <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded-md ${
                  mode === 'seller' ? 'bg-amber-100 text-amber-800' : 'bg-teal-50 text-[#0F766E]'
                }`}>
                  {mode === 'seller' ? 'Founder' : 'Marketplace'}
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-400 tracking-wider">
                Campus Startup Services
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Items */}
          <nav className="hidden md:flex items-center gap-1">
            {mode === 'buyer' ? (
              // ─── BUYER NAVIGATION LINKS ───
              <>
                <NavLink
                  to="/services"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-teal-50 text-[#0F766E]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <Briefcase className="w-4 h-4 text-[#0F766E]" />
                  <span>Startup Services</span>
                </NavLink>

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
              </>
            ) : (
              // ─── SELLER / FOUNDER NAVIGATION LINKS ───
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-600" />
                  <span>Dashboard</span>
                </NavLink>

                <NavLink
                  to="/dashboard?tab=listings"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <Briefcase className="w-4 h-4 text-slate-500" />
                  <span>My Services</span>
                </NavLink>

                <NavLink
                  to="/orders"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <ShoppingBag className="w-4 h-4 text-slate-500" />
                  <span>Client Orders</span>
                </NavLink>

                <NavLink
                  to="/looking-for"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <Handshake className="w-4 h-4 text-purple-600" />
                  <span>Looking For Board</span>
                </NavLink>

                <NavLink
                  to="/startups"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Directory</span>
                </NavLink>
              </>
            )}
          </nav>
        </div>

        {/* Center: Search input (desktop) */}
        <div className="hidden xl:flex flex-1 max-w-sm mx-3 min-w-0">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search startup services (dev, design, tutoring, photo)..."
                className="w-full bg-slate-100 border border-transparent rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 transition-all outline-none"
              />
            </div>
          </form>
        </div>

        {/* Right: Actions, Log in / Avatar Menu, and Post button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile search toggle */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(prev => !prev)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Quick Mode Switcher Pill in Top Bar */}
          {mode === 'buyer' ? (
            <button
              type="button"
              onClick={toggleMode}
              title="Switch to Startup Founder Mode to sell services"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 border border-slate-200 transition-all whitespace-nowrap shrink-0 shadow-2xs cursor-pointer select-none"
            >
              <Rocket className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="whitespace-nowrap">Founder Mode</span>
              <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleMode}
              title="Switch back to Buyer Mode"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-[#0F766E] bg-teal-50 hover:bg-teal-100 hover:border-teal-300 border border-teal-200 transition-all whitespace-nowrap shrink-0 shadow-2xs cursor-pointer select-none"
            >
              <Briefcase className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
              <span className="whitespace-nowrap">Buyer Mode</span>
              <ArrowRight className="w-3 h-3 text-teal-400 shrink-0" />
            </button>
          )}

          {/* "+ Post Service" Button — ONLY VISIBLE IN SELLER/FOUNDER MODE */}
          {mode === 'seller' && (
            <Link to="/sell" className="shrink-0">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-4 h-4 shrink-0" />}
                className="hidden sm:inline-flex bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-xs border border-amber-600/30 whitespace-nowrap shrink-0"
              >
                + Post Service
              </Button>
            </Link>
          )}

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
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-scale-in">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {currentUser.name || 'Campus Member'}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {currentUser.campus || currentUser.username || 'Student'}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-500">Active mode:</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        mode === 'seller' ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-teal-50 text-[#0F766E] border-teal-200'
                      }`}>
                        {mode === 'seller' ? '🚀 Startup Founder' : '🛍️ Buyer / Hire'}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    {mode === 'buyer' ? (
                      // ─── BUYER MENU ITEMS (NO SELLER JUNK) ───
                      <>
                        <Link
                          to="/orders"
                          onClick={() => setAvatarMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        >
                          <ShoppingBag className="w-4 h-4 text-[#0F766E]" />
                          <span>My Hires & Orders</span>
                        </Link>
                        <Link
                          to="/services"
                          onClick={() => setAvatarMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        >
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          <span>Browse Startup Services</span>
                        </Link>
                        <Link
                          to="/dashboard?tab=my-collabs"
                          onClick={() => setAvatarMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        >
                          <Handshake className="w-4 h-4 text-purple-600" />
                          <span>My Collab Pitches</span>
                        </Link>
                      </>
                    ) : (
                      // ─── FOUNDER / SELLER MENU ITEMS ───
                      <>
                        <Link
                          to="/dashboard"
                          onClick={() => setAvatarMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        >
                          <LayoutDashboard className="w-4 h-4 text-amber-600" />
                          <span>Founder Dashboard</span>
                        </Link>
                        <Link
                          to="/dashboard?tab=listings"
                          onClick={() => setAvatarMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        >
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          <span>Manage Services</span>
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setAvatarMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        >
                          <ShoppingBag className="w-4 h-4 text-slate-400" />
                          <span>Client Orders & Quotes</span>
                        </Link>
                        <Link
                          to="/dashboard?tab=looking-for"
                          onClick={() => setAvatarMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        >
                          <Handshake className="w-4 h-4 text-purple-600" />
                          <span>Looking For Roles</span>
                        </Link>
                        <Link
                          to="/sell"
                          onClick={() => setAvatarMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50"
                        >
                          <Plus className="w-4 h-4 text-amber-600" />
                          <span>+ Create New Service</span>
                        </Link>
                      </>
                    )}

                    <Link
                      to="/settings"
                      onClick={() => setAvatarMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-t border-slate-100 mt-1"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Settings</span>
                    </Link>
                  </div>

                  {/* Mode Switcher Toggle Button */}
                  <div className="py-1 border-t border-slate-100 bg-slate-50/60">
                    <button
                      type="button"
                      onClick={() => {
                        toggleMode();
                      }}
                      className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 text-left transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Repeat className="w-4 h-4 text-slate-400" />
                        <span>Switch mode</span>
                      </span>
                      <span className={`text-[11px] font-bold ${
                        mode === 'buyer' ? 'text-amber-700' : 'text-[#0F766E]'
                      }`}>
                        {mode === 'buyer' ? '→ Founder Mode' : '→ Buyer Mode'}
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
            <div className="flex items-center gap-2 shrink-0">
              <Link to="/signin" className="shrink-0">
                <Button variant="ghost" size="sm" className="whitespace-nowrap">
                  Log in
                </Button>
              </Link>
              <Link to="/join" className="shrink-0">
                <Button variant="secondary" size="sm" className="whitespace-nowrap">
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
                placeholder="Search startup services..."
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
          {/* Active Mode Banner in Mobile Menu */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Current View</span>
              <span className="text-xs font-bold text-slate-900">
                {mode === 'seller' ? '🚀 Startup Founder Mode' : '🛍️ Campus Buyer Mode'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                toggleMode();
              }}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white border border-slate-300 text-slate-700 shadow-2xs hover:bg-slate-100"
            >
              Switch to {mode === 'buyer' ? 'Founder' : 'Buyer'}
            </button>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider px-2">
              Explore Services
            </p>
            <Link
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Briefcase className="w-4 h-4 text-[#0F766E]" />
              <span>Startup Services Directory</span>
            </Link>
            <Link
              to="/startups"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Campus Startups</span>
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
                Roles
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

          {/* "+ Post Service" in Mobile Drawer ONLY IF IN SELLER MODE */}
          {mode === 'seller' && (
            <div className="pt-2 border-t border-slate-100">
              <Link
                to="/sell"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-amber-500 text-slate-950 font-bold text-sm shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>+ List a Startup Service</span>
              </Link>
            </div>
          )}

          {isAuthed && currentUser && (
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider px-2">
                {mode === 'seller' ? 'Founder Portal' : 'My Account'}
              </p>
              {mode === 'seller' ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <LayoutDashboard className="w-4 h-4 text-amber-600" />
                    <span>Founder Dashboard</span>
                  </Link>
                  <Link
                    to="/dashboard?tab=listings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span>Manage Services</span>
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <ShoppingBag className="w-4 h-4 text-slate-400" />
                    <span>Client Orders</span>
                  </Link>
                </>
              ) : (
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <ShoppingBag className="w-4 h-4 text-[#0F766E]" />
                  <span>My Hired Services & Orders</span>
                </Link>
              )}
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
