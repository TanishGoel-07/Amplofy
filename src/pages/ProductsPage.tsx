import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ArrowUpDown, PackageOpen } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/ProductCard';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';

type SortOption = 'newest' | 'price-low' | 'price-high' | 'nearest';

const CATEGORY_TABS = [
  'All Items',
  'Textbooks',
  'Electronics',
  'Dorm',
  'Music',
  'Other',
];

const CONDITIONS = ['New / Unopened', 'Like New', 'Gently Used', 'Fair Condition'];

export default function ProductsPage() {
  const { listings } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query params
  const initialCategory = searchParams.get('category') || 'All Items';
  const initialSearch = searchParams.get('q') || '';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]); // NONE checked by default!
  const [distanceFilter, setDistanceFilter] = useState<'all' | '1mi' | '5mi'>('all');
  const [sellerTypeFilter, setSellerTypeFilter] = useState<'all' | 'student' | 'startup'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    const q = searchParams.get('q');
    if (cat) setActiveCategory(cat);
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Handle condition toggle
  const toggleCondition = (cond: string) => {
    setSelectedConditions(prev =>
      prev.includes(cond) ? prev.filter(c => c !== cond) : [...prev, cond]
    );
    setCurrentPage(1);
  };

  // Reset all filters
  const resetFilters = () => {
    setActiveCategory('All Items');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedConditions([]);
    setDistanceFilter('all');
    setSellerTypeFilter('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  // Filter listings where type === 'product'
  const filteredProducts = useMemo(() => {
    let result = listings.filter(l => l.type === 'product');

    // Category filter
    if (activeCategory !== 'All Items') {
      result = result.filter(
        p => p.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.seller?.name && p.seller.name.toLowerCase().includes(q))
      );
    }

    // Price range
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    if (!isNaN(min)) {
      result = result.filter(p => p.basePrice >= min);
    }
    if (!isNaN(max)) {
      result = result.filter(p => p.basePrice <= max);
    }

    // Conditions
    if (selectedConditions.length > 0) {
      result = result.filter(p => {
        const cond = p.condition?.toLowerCase() || '';
        return selectedConditions.some(c => {
          const cleanC = c.toLowerCase().replace(' / unopened', '').replace(' condition', '');
          return cond.includes(cleanC);
        });
      });
    }

    // Distance
    if (distanceFilter === '1mi') {
      result = result.filter(p => {
        const distNum = parseFloat(p.distance || '0');
        return distNum <= 1.0;
      });
    } else if (distanceFilter === '5mi') {
      result = result.filter(p => {
        const distNum = parseFloat(p.distance || '0');
        return distNum <= 5.0;
      });
    }

    // Seller type
    if (sellerTypeFilter === 'student') {
      result = result.filter(p => p.ownerType !== 'startup');
    } else if (sellerTypeFilter === 'startup') {
      result = result.filter(p => p.ownerType === 'startup');
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price-high':
        result.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'nearest':
        result.sort((a, b) => parseFloat(a.distance || '0') - parseFloat(b.distance || '0'));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [
    listings,
    activeCategory,
    searchQuery,
    minPrice,
    maxPrice,
    selectedConditions,
    distanceFilter,
    sellerTypeFilter,
    sortBy,
  ]);

  // Pagination (6 items per page for clean 3-col 2-row view)
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Browse Products
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Find books, electronics, dorm essentials and more from fellow students.
        </p>
      </div>

      {/* Category Pills Strip */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
        {CATEGORY_TABS.map(cat => {
          const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setActiveCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#0F766E] text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
        <span className="text-xs font-semibold text-slate-500">
          Showing {filteredProducts.length} items
        </span>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<SlidersHorizontal className="w-4 h-4" />}
          onClick={() => setMobileFilterOpen(true)}
        >
          Filters
        </Button>
      </div>

      {/* Main Layout: Left Sidebar + 3-Col Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Filter Sidebar (Desktop) */}
        <aside className="hidden lg:block bg-white rounded-xl border border-slate-200 p-5 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              Filters
            </h3>
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-[#0F766E] hover:underline"
            >
              Reset All
            </button>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Price Range
            </h4>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={e => {
                    setMinPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-6 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0F766E]"
                />
              </div>
              <span className="text-xs text-slate-400">to</span>
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={e => {
                    setMaxPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-6 pr-2 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0F766E]"
                />
              </div>
            </div>
          </div>

          {/* Condition (NONE checked by default per specifications) */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Condition
            </h4>
            <div className="space-y-2">
              {CONDITIONS.map(cond => (
                <label key={cond} className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-600 hover:text-slate-900 select-none">
                  <input
                    type="checkbox"
                    checked={selectedConditions.includes(cond)}
                    onChange={() => toggleCondition(cond)}
                    className="w-4 h-4 rounded text-[#0F766E] border-slate-300 focus:ring-[#0F766E]/20"
                  />
                  <span>{cond}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Campus Location / Distance */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Campus Location
            </h4>
            <div className="space-y-2">
              {[
                { id: '1mi', label: 'Within 1 mile' },
                { id: '5mi', label: 'Within 5 miles' },
                { id: 'all', label: 'All Locations' },
              ].map(opt => (
                <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-600 hover:text-slate-900 select-none">
                  <input
                    type="radio"
                    name="distance"
                    checked={distanceFilter === opt.id}
                    onChange={() => {
                      setDistanceFilter(opt.id as any);
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
                { id: 'all', label: 'All Sellers' },
                { id: 'student', label: 'Student Only' },
                { id: 'startup', label: 'Student Startup' },
              ].map(st => (
                <label key={st.id} className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-600 hover:text-slate-900 select-none">
                  <input
                    type="radio"
                    name="sellerType"
                    checked={sellerTypeFilter === st.id}
                    onChange={() => {
                      setSellerTypeFilter(st.id as any);
                      setCurrentPage(1);
                    }}
                    className="w-4 h-4 text-[#0F766E] border-slate-300 focus:ring-[#0F766E]/20"
                  />
                  <span>{st.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Area: Sort Row + 3-Column Card Grid */}
        <main className="lg:col-span-3 space-y-6">
          {/* Top Bar: Result count & Sort */}
          <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-4 py-3">
            <span className="text-xs font-semibold text-slate-600">
              Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> results
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => {
                  setSortBy(e.target.value as SortOption);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs font-semibold text-slate-800 border-none outline-none focus:ring-0 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="nearest">Nearest</option>
              </select>
            </div>
          </div>

          {/* 3-Column Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0F766E] flex items-center justify-center mx-auto">
                <PackageOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">No products match your filters</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try clearing your search filters or selecting another category.
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
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
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
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                &gt;
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto lg:hidden">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative min-h-screen flex flex-col justify-end">
            <div className="bg-white rounded-t-2xl p-6 space-y-6 max-h-[85vh] overflow-y-auto animate-slide-up">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-slate-900">Filters</h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Price */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-700 mb-2">Price Range</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min ($)"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max ($)"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Condition */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-700 mb-2">Condition</h4>
                <div className="space-y-2">
                  {CONDITIONS.map(cond => (
                    <label key={cond} className="flex items-center gap-2.5 text-xs text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedConditions.includes(cond)}
                        onChange={() => toggleCondition(cond)}
                        className="w-4 h-4 text-[#0F766E] rounded"
                      />
                      <span>{cond}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Distance */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-700 mb-2">Campus Distance</h4>
                <div className="space-y-2">
                  {[
                    { id: '1mi', label: 'Within 1 mile' },
                    { id: '5mi', label: 'Within 5 miles' },
                    { id: 'all', label: 'All Locations' },
                  ].map(opt => (
                    <label key={opt.id} className="flex items-center gap-2.5 text-xs text-slate-700">
                      <input
                        type="radio"
                        name="mobDistance"
                        checked={distanceFilter === opt.id}
                        onChange={() => setDistanceFilter(opt.id as any)}
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
