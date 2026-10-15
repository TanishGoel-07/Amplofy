import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Package, Users, FileText, Filter } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CATEGORIES } from '@/data/types';
import type { User } from '@/data/types';
import ProductCard from '@/components/ProductCard';
import UserCard from '@/components/UserCard';
import PostCard from '@/components/PostCard';
import VerifiedBadge from '@/components/VerifiedBadge';

type Tab = 'all' | 'products' | 'sellers' | 'posts';

export default function SearchPage() {
  const { products, posts, searchProfiles } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(query);
  const [tab, setTab] = useState<Tab>('all');
  const [matchedSellers, setMatchedSellers] = useState<User[]>([]);

  useEffect(() => {
    if (query) {
      searchProfiles(query).then(setMatchedSellers);
    } else {
      setMatchedSellers([]);
    }
  }, [query, searchProfiles]);

  const results = (() => {
    const q = query.toLowerCase();
    if (!q) return { products: [] as typeof products, sellers: [] as User[], posts: [] as typeof posts };

    const matchedProducts = products.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some(t => t.includes(q))
    );

    const matchedPosts = posts.filter(p =>
      p.caption.toLowerCase().includes(q) ||
      p.authorName.toLowerCase().includes(q)
    );

    const matchedCategories = CATEGORIES.filter(c => c.name.toLowerCase().includes(q));
    if (matchedCategories.length > 0) {
      const catNames = matchedCategories.map(c => c.name.toLowerCase());
      matchedProducts.push(...products.filter(p => catNames.includes(p.category.toLowerCase()) && !matchedProducts.includes(p)));
    }

    return { products: matchedProducts, sellers: matchedSellers, posts: matchedPosts };
  })();

  const totalResults = results.products.length + results.sellers.length + results.posts.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim() });
    }
  };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: totalResults },
    { key: 'products', label: 'Products', count: results.products.length },
    { key: 'sellers', label: 'Sellers', count: results.sellers.length },
    { key: 'posts', label: 'Posts', count: results.posts.length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Search products, sellers, posts..."
            className="w-full bg-white border border-ink-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all shadow-soft"
            autoFocus
          />
        </div>
      </form>

      {query && (
        <>
          <p className="text-sm text-ink-500 mb-4">
            <span className="font-semibold text-ink-800">{totalResults}</span> results for "<span className="font-semibold text-ink-700">{query}</span>"
          </p>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-ink-200 mb-6 overflow-x-auto no-scrollbar">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${tab === t.key ? 'border-brand-600 text-brand-700' : 'border-transparent text-ink-500 hover:text-ink-700'}`}
              >
                {t.label} {t.count > 0 && <span className="text-xs text-ink-400">({t.count})</span>}
              </button>
            ))}
          </div>

          {/* Results */}
          {totalResults === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-ink-100">
              <SearchIcon size={36} className="text-ink-300 mx-auto mb-4" />
              <h3 className="font-bold text-ink-700 mb-2">No results found</h3>
              <p className="text-sm text-ink-400 mb-5">Try different keywords or check spelling.</p>
              <Link to="/explore" className="inline-flex items-center px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold">
                Browse all products
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Products */}
              {(tab === 'all' || tab === 'products') && results.products.length > 0 && (
                <div>
                  <h2 className="font-bold text-lg text-ink-800 mb-4 flex items-center gap-2">
                    <Package size={20} className="text-brand-600" /> Products
                    {tab === 'all' && <span className="text-sm text-ink-400 font-normal">({results.products.length})</span>}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                    {(tab === 'products' ? results.products : results.products.slice(0, 4)).map(p => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                  {tab === 'all' && results.products.length > 4 && (
                    <button onClick={() => setTab('products')} className="mt-3 text-sm font-semibold text-brand-600">View all {results.products.length} products →</button>
                  )}
                </div>
              )}

              {/* Sellers */}
              {(tab === 'all' || tab === 'sellers') && results.sellers.length > 0 && (
                <div>
                  <h2 className="font-bold text-lg text-ink-800 mb-4 flex items-center gap-2">
                    <Users size={20} className="text-brand-600" /> Sellers
                    {tab === 'all' && <span className="text-sm text-ink-400 font-normal">({results.sellers.length})</span>}
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(tab === 'sellers' ? results.sellers : results.sellers.slice(0, 3)).map(u => (
                      <UserCard key={u.id} user={u} />
                    ))}
                  </div>
                  {tab === 'all' && results.sellers.length > 3 && (
                    <button onClick={() => setTab('sellers')} className="mt-3 text-sm font-semibold text-brand-600">View all sellers →</button>
                  )}
                </div>
              )}

              {/* Posts */}
              {(tab === 'all' || tab === 'posts') && results.posts.length > 0 && (
                <div>
                  <h2 className="font-bold text-lg text-ink-800 mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-brand-600" /> Posts
                    {tab === 'all' && <span className="text-sm text-ink-400 font-normal">({results.posts.length})</span>}
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {(tab === 'posts' ? results.posts : results.posts.slice(0, 3)).map(p => (
                      <PostCard key={p.id} post={p} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {!query && (
        <div className="text-center py-20">
          <SearchIcon size={40} className="text-ink-300 mx-auto mb-4" />
          <h3 className="font-bold text-ink-700 mb-2">Search AMPLOFY</h3>
          <p className="text-sm text-ink-400">Find products, sellers, and posts from the student community.</p>
          <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-md mx-auto">
            {['bracelet', 'books', 'handmade', 'digital', 'photography', 'tote'].map(s => (
              <button
                key={s}
                onClick={() => { setInputValue(s); setSearchParams({ q: s }); }}
                className="px-3 py-1.5 bg-white border border-ink-200 rounded-full text-sm text-ink-600 hover:border-brand-300 hover:text-brand-600 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
