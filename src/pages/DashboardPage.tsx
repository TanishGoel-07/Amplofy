import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  GraduationCap,
  Award,
  Users,
  BarChart3,
  Settings,
  DollarSign,
  Eye,
  Star,
  Clock,
  PlusCircle,
  Search,
  MoreVertical,
  Pause,
  Play,
  Trash2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Rocket,
  Edit,
  ArrowUpRight,
  Sparkles,
  Handshake,
  Mail,
  PhoneCall,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { StatusChip } from '@/components/ui/Chip';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { CreateLookingForModal } from '@/components/CreateLookingForModal';
import type { Listing } from '@/data/types';

// Area chart datasets for working 7 / 30 / 90 days selector
const EARNINGS_DATA = {
  '7': {
    label: 'Last 7 Days',
    total: '$1,380',
    change: '+14.2%',
    points: [120, 190, 80, 240, 160, 310, 280],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  '30': {
    label: 'Last 30 Days',
    total: '$2,670',
    change: '+22.5%',
    points: [450, 720, 610, 890],
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  },
  '90': {
    label: 'Last 90 Days',
    total: '$7,410',
    change: '+31.8%',
    points: [1850, 2420, 3140],
    labels: ['Aug', 'Sep', 'Oct'],
  },
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    currentUser,
    isAuthed,
    listings,
    orders,
    reviews,
    startups,
    lookingForRequests,
    lookingForResponses,
    updateLookingForRequest,
    deleteLookingForRequest,
    updateLookingForResponseStatus,
    updateListingStatus,
    deleteListing,
  } = useApp();

  // Active navigation view
  const [activeNav, setActiveNav] = useState<
    'overview' | 'listings' | 'orders' | 'community' | 'reviews' | 'team' | 'analytics' | 'looking-for' | 'my-collabs'
  >('overview');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Mode: Seller vs Buyer
  const [userMode, setUserMode] = useState<'seller' | 'buyer'>('seller');

  // Working Earnings chart range
  const [chartRange, setChartRange] = useState<'7' | '30' | '90'>('7');

  // Listing table search filter
  const [listingSearch, setListingSearch] = useState('');

  if (!isAuthed || !currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0F766E] flex items-center justify-center mx-auto border border-teal-100">
          <LayoutDashboard className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Sign in to access dashboard</h2>
        <p className="text-xs text-slate-500">
          Manage your campus listings, orders, client inquiries, and earnings in one place.
        </p>
        <Link to="/signin">
          <Button variant="primary" size="md" className="w-full">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }

  const isStartupAccount = currentUser.accountType === 'startup';

  // Filter user's listings
  const myListings = useMemo(() => {
    return listings.filter(
      l =>
        l.sellerId === currentUser.id ||
        l.sellerId === '11111111-1111-4111-a111-111111111111' ||
        l.sellerId === '33333333-3333-4333-a333-333333333333'
    );
  }, [listings, currentUser]);

  const filteredListings = useMemo(() => {
    if (!listingSearch.trim()) return myListings;
    const q = listingSearch.toLowerCase();
    return myListings.filter(
      l => l.title.toLowerCase().includes(q) || l.category.toLowerCase().includes(q)
    );
  }, [myListings, listingSearch]);

  // Total views and sales calculations
  const totalViews = myListings.reduce((sum, l) => sum + (l.views || 0), 0);
  const recentOrders = orders.slice(0, 4);

  // Response time: 18 min -> fast -> green color logic
  const responseMinutes = 18;
  const isFastResponse = responseMinutes <= 30; // lower = green, higher = red

  // Handler for toggle pause / live
  const handleTogglePause = async (listing: Listing) => {
    const newStatus = listing.status === 'paused' ? 'live' : 'paused';
    await updateListingStatus(listing.id, newStatus);
    toast.success(`Listing ${newStatus === 'paused' ? 'paused' : 'resumed and now live'}.`);
  };

  // Handler for delete
  const handleDelete = async (listingId: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      await deleteListing(listingId);
      toast.success('Listing removed.');
    }
  };

  // Render SVG Area Chart
  const chart = EARNINGS_DATA[chartRange];
  const maxVal = Math.max(...chart.points);
  const minVal = Math.min(...chart.points) * 0.7;
  const chartHeight = 160;
  const chartWidth = 500;

  const pointsCoordinates = chart.points.map((val, idx) => {
    const x = (idx / (chart.points.length - 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - ((val - minVal) / (maxVal - minVal || 1)) * (chartHeight - 40) - 20;
    return { x, y, val };
  });

  const pathD = pointsCoordinates.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${pointsCoordinates[pointsCoordinates.length - 1].x} ${chartHeight} L ${pointsCoordinates[0].x} ${chartHeight} Z`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ========================================================
            LEFT SIDEBAR (3 COLS)
           ======================================================== */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-5">
            {/* Mode Switcher Toggle at Top */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center justify-between text-xs font-semibold">
              <button
                type="button"
                onClick={() => setUserMode('seller')}
                className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
                  userMode === 'seller'
                    ? 'bg-white text-[#0F766E] shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Seller Mode
              </button>
              <button
                type="button"
                onClick={() => setUserMode('buyer')}
                className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
                  userMode === 'buyer'
                    ? 'bg-white text-[#0F766E] shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Buyer Mode
              </button>
            </div>

            {/* Navigation Menu Links */}
            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveNav('overview')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeNav === 'overview'
                    ? 'bg-teal-50 text-[#0F766E]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-[#0F766E]" />
                <span>Overview</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveNav('listings')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeNav === 'listings'
                    ? 'bg-teal-50 text-[#0F766E]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-slate-500" />
                  <span>My Listings</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {myListings.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveNav('orders')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeNav === 'orders'
                    ? 'bg-teal-50 text-[#0F766E]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4 text-slate-500" />
                  <span>Orders & Sales</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {orders.length}
                </span>
              </button>

              {/* COMMUNITY Section */}
              <div className="pt-3 pb-1 px-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Community
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActiveNav('community')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeNav === 'community'
                    ? 'bg-teal-50 text-[#0F766E]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-slate-500" />
                <span>Student Hub</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveNav('reviews')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeNav === 'reviews'
                    ? 'bg-teal-50 text-[#0F766E]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Award className="w-4 h-4 text-slate-500" />
                  <span>Reviews</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold">
                  ★ 4.9
                </span>
              </button>

              {/* STARTUP EXTRA TABS (Team & Analytics) */}
              {isStartupAccount && (
                <>
                  <div className="pt-3 pb-1 px-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                      Startup Venture
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveNav('team')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      activeNav === 'team'
                        ? 'bg-amber-50 text-amber-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Users className="w-4 h-4 text-amber-600" />
                    <span>Team Directory</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveNav('looking-for')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      activeNav === 'looking-for'
                        ? 'bg-purple-50 text-purple-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Handshake className="w-4 h-4 text-purple-600" />
                      <span>Looking For (Collabs)</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">
                      {lookingForRequests.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveNav('analytics')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      activeNav === 'analytics'
                        ? 'bg-amber-50 text-amber-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 text-amber-600" />
                    <span>Venture Analytics</span>
                  </button>
                </>
              )}

              {userMode === 'buyer' && (
                <button
                  type="button"
                  onClick={() => setActiveNav('my-collabs')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    activeNav === 'my-collabs'
                      ? 'bg-teal-50 text-[#0F766E] font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Handshake className="w-4 h-4 text-purple-600" />
                    <span>My Collab Pitches</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {lookingForResponses.filter(r => r.applicantId === currentUser.id).length}
                  </span>
                </button>
              )}
            </nav>

            {/* Pro Seller Upgrade Card at Bottom */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-teal-900 to-slate-900 text-white space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <Rocket className="w-3.5 h-3.5" />
                <span>Pro Campus Seller</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Zero fees for students. Verified badges on all campus services.
              </p>
              <div className="pt-1">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/20 text-white">
                  Active Member Tier
                </span>
              </div>
            </div>

            {/* User Mini Profile + Settings Gear Icon */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar
                  src={currentUser.avatar}
                  name={currentUser.name}
                  size="sm"
                />
                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-900 truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {currentUser.college || 'Campus Member'}
                  </div>
                </div>
              </div>

              <Link
                to="/settings"
                className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors shrink-0"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </aside>

        {/* ========================================================
            MAIN CONTENT AREA (9 COLS)
           ======================================================== */}
        <main className="lg:col-span-9 space-y-8">
          {/* Top Action Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight capitalize">
                {activeNav === 'overview' ? `${userMode === 'seller' ? 'Seller' : 'Buyer'} Dashboard` : activeNav.replace('_', ' ')}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Welcome back, {currentUser.name}. Track your performance and client transactions.
              </p>
            </div>

            <Link to="/sell">
              <Button variant="primary" size="md" className="inline-flex items-center gap-1.5 self-start">
                <PlusCircle className="w-4 h-4" />
                <span>+ Create Listing</span>
              </Button>
            </Link>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeNav === 'overview' && (
            <div className="space-y-8">
              {/* 4 STAT CARDS */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Total Earnings */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Total Earnings</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">$1,240.00</div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>+18.4% this month</span>
                  </div>
                </div>

                {/* 2. Listing Views */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Listing Views</span>
                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">{totalViews || 1842}</div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-600">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>+12.6% this week</span>
                  </div>
                </div>

                {/* 3. Avg Rating */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Avg Rating</span>
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Star className="w-4 h-4 fill-amber-500" />
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">4.9</div>
                  <div className="text-[11px] font-semibold text-amber-700">
                    From 48 campus reviews
                  </div>
                </div>

                {/* 4. Response Time (CRITICAL COLOR LOGIC: lower = green, higher = red) */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Response Time</span>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isFastResponse ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div
                    className={`text-2xl font-extrabold ${
                      isFastResponse ? 'text-emerald-700' : 'text-red-600'
                    }`}
                  >
                    {responseMinutes} min
                  </div>
                  <div
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                      isFastResponse ? 'text-emerald-600' : 'text-red-500'
                    }`}
                  >
                    <span>{isFastResponse ? '● Fast response (Top 5%)' : '▲ Higher than average'}</span>
                  </div>
                </div>
              </div>

              {/* EARNINGS AREA CHART WITH WORKING RANGE SELECTOR */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Revenue Trends
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <h3 className="text-2xl font-extrabold text-slate-900">{chart.total}</h3>
                      <span className="text-xs font-bold text-emerald-600">{chart.change}</span>
                    </div>
                  </div>

                  {/* Range Selector: 7 / 30 / 90 days */}
                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
                    {(['7', '30', '90'] as const).map(range => (
                      <button
                        key={range}
                        type="button"
                        onClick={() => setChartRange(range)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          chartRange === range
                            ? 'bg-white text-[#0F766E] shadow-2xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {range} Days
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Area Chart Graphic */}
                <div className="w-full pt-4 overflow-hidden">
                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full h-44 overflow-visible"
                  >
                    <defs>
                      <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0F766E" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#0F766E" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Gradient fill */}
                    <path d={areaD} fill="url(#earningsGradient)" />

                    {/* Line stroke */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#0F766E"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* Data Points */}
                    {pointsCoordinates.map((pt, idx) => (
                      <g key={idx} className="group cursor-pointer">
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="5"
                          className="fill-[#0F766E] stroke-white stroke-2 group-hover:r-7 transition-all"
                        />
                      </g>
                    ))}
                  </svg>

                  {/* Matching X-Axis Labels */}
                  <div className="flex items-center justify-between text-xs font-medium text-slate-400 px-2 pt-2 border-t border-slate-100">
                    {chart.labels.map(lbl => (
                      <span key={lbl}>{lbl}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* RECENT ORDERS & INQUIRIES CARD (NO MESSAGES) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Recent Orders & Inquiries
                    </h3>
                    <p className="text-xs text-slate-500">
                      Active client milestone inquiries and orders awaiting delivery.
                    </p>
                  </div>

                  <Link to="/orders">
                    <Button variant="secondary" size="sm" className="inline-flex items-center gap-1">
                      <span>See all orders</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>

                <div className="divide-y divide-slate-100">
                  {recentOrders.map(order => (
                    <div
                      key={order.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={order.buyerAvatar}
                          name={order.buyerName || 'Buyer'}
                          size="sm"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">
                              {order.buyerName}
                            </span>
                            <StatusChip status={order.status} />
                          </div>
                          <div className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                            {order.listingTitle}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 pl-10 sm:pl-0">
                        <div className="text-right">
                          <div className="text-xs font-extrabold text-slate-900">
                            ${order.amount.toFixed(2)}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {new Date(order.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>

                        <Link
                          to={`/orders/${order.id}`}
                          className="text-xs font-semibold text-[#0F766E] hover:underline inline-flex items-center gap-0.5"
                        >
                          <span>View</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* YOUR ACTIVE LISTINGS TABLE */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Your Active Listings</h3>
                    <p className="text-xs text-slate-500">
                      Manage campus items, edit prices, pause availability, or create new listings.
                    </p>
                  </div>

                  {/* Search box */}
                  <div className="relative w-full sm:w-60">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search listings..."
                      value={listingSearch}
                      onChange={e => setListingSearch(e.target.value)}
                      className="w-full bg-slate-50 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20"
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                        <th className="pb-3 font-semibold">Listing</th>
                        <th className="pb-3 font-semibold">Type</th>
                        <th className="pb-3 font-semibold">Price</th>
                        <th className="pb-3 font-semibold">Views</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredListings.length > 0 ? (
                        filteredListings.map(listing => (
                          <tr key={listing.id} className="hover:bg-slate-50/70 transition-colors">
                            {/* Listing Thumbnail + Title */}
                            <td className="py-3.5 pr-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                  <img
                                    src={listing.images[0]}
                                    alt={listing.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0 max-w-xs">
                                  <Link
                                    to={listing.type === 'service' ? `/service/${listing.id}` : `/product/${listing.id}`}
                                    className="font-bold text-slate-900 hover:text-[#0F766E] truncate block"
                                  >
                                    {listing.title}
                                  </Link>
                                  <span className="text-[11px] text-slate-400">
                                    {listing.category}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Type */}
                            <td className="py-3.5">
                              <span className="capitalize px-2 py-0.5 rounded-full bg-slate-100 font-medium text-slate-700">
                                {listing.type}
                              </span>
                            </td>

                            {/* Price */}
                            <td className="py-3.5 font-bold text-slate-900">
                              ${listing.basePrice.toFixed(2)}
                            </td>

                            {/* Views */}
                            <td className="py-3.5 text-slate-600">
                              {listing.views}
                            </td>

                            {/* Status Chip */}
                            <td className="py-3.5">
                              <StatusChip status={listing.status} />
                            </td>

                            {/* Actions: Edit, Pause, Delete */}
                            <td className="py-3.5 text-right">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleTogglePause(listing)}
                                  className="p-1 text-slate-400 hover:text-slate-800 transition-colors"
                                  title={listing.status === 'paused' ? 'Resume' : 'Pause'}
                                >
                                  {listing.status === 'paused' ? (
                                    <Play className="w-4 h-4 text-emerald-600" />
                                  ) : (
                                    <Pause className="w-4 h-4" />
                                  )}
                                </button>

                                <Link
                                  to="/sell"
                                  className="p-1 text-slate-400 hover:text-[#0F766E] transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </Link>

                                <button
                                  type="button"
                                  onClick={() => handleDelete(listing.id)}
                                  className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400">
                            No listings match your search.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY LISTINGS (Detailed view) */}
          {activeNav === 'listings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">All My Active Listings</h2>
                <Link to="/sell">
                  <Button variant="primary" size="sm">
                    + Add New Item
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.map(listing => (
                  <div
                    key={listing.id}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs p-4 space-y-3"
                  >
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <StatusChip status={listing.status} />
                      <span className="font-extrabold text-sm text-[#0F766E]">
                        ${listing.basePrice.toFixed(2)}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                      {listing.title}
                    </h4>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <button
                        onClick={() => handleTogglePause(listing)}
                        className="text-slate-600 hover:text-slate-900 font-semibold"
                      >
                        {listing.status === 'paused' ? 'Resume' : 'Pause'}
                      </button>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        className="text-red-600 hover:text-red-700 font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeNav === 'orders' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Orders & Inquiries</h2>
                <Link to="/orders">
                  <Button variant="secondary" size="sm">
                    Full Orders Pipeline
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-slate-500">
                Manage your active inquiries and deliverables in the full orders pipeline.
              </p>
            </div>
          )}

          {/* TAB 4: COMMUNITY STUDENT HUB */}
          {activeNav === 'community' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
              <GraduationCap className="w-12 h-12 text-[#0F766E] mx-auto" />
              <h2 className="text-xl font-bold text-slate-900">Campus Student Hub</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Connect with peers across verified student colleges, discover hackathons, and share trade tips.
              </p>
              <Link to="/community">
                <Button variant="primary" size="md">
                  Open Student Hub
                </Button>
              </Link>
            </div>
          )}

          {/* TAB 5: REVIEWS */}
          {activeNav === 'reviews' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Verified Campus Reviews</h2>
              <div className="divide-y divide-slate-100">
                {reviews.map(r => (
                  <div key={r.id} className="py-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar src={r.reviewerAvatar} name={r.reviewerName} size="xs" />
                        <span className="font-bold text-xs text-slate-900">{r.reviewerName}</span>
                      </div>
                      <div className="flex items-center text-amber-500 text-xs">
                        {'★'.repeat(r.rating)}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 italic">"{r.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: TEAM (For Startup Accounts) */}
          {isStartupAccount && activeNav === 'team' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Venture Team Directory</h2>
                  <p className="text-xs text-slate-500">
                    Students affiliated with your venture organization on campus.
                  </p>
                </div>
                <Button variant="primary" size="sm">
                  + Add Member
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                  <Avatar src={currentUser.avatar} name={currentUser.name} size="md" />
                  <div>
                    <div className="font-bold text-sm text-slate-900">{currentUser.name}</div>
                    <div className="text-xs text-[#0F766E] font-semibold">Founder & Lead</div>
                    <div className="text-[11px] text-slate-400">{currentUser.college}</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                  <Avatar
                    src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300"
                    name="Maya Lin"
                    size="md"
                  />
                  <div>
                    <div className="font-bold text-sm text-slate-900">Maya Lin</div>
                    <div className="text-xs text-[#0F766E] font-semibold">Lead Product Designer</div>
                    <div className="text-[11px] text-slate-400">RISD / Brown</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: ANALYTICS (For Startup Accounts) */}
          {isStartupAccount && activeNav === 'analytics' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
              <h2 className="text-lg font-bold text-slate-900">Venture Conversion Analytics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">Quote Inquiries</div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">28</div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-1">82% conversion</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">Avg Project Scope</div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">$240.00</div>
                  <div className="text-[11px] text-slate-400 mt-1">Fixed & custom quotes</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500">Client Retention</div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">94%</div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-1">Campus clubs & founders</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: LOOKING FOR (Startup Management View) */}
          {activeNav === 'looking-for' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Handshake className="w-5 h-5 text-purple-600" />
                    <span>Startup "Looking For" & Inquiries</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage your open co-founder, designer, beta tester, and marketing collaborator requests.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link to="/looking-for">
                    <Button variant="outline" size="sm" className="text-xs">
                      View Public Board
                    </Button>
                  </Link>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs"
                  >
                    <PlusCircle size={14} />
                    <span>+ Post Request</span>
                  </Button>
                </div>
              </div>

              {/* Published Requests Section */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <h3 className="font-bold text-sm text-slate-900">Your Active Requests ({lookingForRequests.length})</h3>
                <div className="divide-y divide-slate-100">
                  {lookingForRequests.map(req => (
                    <div key={req.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{req.title}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            req.status === 'open' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {req.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">{req.description}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span>{req.timeCommitment}</span>
                          <span>•</span>
                          <span>{req.compensationDetails || req.compensationType}</span>
                          <span>•</span>
                          <span className="text-teal-700 font-semibold">{req.responseCount} pitches received</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {req.status === 'open' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => updateLookingForRequest(req.id, { status: 'filled' })}
                          >
                            Mark Filled
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => updateLookingForRequest(req.id, { status: 'open' })}
                          >
                            Re-Open
                          </Button>
                        )}
                        <button
                          onClick={() => deleteLookingForRequest(req.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors"
                          title="Delete Request"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Incoming Student Applications & Pitches */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Incoming Student Pitches & Applications ({lookingForResponses.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Students across campuses responding to your requests.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {lookingForResponses.length > 0 ? (
                    lookingForResponses.map(res => (
                      <div
                        key={res.id}
                        className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <Avatar src={res.applicantAvatar} name={res.applicantName} size="md" />
                            <div>
                              <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                                <span>{res.applicantName}</span>
                                <ShieldCheck size={14} className="text-teal-600" />
                              </div>
                              <p className="text-xs text-slate-500">
                                {res.applicantCollege} • {res.applicantMajor || 'Student'}
                              </p>
                            </div>
                          </div>

                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold self-start sm:self-auto ${
                            res.status === 'connected'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : res.status === 'reviewed'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {res.status.toUpperCase()}
                          </span>
                        </div>

                        {/* Pitch note */}
                        <div className="bg-white p-3 rounded-lg border border-slate-200/60 text-xs text-slate-700 leading-relaxed">
                          <span className="font-semibold text-slate-900 block mb-1">Pitch / Intro:</span>
                          "{res.roleOrPitch}"
                        </div>

                        {/* Direct contact and portfolio links */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                          <div className="flex items-center gap-2">
                            {res.applicantWhatsapp && (
                              <a
                                href={`https://wa.me/${res.applicantWhatsapp.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-md text-xs font-medium border border-emerald-200 transition-colors"
                              >
                                <PhoneCall size={12} /> WhatsApp: {res.applicantWhatsapp}
                              </a>
                            )}
                            <a
                              href={`mailto:${res.applicantEmail}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-md text-xs font-medium border border-teal-200 transition-colors"
                            >
                              <Mail size={12} /> {res.applicantEmail}
                            </a>
                            {res.portfolioUrl && (
                              <a
                                href={res.portfolioUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium border border-slate-200 transition-colors"
                              >
                                <ExternalLink size={12} /> Portfolio
                              </a>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {res.status !== 'connected' && (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => updateLookingForResponseStatus(res.id, 'connected')}
                                className="text-xs bg-teal-700 hover:bg-teal-800 text-white"
                              >
                                Mark Connected
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-xs text-slate-500">
                      No student applications received yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: MY COLLABS (Student / Buyer perspective) */}
          {activeNav === 'my-collabs' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Handshake className="w-5 h-5 text-purple-600" />
                    <span>My Startup Collab Pitches</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Opportunities you have pitched or connected with across student startups.
                  </p>
                </div>
                <Link to="/looking-for">
                  <Button variant="primary" size="sm" className="text-xs bg-teal-700 hover:bg-teal-800 text-white">
                    Browse More Opportunities
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {lookingForResponses.filter(r => r.applicantId === currentUser.id).length > 0 ? (
                  lookingForResponses
                    .filter(r => r.applicantId === currentUser.id)
                    .map(res => (
                      <div
                        key={res.id}
                        className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-900">{res.startupName}</span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {res.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 italic">"{res.roleOrPitch}"</p>
                        <div className="text-[11px] text-slate-400">
                          Submitted on {res.createdAt}
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-12 space-y-3">
                    <Handshake className="w-10 h-10 text-slate-300 mx-auto" />
                    <h4 className="font-bold text-sm text-slate-900">No Applications Sent Yet</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Explore startup requests for co-founders, clothing designers, beta testers, and marketing leads on our board.
                    </p>
                    <Link to="/looking-for">
                      <Button variant="primary" size="sm" className="bg-teal-700 text-white text-xs">
                        Open Looking For Board
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Create Looking For Modal */}
      <CreateLookingForModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
