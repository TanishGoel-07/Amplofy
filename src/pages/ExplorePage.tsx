import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Grid3x3 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/data/types';
import ProductCard from '@/components/ProductCard';

type SortOption = 'recommended' | 'newest' | 'price-low' | 'price-high' | 'popular';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

const locations = ['Delhi', 'Noida', 'Gurugram', 'Online'];
const conditions = ['New', 'Like New', 'Good', 'Fair', 'Digital', 'Pre-Owned'];
const listingTypes = [
  { value: 'product', label: 'Product' },
  { value: 'pre-owned', label: 'Pre-Owned Item' },
  { value: 'digital', label: 'Digital Product' },
  { value: 'service', label: 'Service' },
];

export default function ExplorePage() {
  const { products } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category') ? [searchParams.get('category')!] : []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedListingTypes, setSelectedListingTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('category');
    if (q) setSearchQuery(q);
    if (cat) setSelectedCategories([cat]);
  }, [searchParams]);

  const toggleArrayFilter = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const filtered = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sellerName.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (selectedLocations.length > 0) {
      result = result.filter(p => selectedLocations.includes(p.location));
    }

    if (selectedConditions.length > 0) {
      result = result.filter(p => selectedConditions.includes(p.condition));
    }

    if (selectedListingTypes.length > 0) {
      result = result.filter(p => selectedListingTypes.includes(p.listingType));
    }

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        result.sort((a, b) => b.views - a.views);
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [products, searchQuery, selectedCategories, priceRange, selectedLocations, selectedConditions, selectedListingTypes, sortBy]);

  const activeFilterCount =
    selectedCategories.length + selectedLocations.length + selectedConditions.length + selectedListingTypes.length +
    (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setSelectedLocations([]);
    setSelectedConditions([]);
    setSelectedListingTypes([]);
    setSearchQuery('');
    setSearchParams({});
  };

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="py-4 border-b border-ink-100 last:border-0">
      <h4 className="font-semibold text-sm text-ink-800 mb-3">{title}</h4>
      {children}
    </div>
  );

  const CheckboxItem = ({ label, checked, onChange, count }: { label: string; checked: boolean; onChange: () => void; count?: number }) => (
    <label className="flex items-center gap-2 py-1.5 cursor-pointer group">
      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${checked ? 'bg-brand-600 border-brand-600' : 'border-ink-300 group-hover:border-brand-400'}`}>
        {checked && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className="text-sm text-ink-600 flex-1">{label}</span>
      {count !== undefined && <span className="text-xs text-ink-400">{count}</span>}
    </label>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              if (e.target.value) setSearchParams({ q: e.target.value });
              else setSearchParams({});
            }}
            placeholder="What are you looking for? Search books, jewellery, clothes, art..."
            className="w-full bg-white border border-ink-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all shadow-soft"
          />
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters - desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-5 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-ink-800 flex items-center gap-2">
                <SlidersHorizontal size={18} /> Filters
              </h3>
              {activeFilterCount > 0 && (
                <button onClick={clearAllFilters} className="text-xs font-medium text-brand-600 hover:text-brand-700">
                  Clear all
                </button>
              )}
            </div>

            <FilterSection title="Category">
              <div className="space-y-0.5 max-h-48 overflow-y-auto">
                {CATEGORIES.map(cat => (
                  <CheckboxItem
                    key={cat.name}
                    label={cat.name}
                    count={cat.count}
                    checked={selectedCategories.includes(cat.name)}
                    onChange={() => toggleArrayFilter(cat.name, setSelectedCategories)}
                  />
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Price Range">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full bg-ink-50 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-brand-200"
                  placeholder="Min"
                />
                <span className="text-ink-400">—</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full bg-ink-50 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-brand-200"
                  placeholder="Max"
                />
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full accent-brand-600"
              />
              <p className="text-xs text-ink-400 mt-1">Up to ₹{priceRange[1]}</p>
            </FilterSection>

            <FilterSection title="Location">
              {locations.map(loc => (
                <CheckboxItem
                  key={loc}
                  label={loc}
                  checked={selectedLocations.includes(loc)}
                  onChange={() => toggleArrayFilter(loc, setSelectedLocations)}
                />
              ))}
            </FilterSection>

            <FilterSection title="Condition">
              {conditions.map(cond => (
                <CheckboxItem
                  key={cond}
                  label={cond}
                  checked={selectedConditions.includes(cond)}
                  onChange={() => toggleArrayFilter(cond, setSelectedConditions)}
                />
              ))}
            </FilterSection>

            <FilterSection title="Listing Type">
              {listingTypes.map(lt => (
                <CheckboxItem
                  key={lt.value}
                  label={lt.label}
                  checked={selectedListingTypes.includes(lt.value)}
                  onChange={() => toggleArrayFilter(lt.value, setSelectedListingTypes)}
                />
              ))}
            </FilterSection>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-ink-200 text-sm font-medium text-ink-700"
              >
                <SlidersHorizontal size={16} /> Filters
                {activeFilterCount > 0 && <span className="bg-brand-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{activeFilterCount}</span>}
              </button>
              <p className="text-sm text-ink-500">
                <span className="font-semibold text-ink-800">{filtered.length}</span> results
              </p>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-ink-200 text-sm font-medium text-ink-700 hover:border-brand-300 transition-colors"
              >
                Sort: {sortOptions.find(s => s.value === sortBy)?.label}
              </button>
              {showSort && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-float border border-ink-100 py-1 z-20 min-w-[180px]">
                  {sortOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setShowSort(false); }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-ink-50 transition-colors ${sortBy === opt.value ? 'text-brand-700 font-semibold' : 'text-ink-600'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {selectedCategories.map(c => (
                <span key={c} className="inline-flex items-center gap-1 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-full">
                  {c} <button onClick={() => toggleArrayFilter(c, setSelectedCategories)}><X size={12} /></button>
                </span>
              ))}
              {selectedLocations.map(l => (
                <span key={l} className="inline-flex items-center gap-1 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-full">
                  {l} <button onClick={() => toggleArrayFilter(l, setSelectedLocations)}><X size={12} /></button>
                </span>
              ))}
              {selectedListingTypes.map(lt => (
                <span key={lt} className="inline-flex items-center gap-1 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-full">
                  {listingTypes.find(l => l.value === lt)?.label} <button onClick={() => toggleArrayFilter(lt, setSelectedListingTypes)}><X size={12} /></button>
                </span>
              ))}
              <button onClick={clearAllFilters} className="text-xs text-ink-500 hover:text-error-500 font-medium">
                Clear all
              </button>
            </div>
          )}

          {/* Product grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto bg-ink-100 rounded-2xl flex items-center justify-center mb-4">
                <Grid3x3 size={28} className="text-ink-400" />
              </div>
              <h3 className="font-bold text-ink-800 mb-2">No products found</h3>
              <p className="text-sm text-ink-500 mb-4">Try adjusting your filters or search query.</p>
              <button onClick={clearAllFilters} className="px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
          <div className="relative bg-white w-80 max-w-[85%] h-full overflow-y-auto animate-fade-in ml-auto">
            <div className="sticky top-0 bg-white border-b border-ink-100 px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-ink-800">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="w-8 h-8 rounded-lg hover:bg-ink-50 flex items-center justify-center">
                <X size={20} />
              </button>
            </div>
            <div className="px-5">
              <FilterSection title="Category">
                <div className="space-y-0.5">
                  {CATEGORIES.map(cat => (
                    <CheckboxItem
                      key={cat.name}
                      label={cat.name}
                      count={cat.count}
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() => toggleArrayFilter(cat.name, setSelectedCategories)}
                    />
                  ))}
                </div>
              </FilterSection>
              <FilterSection title="Price Range">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-brand-600"
                />
                <p className="text-xs text-ink-400 mt-1">Up to ₹{priceRange[1]}</p>
              </FilterSection>
              <FilterSection title="Location">
                {locations.map(loc => (
                  <CheckboxItem key={loc} label={loc} checked={selectedLocations.includes(loc)} onChange={() => toggleArrayFilter(loc, setSelectedLocations)} />
                ))}
              </FilterSection>
              <FilterSection title="Condition">
                {conditions.map(cond => (
                  <CheckboxItem key={cond} label={cond} checked={selectedConditions.includes(cond)} onChange={() => toggleArrayFilter(cond, setSelectedConditions)} />
                ))}
              </FilterSection>
              <FilterSection title="Listing Type">
                {listingTypes.map(lt => (
                  <CheckboxItem key={lt.value} label={lt.label} checked={selectedListingTypes.includes(lt.value)} onChange={() => toggleArrayFilter(lt.value, setSelectedListingTypes)} />
                ))}
              </FilterSection>
              <div className="py-5 flex gap-2">
                <button onClick={clearAllFilters} className="flex-1 py-2.5 border border-ink-200 rounded-xl text-sm font-semibold text-ink-700">Clear</button>
                <button onClick={() => setShowFilters(false)} className="flex-1 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold">Apply</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
