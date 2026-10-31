import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Briefcase, Building2, FileText } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import ServiceCard from '@/components/ServiceCard';
import StartupCard from '@/components/StartupCard';
import PostCard from '@/components/PostCard';

type Tab = 'all' | 'services' | 'startups' | 'posts';

export default function SearchPage() {
  const { services, startups, posts } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(query);
  const [tab, setTab] = useState<Tab>('all');

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const results = (() => {
    const q = query.toLowerCase();
    if (!q) return { services: [], startups: [], posts: [] };

    const matchedServices = services.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      (s.startupName && s.startupName.toLowerCase().includes(q))
    );

    const matchedStartups = startups.filter(st =>
      st.name.toLowerCase().includes(q) ||
      st.tagline.toLowerCase().includes(q) ||
      st.description.toLowerCase().includes(q) ||
      st.category.toLowerCase().includes(q) ||
      st.college.toLowerCase().includes(q)
    );

    const matchedPosts = posts.filter(p =>
      p.caption.toLowerCase().includes(q) ||
      p.authorName.toLowerCase().includes(q)
    );

    return { services: matchedServices, startups: matchedStartups, posts: matchedPosts };
  })();

  const totalResults = results.services.length + results.startups.length + results.posts.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchParams({ q: inputValue.trim() });
    }
  };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: totalResults },
    { key: 'services', label: 'Startup Services', count: results.services.length },
    { key: 'startups', label: 'Campus Startups', count: results.startups.length },
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
            placeholder="Search startup services, campus ventures, posts..."
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
              <p className="text-sm text-ink-400 mb-5">Try different keywords like "Development", "Design", or "Photography".</p>
              <Link to="/services" className="inline-flex items-center px-4 py-2.5 bg-[#0F766E] text-white rounded-xl text-sm font-semibold">
                Browse all startup services
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Services */}
              {(tab === 'all' || tab === 'services') && results.services.length > 0 && (
                <div>
                  <h2 className="font-bold text-lg text-ink-800 mb-4 flex items-center gap-2">
                    <Briefcase size={20} className="text-[#0F766E]" /> Startup Services
                    {tab === 'all' && <span className="text-sm text-ink-400 font-normal">({results.services.length})</span>}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {(tab === 'services' ? results.services : results.services.slice(0, 3)).map(s => (
                      <ServiceCard key={s.id} service={s} />
                    ))}
                  </div>
                  {tab === 'all' && results.services.length > 3 && (
                    <button onClick={() => setTab('services')} className="mt-3 text-sm font-semibold text-[#0F766E]">
                      View all {results.services.length} services →
                    </button>
                  )}
                </div>
              )}

              {/* Startups */}
              {(tab === 'all' || tab === 'startups') && results.startups.length > 0 && (
                <div>
                  <h2 className="font-bold text-lg text-ink-800 mb-4 flex items-center gap-2">
                    <Building2 size={20} className="text-[#0F766E]" /> Campus Startups
                    {tab === 'all' && <span className="text-sm text-ink-400 font-normal">({results.startups.length})</span>}
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {(tab === 'startups' ? results.startups : results.startups.slice(0, 3)).map(st => (
                      <StartupCard key={st.id} startup={st} />
                    ))}
                  </div>
                  {tab === 'all' && results.startups.length > 3 && (
                    <button onClick={() => setTab('startups')} className="mt-3 text-sm font-semibold text-[#0F766E]">
                      View all {results.startups.length} startups →
                    </button>
                  )}
                </div>
              )}

              {/* Posts */}
              {(tab === 'all' || tab === 'posts') && results.posts.length > 0 && (
                <div>
                  <h2 className="font-bold text-lg text-ink-800 mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-[#0F766E]" /> Community Posts
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
          <p className="text-sm text-ink-400">Find startup services, student founders, and community posts.</p>
          <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-md mx-auto">
            {['development', 'design', 'pitch deck', 'photography', 'marketing', 'tutoring'].map(s => (
              <button
                key={s}
                onClick={() => { setInputValue(s); setSearchParams({ q: s }); }}
                className="px-3 py-1.5 bg-white border border-ink-200 rounded-full text-sm text-ink-600 hover:border-[#0F766E] hover:text-[#0F766E] transition-colors"
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
