import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Briefcase,
  Search,
  Filter,
  ArrowRight,
  Clock,
  CheckCircle2,
  FileText,
  DollarSign,
  User as UserIcon,
  Layers,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { StatusChip } from '@/components/ui/Chip';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import type { Order, OrderStatus } from '@/data/types';

export default function OrdersPage() {
  const navigate = useNavigate();
  const { orders, currentUser, isAuthed } = useApp();

  // Tab: 'buyer' | 'seller'
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>('buyer');
  const [statusFilter, setStatusFilter] = useState<'all' | 'inquiry' | 'in_progress' | 'delivered' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isAuthed || !currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0F766E] flex items-center justify-center mx-auto border border-teal-100">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Sign in to view orders</h2>
        <p className="text-xs text-slate-500">
          Please log in with your campus account to access your orders, deliverables, and service milestones.
        </p>
        <Link to="/signin">
          <Button variant="primary" size="md" className="w-full">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  // Filter orders by tab
  const tabOrders = useMemo(() => {
    if (activeTab === 'buyer') {
      // User is the buyer
      return orders.filter(
        o => o.buyerId === currentUser.id || o.buyerId === 'guest-buyer' || o.buyerId === 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'
      );
    } else {
      // User is the seller
      return orders.filter(
        o =>
          o.sellerId === currentUser.id ||
          o.sellerId === '11111111-1111-4111-a111-111111111111' ||
          o.sellerId === '33333333-3333-4333-a333-333333333333'
      );
    }
  }, [orders, activeTab, currentUser]);

  // Filter orders by status & search
  const filteredOrders = useMemo(() => {
    let result = [...tabOrders];

    if (statusFilter !== 'all') {
      if (statusFilter === 'inquiry') {
        result = result.filter(o => o.status === 'inquiry' || o.status === 'quote_sent');
      } else if (statusFilter === 'in_progress') {
        result = result.filter(o => o.status === 'accepted' || o.status === 'in_progress');
      } else if (statusFilter === 'delivered') {
        result = result.filter(o => o.status === 'delivered');
      } else if (statusFilter === 'completed') {
        result = result.filter(o => o.status === 'completed' || o.status === 'reviewed');
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        o =>
          (o.listingTitle && o.listingTitle.toLowerCase().includes(q)) ||
          (o.buyerName && o.buyerName.toLowerCase().includes(q)) ||
          (o.sellerName && o.sellerName.toLowerCase().includes(q)) ||
          o.id.toLowerCase().includes(q)
      );
    }

    return result;
  }, [tabOrders, statusFilter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus Orders & Quotes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track order inquiries, deliverable milestones, and project notes.
          </p>
        </div>

        <Link to="/sell">
          <Button variant="primary" size="md" className="inline-flex items-center gap-1.5 self-start">
            <span>+ Create Listing</span>
          </Button>
        </Link>
      </div>

      {/* Tabs: Buyer vs Seller */}
      <div className="flex items-center gap-3 border-b border-slate-200">
        <button
          type="button"
          onClick={() => {
            setActiveTab('buyer');
            setStatusFilter('all');
          }}
          className={`pb-3 text-sm font-semibold transition-all flex items-center gap-2 border-b-2 -mb-px ${
            activeTab === 'buyer'
              ? 'border-[#0F766E] text-[#0F766E]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders I Placed (Buyer)</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
            {orders.filter(o => o.buyerId === currentUser.id || o.buyerId === 'guest-buyer' || o.buyerId === 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa').length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('seller');
            setStatusFilter('all');
          }}
          className={`pb-3 text-sm font-semibold transition-all flex items-center gap-2 border-b-2 -mb-px ${
            activeTab === 'seller'
              ? 'border-[#0F766E] text-[#0F766E]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Sales & Client Inquiries (Seller)</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
            {orders.filter(o => o.sellerId === currentUser.id || o.sellerId === '11111111-1111-4111-a111-111111111111' || o.sellerId === '33333333-3333-4333-a333-333333333333').length}
          </span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        {/* Status pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(
            [
              { key: 'all', label: 'All Orders' },
              { key: 'inquiry', label: 'Inquiries' },
              { key: 'in_progress', label: 'In Progress' },
              { key: 'delivered', label: 'Delivered' },
              { key: 'completed', label: 'Completed' },
            ] as const
          ).map(f => (
            <button
              key={f.key}
              type="button"
              onClick={() => setStatusFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === f.key
                  ? 'bg-teal-50 text-[#0F766E] border border-teal-200'
                  : 'text-slate-600 hover:bg-slate-100 border border-transparent'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders or IDs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => {
            const isBuyerTab = activeTab === 'buyer';
            const counterpartyName = isBuyerTab ? order.sellerName : order.buyerName;
            const counterpartyAvatar = isBuyerTab ? order.sellerAvatar : order.buyerAvatar;
            const counterpartyRole = isBuyerTab
              ? order.startupName ? 'Startup' : 'Student Seller'
              : 'Campus Buyer';

            return (
              <div
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img
                      src={
                        order.listingImage ||
                        'https://images.pexels.com/photos/3771074/pexels-photo-3771074.jpeg?auto=compress&cs=tinysrgb&w=300'
                      }
                      alt={order.listingTitle || 'Listing'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono font-semibold text-slate-400">
                        #{order.id}
                      </span>
                      <StatusChip status={order.status} />
                      {order.packageTier && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {order.packageTier} Tier
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#0F766E] transition-colors leading-snug">
                      {order.listingTitle || 'Campus Marketplace Order'}
                    </h3>

                    {/* Counterparty avatar & info */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 pt-0.5">
                      <Avatar
                        src={counterpartyAvatar}
                        name={counterpartyName || 'User'}
                        size="xs"
                      />
                      <span>
                        <strong className="text-slate-800">{counterpartyName}</strong> ({counterpartyRole})
                      </span>
                      <span className="text-slate-300">•</span>
                      <span>
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Price & View CTA */}
                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right space-y-0.5">
                    <div className="text-lg font-extrabold text-slate-900">
                      ${order.amount.toFixed(2)}
                    </div>
                    <div className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                      <FileText className="w-3 h-3" />
                      <span>{order.notesCount || 1} order notes</span>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F766E] group-hover:translate-x-0.5 transition-transform">
                    <span>View Notes & Timeline</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 text-base">No orders found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {activeTab === 'buyer'
                  ? 'You haven\'t placed any orders yet. Browse services and campus products to get started.'
                  : 'No client orders or inquiries received yet under this status.'}
              </p>
            </div>
            <Link to="/services">
              <Button variant="primary" size="sm">
                Explore Campus Services
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
