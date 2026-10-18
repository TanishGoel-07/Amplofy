import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  X,
  Star,
  Clock,
  Sparkles,
  Search,
  Briefcase,
  GraduationCap,
  Palette,
  Code,
  Camera,
  Truck,
  Music,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import ServiceCard from '@/components/ServiceCard';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';

const SERVICE_HERO_CHIPS = ['Tutoring', 'Design', 'Development', 'Moving', 'Music', 'Photography'];

const CATEGORIES = [
  'All Categories',
  'Tutoring',
  'Design',
  'Development',
  'Photography',
  'Labor',
  'Coaching',
  'Music',
  'Marketing',
];

export default function ServicesPage() {
  const { services, listings } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCat = searchParams.get('category') || 'All Categories';
  const initialQ = searchParams.get('q') || '';

  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState(initialQ);
  const [minBudget, setMinBudget] = useState<string>('');
  const [maxBudget, setMaxBudget] = useState<string>('');
  const [deliveryTime, setDeliveryTime] = useState<'any' | '24h' | '3d' | '1w'>('any');
  const [ratingFilter, setRatingFilter] = useState<'any' | '4' | '4.5'>('any');
  const [sellerType, setSellerType] = useState<'all' | 'student' | 'startup'>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'rating'>('recommended');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    const q = searchParams.get('q');
    if (cat) setActiveCategory(cat);
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const resetFilters = () => {
    setActiveCategory('All Categories');
    setSearchQuery('');
    setMinBudget('');
    setMaxBudget('');
    setDeliveryTime('any');
    setRatingFilter('any');
    setSellerType('all');
    setSortBy('recommended');
    setCurrentPage(1);
  };

  // Filter services
  const allServices = services.length > 0 ? services : listings.filter(l => l.type === 'service');

  const filteredServices = useMemo(() => {
    let result = [...allServices];

    // Category
    if (activeCategory !== 'All Categories') {
      result = result.filter(
        s => s.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        s =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          (s.seller?.name && s.seller.name.toLowerCase().includes(q))
      );
    }

    // Budget range
    const min = parseFloat(minBudget);
    const max = parseFloat(maxBudget);
    if (!isNaN(min)) {
      result = result.filter(s => s.basePrice >= min);
    }
    if (!isNaN(max)) {
      result = result.filter(s => s.basePrice <= max);
    }

    // Delivery time (days)
    if (deliveryTime === '24h') {
      result = result.filter(s => (s.deliveryDays || 1) <= 1);
    } else if (deliveryTime === '3d') {
      result = result.filter(s => (s.deliveryDays || 1) <= 3);
    } else if (deliveryTime === '1w') {
      result = result.filter(s => (s.deliveryDays || 1) <= 7);
    }

    // Rating
    if (ratingFilter === '4') {
      result = result.filter(s => s.rating >= 4.0);
    } else if (ratingFilter === '4.5') {
      result = result.filter(s => s.rating >= 4.5);
    }

    // Seller type
    if (sellerType === 'student') {
      result = result.filter(s => s.ownerType !== 'startup');
    } else if (sellerType === 'startup') {
      result = result.filter(s => s.ownerType === 'startup');
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price-high':
        result.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'recommended':
      default:
        result.sort((a, b) => (b.status === 'featured' ? 1 : 0) - (a.status === 'featured' ? 1 : 0));
        break;
    }

    return result;
  }, [
    allServices,
    activeCategory,
    searchQuery,
    minBudget,
    maxBudget,
    deliveryTime,
    ratingFilter,
    sellerType,
    sortBy,
  ]);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage) || 1;
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* 1. TEAL HERO: "Find expert help on campus" */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#0F766E] to-[#115E59] text-white p-6 sm:p-10 lg:p-12 overflow-hidden shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Campus Talent &amp; Agency Services
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Find expert help on campus
            </h1>
            <p className="text-sm sm:text-base text-teal-100 max-w-xl font-normal leading-relaxed">
              From calculus tutoring to creative design, connect with talented students and student-founded startups ready to help you succeed.
            </p>

            {/* Quick Hero Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {SERVICE_HERO_CHIPS.map(chip => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setActiveCategory(chip);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    activeCategory.toLowerCase() === chip.toLowerCase()
                      ? 'bg-white text-[#0F766E] shadow-sm'
                      : 'bg-teal-800/80 hover:bg-white/20 text-white border border-teal-600/50'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Image Right */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border-2 border-white/20">
              <img
                src="https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Student collaborating on campus"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN BROWSE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Filter Sidebar (Desktop) */}
        <aside className="hidden lg:block bg-white rounded-xl border border-slate-200 p-5 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              Filter Services
            </h3>
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-[#0F766E] hover:underline"
            >
              Reset All
            </button>
          </div>

          {/* Category */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Category
            </h4>
            <div className="space-y-1.5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-teal-50 text-[#0F766E] font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Range */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Budget Range
            </h4>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min ($)"
                value={minBudget}
                onChange={e => {
                  setMinBudget(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0F766E]"
              />
              <span className="text-xs text-slate-400">to</span>
              <input
                type="number"
                placeholder="Max ($)"
                value={maxBudget}
                onChange={e => {
                  setMaxBudget(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0F766E]"
              />
            </div>
          </div>

          {/* Delivery Time */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Turnaround Time
            </h4>
            <div className="space-y-2">
              {[
                { id: 'any', label: 'Any time' },
                { id: '24h', label: 'Under 24 hours' },
                { id: '3d', label: 'Up to 3 days' },
                { id: '1w', label: 'Within 1 week' },
              ].map(opt => (
                <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-600 hover:text-slate-900 select-none">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryTime === opt.id}
                    onChange={() => {
                      setDeliveryTime(opt.id as any);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 text-[#0F766E] border-slate-300 focus:ring-[#0F766E]/20"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Rating
            </h4>
            <div className="space-y-2">
              {[
                { id: 'any', label: 'Any rating' },
                { id: '4.5', label: '4.5+ Stars' },
                { id: '4', label: '4.0+ Stars' },
              ].map(opt => (
                <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-600 hover:text-slate-900 select-none">
                  <input
                    type="radio"
                    name="rating"
                    checked={ratingFilter === opt.id}
                    onChange={() => {
                      setRatingFilter(opt.id as any);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 text-[#0F766E] border-slate-300 focus:ring-[#0F766E]/20"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Seller Type */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Seller Type
            </h4>
            <div className="space-y-2">
              {[
                { id: 'all', label: 'All Providers' },
                { id: 'student', label: 'Student Freelancers' },
                { id: 'startup', label: 'Student Startups / Agencies' },
              ].map(opt => (
                <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-600 hover:text-slate-900 select-none">
                  <input
                    type="radio"
                    name="seller"
                    checked={sellerType === opt.id}
                    onChange={() => {
                      setSellerType(opt.id as any);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 text-[#0F766E] border-slate-300 focus:ring-[#0F766E]/20"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Area: Services Grid */}
        <main className="lg:col-span-3 space-y-6">
          {/* Top Bar: Count & Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-xl border border-slate-200 px-4 py-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Browse All Services</h2>
              <p className="text-xs text-slate-500">
                Showing {filteredServices.length} expert service offerings
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                leftIcon={<SlidersHorizontal className="w-4 h-4" />}
                onClick={() => setMobileFilterOpen(true)}
              >
                Filters
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Sort:</span>
                <select
                  value={sortBy}
                  onChange={e => {
                    setSortBy(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-xs font-semibold text-slate-800 border-none outline-none focus:ring-0 cursor-pointer"
                >
                  <option value="recommended">Recommended</option>
                  <option value="rating">Top Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3-Column Service Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : paginatedServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0F766E] flex items-center justify-center mx-auto">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">No services match your filters</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting your budget or changing the delivery time filter.
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={resetFilters}>
                Clear all filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-6">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 disabled:opacity-40 hover:bg-slate-50"
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const page = idx + 1;
                const isCurrent = page === currentPage;
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                      isCurrent
                        ? 'bg-[#0F766E] text-white shadow-xs'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 disabled:opacity-40 hover:bg-slate-50"
              >
                &gt;
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto lg:hidden">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative min-h-screen flex flex-col justify-end">
            <div className="bg-white rounded-t-2xl p-6 space-y-6 max-h-[85vh] overflow-y-auto animate-slide-up">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-slate-900">Filter Services</h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-700 mb-2">Category</h4>
                <select
                  value={activeCategory}
                  onChange={e => setActiveCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Delivery */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-700 mb-2">Turnaround</h4>
                <div className="space-y-2">
                  {[
                    { id: 'any', label: 'Any time' },
                    { id: '24h', label: 'Under 24 hours' },
                    { id: '3d', label: 'Up to 3 days' },
                    { id: '1w', label: 'Within 1 week' },
                  ].map(opt => (
                    <label key={opt.id} className="flex items-center gap-2.5 text-xs text-slate-700">
                      <input
                        type="radio"
                        name="mobDelivery"
                        checked={deliveryTime === opt.id}
                        onChange={() => setDeliveryTime(opt.id as any)}
                        className="w-4 h-4 text-[#0F766E]"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <Button variant="outline" size="md" className="flex-1" onClick={resetFilters}>
                  Reset
                </Button>
                <Button variant="primary" size="md" className="flex-1" onClick={() => setMobileFilterOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
