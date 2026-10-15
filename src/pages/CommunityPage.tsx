import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Sparkles, TrendingUp } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { User } from '@/data/types';
import PostCard from '@/components/PostCard';
import UserCard from '@/components/UserCard';

type Filter = 'all' | 'product' | 'launch' | 'behind-the-scenes' | 'promotion' | 'achievement' | 'update';

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All Posts' },
  { value: 'product', label: 'Products' },
  { value: 'launch', label: 'Launches' },
  { value: 'behind-the-scenes', label: 'Behind the Scenes' },
  { value: 'promotion', label: 'Promotions' },
  { value: 'achievement', label: 'Achievements' },
];

export default function CommunityPage() {
  const { posts, fetchCreators } = useApp();
  const [filter, setFilter] = useState<Filter>('all');
  const [showCreators, setShowCreators] = useState(false);
  const [creators, setCreators] = useState<User[]>([]);

  useEffect(() => {
    fetchCreators(6).then(setCreators);
  }, [fetchCreators]);

  const filteredPosts = filter === 'all' ? posts : posts.filter(p => p.type === filter);
  const topCreators = creators;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 mb-1">Community</h1>
        <p className="text-ink-500">See what student creators are making, sharing, and building.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        {/* Feed */}
        <div>
          {/* Filter tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-5 pb-1">
            {filters.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${filter === f.value ? 'bg-brand-600 text-white' : 'bg-white text-ink-600 border border-ink-200 hover:border-brand-300'}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Posts */}
          <div className="grid sm:grid-cols-2 gap-5">
            {filteredPosts.map(p => <PostCard key={p.id} post={p} />)}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-ink-100">
              <Sparkles size={32} className="text-ink-300 mx-auto mb-3" />
              <p className="text-ink-500">No posts in this category yet.</p>
            </div>
          )}
        </div>

        {/* Sidebar - Discover Creators */}
        <aside className="hidden lg:block">
          <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-5 sticky top-20">
            <div className="flex items-center gap-2 mb-4">
              <Users size={20} className="text-brand-600" />
              <h3 className="font-bold text-ink-800">Discover Creators</h3>
            </div>
            <div className="space-y-3">
              {topCreators.slice(0, 5).map(u => (
                <Link
                  key={u.id}
                  to={`/profile/${u.id}`}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-ink-50 transition-colors group"
                >
                  <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink-800 truncate group-hover:text-brand-700">{u.name}</p>
                    <p className="text-xs text-ink-400 truncate">{u.bio}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              to="/explore"
              className="block mt-4 w-full py-2.5 text-center bg-brand-50 text-brand-700 rounded-xl text-sm font-semibold hover:bg-brand-100 transition-colors"
            >
              Explore all creators
            </Link>
          </div>
        </aside>
      </div>

      {/* Mobile discover creators */}
      <div className="mt-8 lg:hidden">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-brand-600" />
          <h3 className="font-bold text-ink-800">Discover Creators</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {topCreators.map(u => (
            <Link
              key={u.id}
              to={`/profile/${u.id}`}
              className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl border border-ink-100 min-w-[120px] shrink-0"
            >
              <img src={u.avatar} alt={u.name} className="w-14 h-14 rounded-xl object-cover" />
              <p className="text-xs font-semibold text-ink-800 text-center truncate w-full">{u.name}</p>
              <p className="text-[10px] text-ink-400">{u.followers} followers</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
