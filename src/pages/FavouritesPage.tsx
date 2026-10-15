import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Package, Users, FileText, Bookmark } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { User } from '@/data/types';
import ProductCard from '@/components/ProductCard';
import UserCard from '@/components/UserCard';
import PostCard from '@/components/PostCard';

type Tab = 'products' | 'creators' | 'posts';

export default function FavouritesPage() {
  const { favouriteProducts, favouriteSellers, savedPosts, products, posts, fetchProfilesByIds } = useApp();
  const [tab, setTab] = useState<Tab>('products');
  const [favSellers, setFavSellers] = useState<User[]>([]);

  useEffect(() => {
    fetchProfilesByIds(favouriteSellers).then(setFavSellers);
  }, [favouriteSellers, fetchProfilesByIds]);

  const favProducts = products.filter(p => favouriteProducts.includes(p.id));
  const favPosts = posts.filter(p => savedPosts.includes(p.id));

  const tabs: { key: Tab; label: string; icon: typeof Package; count: number }[] = [
    { key: 'products', label: 'Products', icon: Package, count: favProducts.length },
    { key: 'creators', label: 'Creators', icon: Users, count: favSellers.length },
    { key: 'posts', label: 'Posts', icon: FileText, count: favPosts.length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Heart size={24} className="text-error-500" fill="currentColor" />
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-900">Favourites</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-ink-200 mb-6">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${tab === t.key ? 'border-brand-600 text-brand-700' : 'border-transparent text-ink-500 hover:text-ink-700'}`}
          >
            <t.icon size={16} />
            {t.label}
            {t.count > 0 && <span className="text-xs text-ink-400">({t.count})</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'products' && (
        favProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {favProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <EmptyState icon={Package} title="No favourite products yet" desc="Tap the heart icon on any product to save it here." ctaTo="/explore" ctaLabel="Explore Products" />
        )
      )}

      {tab === 'creators' && (
        favSellers.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favSellers.map(u => <UserCard key={u.id} user={u} />)}
          </div>
        ) : (
          <EmptyState icon={Users} title="No favourite creators yet" desc="Save creators you love to find them quickly here." ctaTo="/community" ctaLabel="Discover Creators" />
        )
      )}

      {tab === 'posts' && (
        favPosts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favPosts.map(p => <PostCard key={p.id} post={p} />)}
          </div>
        ) : (
          <EmptyState icon={Bookmark} title="No saved posts yet" desc="Bookmark posts from the community to find them here." ctaTo="/community" ctaLabel="Browse Community" />
        )
      )}
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc, ctaTo, ctaLabel }: { icon: typeof Package; title: string; desc: string; ctaTo: string; ctaLabel: string }) {
  return (
    <div className="text-center py-20 bg-white rounded-2xl border border-ink-100">
      <Icon size={36} className="text-ink-300 mx-auto mb-4" />
      <h3 className="font-bold text-ink-700 mb-2">{title}</h3>
      <p className="text-sm text-ink-400 mb-5">{desc}</p>
      <Link to={ctaTo} className="inline-flex items-center px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors">
        {ctaLabel}
      </Link>
    </div>
  );
}
