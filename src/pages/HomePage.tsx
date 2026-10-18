import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  BookOpen,
  Laptop,
  Home as HomeIcon,
  GraduationCap,
  Palette,
  Code,
  Camera,
  TrendingUp,
  Truck,
  Music,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Plus,
  Handshake,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/ProductCard';
import ServiceListCard from '@/components/ServiceListCard';
import StartupCard from '@/components/StartupCard';
import { LookingForCard } from '@/components/LookingForCard';
import { RespondLookingForModal } from '@/components/RespondLookingForModal';
import type { StartupLookingFor } from '@/data/types';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const navigate = useNavigate();
  const { listings, services, startups, lookingForRequests } = useApp();

  const [activeSearchTab, setActiveSearchTab] = useState<'products' | 'services' | 'startups'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [respondingRequest, setRespondingRequest] = useState<StartupLookingFor | null>(null);

  const categories = [
    { name: 'Textbooks', icon: BookOpen, type: 'products', param: 'Textbooks' },
    { name: 'Electronics', icon: Laptop, type: 'products', param: 'Electronics' },
    { name: 'Dorm', icon: HomeIcon, type: 'products', param: 'Dorm' },
    { name: 'Tutoring', icon: GraduationCap, type: 'services', param: 'Tutoring' },
    { name: 'Design', icon: Palette, type: 'services', param: 'Design' },
    { name: 'Development', icon: Code, type: 'services', param: 'Development' },
    { name: 'Photography', icon: Camera, type: 'services', param: 'Photography' },
    { name: 'Marketing', icon: TrendingUp, type: 'services', param: 'Marketing' },
    { name: 'Moving', icon: Truck, type: 'services', param: 'Labor' },
    { name: 'Music', icon: Music, type: 'services', param: 'Music' },
  ];

  const popularChips = [
    { label: 'Laptops', type: 'products', q: 'MacBook' },
    { label: 'Textbooks', type: 'products', q: 'Calculus' },
    { label: 'Tutoring', type: 'services', q: 'Tutoring' },
    { label: 'Web Design', type: 'services', q: 'Design' },
    { label: 'Roommates', type: 'products', q: 'Dorm' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (activeSearchTab === 'services') {
      navigate(`/services${query ? `?q=${encodeURIComponent(query)}` : ''}`);
    } else if (activeSearchTab === 'startups') {
      navigate(`/startups${query ? `?q=${encodeURIComponent(query)}` : ''}`);
    } else {
      navigate(`/products${query ? `?q=${encodeURIComponent(query)}` : ''}`);
    }
  };

  // Filter products for the 2x2 grid (first 4 products)
  const productItems = listings.filter(l => l.type === 'product').slice(0, 4);

  // Filter trending services (first 4 services)
  const trendingServices = (services.length > 0 ? services : listings.filter(l => l.type === 'service')).slice(0, 4);

  // Featured startups (first 3)
  const featuredStartups = startups.slice(0, 3);

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 md:pt-16 pb-12 overflow-hidden bg-gradient-to-b from-teal-50/50 via-slate-50/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>The Campus Marketplace & Startup Hub</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-3xl mx-auto mb-4">
            Buy, sell & hire talent on campus
          </h1>

          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            The safest place for students and student startups to trade goods and offer services.
          </p>

          {/* Centered Search Widget */}
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md border border-slate-200 p-2 sm:p-2.5 mb-5 text-left">
            {/* Search Type Tabs */}
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-2 px-2">
              <button
                type="button"
                onClick={() => setActiveSearchTab('products')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  activeSearchTab === 'products'
                    ? 'bg-[#0F766E] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Products
              </button>
              <button
                type="button"
                onClick={() => setActiveSearchTab('services')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  activeSearchTab === 'services'
                    ? 'bg-[#0F766E] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Services
              </button>
              <button
                type="button"
                onClick={() => setActiveSearchTab('startups')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  activeSearchTab === 'startups'
                    ? 'bg-[#0F766E] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Startups
              </button>
            </div>

            {/* Input & Submit */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={
                    activeSearchTab === 'services'
                      ? 'Search tutoring, design, web dev, photography...'
                      : activeSearchTab === 'startups'
                      ? 'Search student-founded ventures, agencies, labs...'
                      : 'What are you looking for?'
                  }
                  className="w-full bg-transparent pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <Button type="submit" variant="primary" size="md">
                <Search className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </form>
          </div>

          {/* Popular Search Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 mb-8">
            <span className="font-semibold text-slate-700">Popular:</span>
            {popularChips.map(chip => (
              <button
                key={chip.label}
                type="button"
                onClick={() => {
                  if (chip.type === 'services') {
                    navigate(`/services?q=${encodeURIComponent(chip.q)}`);
                  } else {
                    navigate(`/products?q=${encodeURIComponent(chip.q)}`);
                  }
                }}
                className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-teal-400 hover:text-[#0F766E] hover:bg-teal-50/50 transition-all cursor-pointer font-medium"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Two CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/products">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Explore marketplace
              </Button>
            </Link>
            <Link to="/sell">
              <Button variant="secondary" size="lg" leftIcon={<Plus className="w-4 h-4" />}>
                Start selling
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-3 pt-1">
          {categories.map(cat => (
            <Link
              key={cat.name}
              to={cat.type === 'services' ? `/services?category=${cat.param}` : `/products?category=${cat.param}`}
              className="group flex flex-col items-center justify-center min-w-[5.25rem] p-3 rounded-xl bg-white border border-slate-200 hover:border-[#0F766E] hover:bg-teal-50/30 hover:-translate-y-0.5 transition-all duration-150 shadow-2xs shrink-0"
            >
              <div className="w-10 h-10 rounded-lg bg-teal-50 group-hover:bg-[#0F766E] flex items-center justify-center text-[#0F766E] group-hover:text-white transition-colors mb-1.5">
                <cat.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-[#0F766E] transition-colors whitespace-nowrap">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED STARTUPS ROW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Student Ventures
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Featured Startups
            </h2>
          </div>
          <Link
            to="/startups"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F766E] hover:text-[#115E59] transition-colors"
          >
            <span>View all startups</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredStartups.map(startup => (
            <StartupCard key={startup.id} startup={startup} />
          ))}
        </div>
      </section>

      {/* 3.5 STARTUP "LOOKING FOR" & COLLABORATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-purple-900/5 via-indigo-900/5 to-teal-900/5 border border-purple-200/70 rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold mb-2">
                <Handshake size={14} className="text-purple-600" />
                <span>Collegiate Collaborator Hub</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Startups Are Looking For...
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                Early-stage campus ventures actively seeking co-founders, clothing designers, beta testers, and marketing collaborators.
              </p>
            </div>
            <Link
              to="/looking-for"
              className="text-xs sm:text-sm font-bold text-purple-700 hover:text-purple-800 inline-flex items-center gap-1 shrink-0"
            >
              <span>Explore all {lookingForRequests.length} requests</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {lookingForRequests.slice(0, 3).map(req => (
              <LookingForCard
                key={req.id}
                request={req}
                onRespond={r => setRespondingRequest(r)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. TWO-COLUMN BLOCK: FEATURED PRODUCTS | TRENDING SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Featured Products (2x2 Grid) */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Featured Products
              </h2>
              <Link
                to="/products"
                className="text-xs font-semibold text-[#0F766E] hover:underline inline-flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {productItems.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* Right Column: Trending Services (Stacked List Cards) */}
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Trending Services
              </h2>
              <Link
                to="/services"
                className="text-xs font-semibold text-[#0F766E] hover:underline inline-flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {trendingServices.map(service => (
                <ServiceListCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (3 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1 block">
            Simple & Transparent
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            How It Works
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Campus commerce made safe, direct, and completely free of hidden middlemen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0F766E] font-bold text-lg flex items-center justify-center mx-auto mb-4 border border-teal-100">
              1
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1.5">Post</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              List products you want to sell or professional services you provide in under 60 seconds.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 font-bold text-lg flex items-center justify-center mx-auto mb-4 border border-amber-100">
              2
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1.5">Connect</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Buyers and clients reach out directly via verified WhatsApp, email, or order inquiry forms.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 font-bold text-lg flex items-center justify-center mx-auto mb-4 border border-indigo-100">
              3
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1.5">Get It Done</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Meet up in trusted public campus locations or deliver work digitally with timeline tracking.
            </p>
          </div>
        </div>
      </section>

      {/* 6. JOIN THE COMMUNITY BLOCK (Amber eyebrow, Image left, Text right) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 lg:p-12 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Image Left */}
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
                <img
                  src="https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1000"
                  alt="Students on campus collaboration"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Text Right */}
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block">
                JOIN THE COMMUNITY
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                More than a marketplace — it's your campus network
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                Connect with verified students and student-founded startups to buy, sell, and exchange skills. Every listing is backed by our campus peer review system so you can trade with confidence.
              </p>

              {/* Checklist */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>Verified student accounts &amp; verified startups</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>Secure orders, custom quotes &amp; verified reviews</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>Zero fees for students (startups pay a small fee)</span>
                </div>
              </div>

              <div className="pt-3">
                <Link to="/join">
                  <Button variant="primary" size="md">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL TEAL CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#0F766E] rounded-2xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-lg">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Got something to sell or a skill to share?
            </h2>
            <p className="text-sm sm:text-base text-teal-100 font-normal leading-relaxed">
              Post your first ad in under a minute and reach thousands of students on campus today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link to="/sell">
                <button
                  type="button"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-bold text-sm bg-white text-[#0F766E] hover:bg-teal-50 transition-colors shadow-sm"
                >
                  Create Listing
                </button>
              </Link>
              <Link to="/products">
                <button
                  type="button"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-semibold text-sm border border-white text-white hover:bg-white/10 transition-colors"
                >
                  Browse Categories
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Looking For Response Modal */}
      <RespondLookingForModal
        isOpen={!!respondingRequest}
        onClose={() => setRespondingRequest(null)}
        request={respondingRequest}
      />
    </div>
  );
}
