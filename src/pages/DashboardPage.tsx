import { Link } from 'react-router-dom';
import {
  Package, Eye, Heart, MessageCircle, TrendingUp,
  FileText, PlusCircle, BarChart3, Rocket, Star,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function DashboardPage() {
  const { currentUser, products, conversations, updateProductTransactionStatus } = useApp();

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-ink-500 mb-4">Please sign in to access your dashboard.</p>
        <Link to="/signin" className="text-brand-600 font-semibold">Sign In</Link>
      </div>
    );
  }

  const myProducts = products.filter(p => p.sellerId === currentUser.id);
  const myMessages = conversations.filter(c => c.participantId === currentUser.id);

  const totalViews = myProducts.reduce((sum, p) => sum + p.views, 0);
  const totalFavourites = myProducts.reduce((sum, p) => sum + p.favourites, 0);

  const stats = [
    { label: 'Active Listings', value: myProducts.length, icon: Package, color: 'bg-brand-500' },
    { label: 'Total Views', value: totalViews, icon: Eye, color: 'bg-sky-500' },
    { label: 'Favourites', value: totalFavourites, icon: Heart, color: 'bg-rose-500' },
    { label: 'Messages', value: myMessages.length, icon: MessageCircle, color: 'bg-accent-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900">Seller Dashboard</h1>
          <p className="text-ink-500 mt-1">Track your listings, views, and performance.</p>
        </div>
        <Link
          to="/sell"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors"
        >
          <PlusCircle size={18} /> New Listing
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 sm:p-5 shadow-soft border border-ink-100">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
              <s.icon size={20} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-ink-900">{s.value}</p>
            <p className="text-sm text-ink-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-brand-50 to-accent-50/30 rounded-2xl p-5 sm:p-6 mb-8 border border-brand-100">
        <div className="flex items-center gap-2 mb-4">
          <Rocket size={20} className="text-brand-600" />
          <h2 className="font-bold text-ink-800">Grow Your Store</h2>
          <span className="text-xs text-ink-400 bg-white px-2 py-0.5 rounded-full">Coming Soon</span>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { title: 'Boost Listing', desc: 'Promote your listing to more students', icon: TrendingUp },
            { title: 'Featured Seller', desc: 'Get featured on the homepage', icon: Star },
            { title: 'Premium Store', desc: 'Unlock analytics and custom branding', icon: BarChart3 },
          ].map(f => (
            <div key={f.title} className="bg-white/70 rounded-xl p-4 border border-brand-100/50 opacity-80">
              <f.icon size={20} className="text-brand-500 mb-2" />
              <h3 className="font-semibold text-sm text-ink-700 mb-1">{f.title}</h3>
              <p className="text-xs text-ink-500">{f.desc}</p>
              <button disabled className="mt-3 w-full py-1.5 bg-ink-100 text-ink-400 text-xs font-semibold rounded-lg cursor-not-allowed">
                Coming Soon
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-xl text-ink-800">My Listings</h2>
          <Link to="/profile" className="text-sm font-semibold text-brand-600 hover:text-brand-700">View store →</Link>
        </div>
        {myProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {myProducts.map(p => (
              <div key={p.id} className="bg-white rounded-2xl shadow-soft border border-ink-100 overflow-hidden">
                <div className="aspect-square bg-ink-100 overflow-hidden">
                  {p.images[0] && <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-ink-800 truncate">{p.title}</h3>
                  <p className="text-xs text-ink-400 mt-0.5">{p.listingStatus}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-ink-900">₹{p.price}</span>
                    <select
                      value={p.transactionStatus}
                      onChange={(e) => updateProductTransactionStatus(p.id, e.target.value as any)}
                      className="text-xs border border-ink-200 rounded-lg px-2 py-1 outline-none"
                    >
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="sold">Sold</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-ink-100 p-12 text-center">
            <Package size={32} className="text-ink-300 mx-auto mb-3" />
            <p className="text-ink-500 mb-4">No listings yet. Start by creating your first listing.</p>
            <Link to="/sell" className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold">
              <PlusCircle size={16} /> Create your first listing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
