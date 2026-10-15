import { useState } from 'react';
import {
  Users, BadgeCheck, Store, Package, Flag, ShieldAlert, Clock,
  Check, X, Ban, TrendingUp, Search as SearchIcon,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

type Section = 'overview' | 'listings' | 'reports' | 'verification';

export default function AdminPage() {
  const { products, wantedRequests, offers } = useApp();
  const [section, setSection] = useState<Section>('overview');

  const pendingListings = products.filter(p => p.listingStatus === 'pending-review').length;
  const activeListings = products.filter(p => p.listingStatus === 'published').length;
  const pendingOffers = offers.filter(o => o.status === 'pending').length;

  const stats = [
    { label: 'Total Listings', value: products.length, icon: Package, color: 'bg-brand-500' },
    { label: 'Pending Review', value: pendingListings, icon: Clock, color: 'bg-amber-500' },
    { label: 'Published', value: activeListings, icon: Store, color: 'bg-emerald-500' },
    { label: 'Wanted Requests', value: wantedRequests.length, icon: SearchIcon, color: 'bg-sky-500' },
    { label: 'Pending Offers', value: pendingOffers, icon: TrendingUp, color: 'bg-accent-500' },
  ];

  const navItems: { key: Section; label: string; icon: typeof Users }[] = [
    { key: 'overview', label: 'Overview', icon: TrendingUp },
    { key: 'listings', label: 'Listings', icon: Package },
    { key: 'reports', label: 'Reports', icon: Flag },
    { key: 'verification', label: 'Verification', icon: BadgeCheck },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-ink-800 flex items-center justify-center">
          <ShieldAlert size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900">Admin Dashboard</h1>
          <p className="text-ink-500 text-sm">Moderate and manage the AMPLOFY platform.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[200px_1fr] gap-6">
        <aside>
          <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-2 lg:sticky top-20">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => setSection(item.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${section === item.key ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-50'}`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        <div>
          {section === 'overview' && (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {stats.map(s => (
                  <div key={s.label} className="bg-white rounded-2xl p-4 shadow-soft border border-ink-100">
                    <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center mb-2.5`}>
                      <s.icon size={18} className="text-white" />
                    </div>
                    <p className="text-xl font-bold text-ink-900">{s.value}</p>
                    <p className="text-xs text-ink-500">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-white rounded-2xl shadow-soft border border-ink-100 p-5">
                <h3 className="font-bold text-ink-800 mb-4">Pending Listings for Review</h3>
                {products.filter(p => p.listingStatus === 'pending-review').length > 0 ? (
                  <div className="space-y-2">
                    {products.filter(p => p.listingStatus === 'pending-review').map(p => (
                      <div key={p.id} className="flex items-center gap-3 p-3 bg-ink-50 rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                          <Package size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-ink-700 truncate">{p.title}</p>
                          <p className="text-xs text-ink-400 truncate">{p.category} · ₹{p.price}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100">
                            <Check size={16} />
                          </button>
                          <button className="w-8 h-8 rounded-lg bg-error-50 text-error-600 flex items-center justify-center hover:bg-error-100">
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-ink-400 text-center py-6">No listings pending review.</p>
                )}
              </div>
            </div>
          )}

          {section === 'listings' && (
            <div className="bg-white rounded-2xl shadow-soft border border-ink-100 overflow-hidden">
              {products.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-ink-50 text-ink-500 text-xs uppercase">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold">Product</th>
                        <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Seller</th>
                        <th className="text-left px-4 py-3 font-semibold">Price</th>
                        <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Status</th>
                        <th className="text-right px-4 py-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-50">
                      {products.map(p => (
                        <tr key={p.id} className="hover:bg-ink-50/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {p.images[0] ? <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-ink-100" />}
                              <span className="font-medium text-ink-800 truncate max-w-[180px]">{p.title}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-ink-600 hidden sm:table-cell">{p.sellerName || '—'}</td>
                          <td className="px-4 py-3 font-semibold text-ink-700">₹{p.price}</td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <span className="text-xs font-semibold px-2 py-0.5 bg-ink-100 text-ink-600 rounded-full">{p.listingStatus}</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button className="text-xs text-amber-600 font-medium hover:underline mr-3">Hide</button>
                            <button className="text-xs text-error-500 font-medium hover:underline">Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package size={32} className="text-ink-300 mx-auto mb-3" />
                  <p className="text-sm text-ink-400">No listings yet.</p>
                </div>
              )}
            </div>
          )}

          {section === 'reports' && (
            <div className="text-center py-12 bg-white rounded-2xl border border-ink-100">
              <Flag size={32} className="text-ink-300 mx-auto mb-3" />
              <p className="text-sm text-ink-400">No reports submitted yet.</p>
              <p className="text-xs text-ink-400 mt-1">Reports from users will appear here for review.</p>
            </div>
          )}

          {section === 'verification' && (
            <div className="text-center py-12 bg-white rounded-2xl border border-ink-100">
              <BadgeCheck size={32} className="text-ink-300 mx-auto mb-3" />
              <p className="text-sm text-ink-400">No verification submissions yet.</p>
              <p className="text-xs text-ink-400 mt-1">Student verification requests will appear here for review.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
