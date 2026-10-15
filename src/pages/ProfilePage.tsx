import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, MessageCircle, Flag, Ban, Grid3x3, FileText,
  Star, Package, Users, UserPlus, Store, ArrowRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/ProductCard';
import PostCard from '@/components/PostCard';
import VerifiedBadge from '@/components/VerifiedBadge';
import StarRating from '@/components/StarRating';

type Tab = 'products' | 'posts' | 'reviews' | 'about';

export default function ProfilePage() {
  const { id } = useParams();
  const { isAuthed, currentUser, following, toggleFollow, favouriteSellers, toggleSellerFavourite, startConversation, posts, products } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('products');
  const [showReportModal, setShowReportModal] = useState(false);

  // If no id, show current user's profile or sign-in prompt
  const isOwnProfile = !id || id === currentUser?.id;
  const user = isOwnProfile ? currentUser : null;

  // Not logged in - show sign-in prompt
  if (isOwnProfile && !isAuthed) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-16 h-16 mx-auto bg-brand-50 rounded-3xl flex items-center justify-center mb-5">
          <Store size={32} className="text-brand-600" />
        </div>
        <h1 className="text-2xl font-bold text-ink-900 mb-2">Your Profile</h1>
        <p className="text-ink-500 mb-6">Join AMPLOFY to create your profile, start selling, and connect with other students.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/join" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors">
            <UserPlus size={18} /> Join AMPLOFY
          </Link>
          <Link to="/signin" className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-ink-200 text-ink-700 rounded-xl font-semibold hover:bg-ink-50 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Profile for a specific user that doesn't exist yet
  if (!user && id) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-ink-800 mb-2">User not found</h2>
        <p className="text-ink-500 mb-4">This profile may not exist yet.</p>
        <Link to="/explore" className="text-brand-600 font-semibold">← Back to Explore</Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <Link to="/signin" className="text-brand-600 font-semibold">← Sign In</Link>
      </div>
    );
  }

  const userProducts = products.filter(p => p.sellerId === user.id);
  const userPosts = posts.filter(p => p.authorId === user.id);
  const isFollowing = following.includes(user.id);
  const isFavSeller = favouriteSellers.includes(user.id);
  const hasProfileData = user.name || user.bio || user.avatar;

  const tabs: { key: Tab; label: string; icon: typeof Grid3x3; count: number }[] = [
    { key: 'products', label: 'Products', icon: Grid3x3, count: userProducts.length },
    { key: 'posts', label: 'Posts', icon: FileText, count: userPosts.length },
    { key: 'reviews', label: 'Reviews', icon: Star, count: 0 },
    { key: 'about', label: 'About', icon: Users, count: 0 },
  ];

  const handleMessage = () => {
    if (!isAuthed) {
      navigate('/signin');
      return;
    }
    const convId = startConversation(user.id);
    navigate(`/messages?c=${convId}`);
  };

  return (
    <div>
      {/* Cover & profile header */}
      <div className="relative bg-gradient-to-br from-brand-600 to-brand-800 h-40 sm:h-52">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative -mt-16 sm:-mt-20">
          <div className="bg-white rounded-2xl shadow-card border border-ink-100 p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="relative shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white shadow-float" />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-brand-50 ring-4 ring-white shadow-float flex items-center justify-center">
                    <Users size={40} className="text-brand-300" />
                  </div>
                )}
                {user.verified && (
                  <div className="absolute -bottom-1 -right-1">
                    <VerifiedBadge size="md" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                {hasProfileData ? (
                  <>
                    <h1 className="text-xl sm:text-2xl font-bold text-ink-900 flex items-center gap-2">
                      {user.name || 'Unnamed'}
                      {user.verified && <VerifiedBadge size="md" showText className="hidden sm:inline-flex" />}
                    </h1>
                    {user.username && <p className="text-ink-400 text-sm mb-2">@{user.username}</p>}
                    {user.bio && <p className="text-ink-600 text-sm leading-relaxed max-w-2xl">{user.bio}</p>}

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-ink-500">
                      {user.location && <span className="inline-flex items-center gap-1"><MapPin size={14} /> {user.location}</span>}
                      <span className="inline-flex items-center gap-1"><Package size={14} /> {userProducts.length} listings</span>
                      <span className="inline-flex items-center gap-1"><Calendar size={14} /> Joined {new Date(user.joinedDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      <div className="flex items-center gap-3 text-sm">
                        <span><strong className="text-ink-800">{user.followers}</strong> <span className="text-ink-400">followers</span></span>
                        <span><strong className="text-ink-800">{user.following}</strong> <span className="text-ink-400">following</span></span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="text-xl sm:text-2xl font-bold text-ink-900 mb-2">Welcome to AMPLOFY</h1>
                    <p className="text-ink-500 text-sm mb-4">Your profile is empty. Complete your profile to start selling and connecting with other students.</p>
                    <Link to="/verify" className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors">
                      <ShieldCheck size={16} /> Get Verified <ArrowRight size={14} />
                    </Link>
                  </>
                )}
              </div>

              {/* Action buttons */}
              {!isOwnProfile && (
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => toggleFollow(user.id)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${isFollowing ? 'bg-ink-100 text-ink-600 hover:bg-ink-200' : 'bg-brand-600 text-white hover:bg-brand-700'}`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button
                    onClick={handleMessage}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-ink-200 text-ink-700 hover:bg-ink-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} /> Message
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleSellerFavourite(user.id)}
                      className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${isFavSeller ? 'bg-amber-50 border-amber-200 text-amber-700' : 'border-ink-200 text-ink-600 hover:bg-ink-50'}`}
                    >
                      {isFavSeller ? 'Saved' : 'Save'}
                    </button>
                    <button
                      onClick={() => setShowReportModal(true)}
                      className="w-10 h-9 rounded-xl border border-ink-200 text-ink-400 hover:text-error-500 hover:border-error-200 flex items-center justify-center transition-colors"
                      title="Report User"
                    >
                      <Flag size={16} />
                    </button>
                    <button
                      onClick={() => setShowReportModal(true)}
                      className="w-10 h-9 rounded-xl border border-ink-200 text-ink-400 hover:text-error-500 hover:border-error-200 flex items-center justify-center transition-colors"
                      title="Block User"
                    >
                      <Ban size={16} />
                    </button>
                  </div>
                </div>
              )}

              {isOwnProfile && (
                <Link
                  to="/dashboard"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors"
                >
                  Edit Profile
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-ink-200">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${tab === t.key ? 'border-brand-600 text-brand-700' : 'border-transparent text-ink-500 hover:text-ink-700'}`}
              >
                <t.icon size={16} />
                {t.label}
                {t.count > 0 && <span className="text-xs text-ink-400">({t.count})</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="py-6 pb-20 lg:pb-6">
          {tab === 'products' && (
            userProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {userProducts.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-ink-100">
                <Package size={32} className="text-ink-300 mx-auto mb-3" />
                <p className="font-semibold text-ink-700 mb-1">No products listed yet</p>
                <p className="text-sm text-ink-500 mb-4">
                  {isOwnProfile ? "List your first product to start selling." : "This seller hasn't listed any products yet."}
                </p>
                {isOwnProfile && (
                  <Link to="/sell" className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors">
                    <Package size={16} /> Start Selling
                  </Link>
                )}
              </div>
            )
          )}

          {tab === 'posts' && (
            userPosts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {userPosts.map(p => <PostCard key={p.id} post={p} />)}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-ink-100">
                <FileText size={32} className="text-ink-300 mx-auto mb-3" />
                <p className="text-ink-500">No posts yet.</p>
              </div>
            )
          )}

          {tab === 'reviews' && (
            <div className="text-center py-16 bg-white rounded-2xl border border-ink-100">
              <Star size={32} className="text-ink-300 mx-auto mb-3" />
              <p className="text-ink-500">No reviews yet.</p>
            </div>
          )}

          {tab === 'about' && (
            <div className="max-w-2xl space-y-4">
              <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-6">
                <h3 className="font-bold text-ink-800 mb-3">About</h3>
                {user.bio ? (
                  <p className="text-ink-600 text-sm leading-relaxed">{user.bio}</p>
                ) : (
                  <p className="text-ink-400 text-sm">No bio added yet.</p>
                )}
              </div>
              <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-6">
                <h3 className="font-bold text-ink-800 mb-4">Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-ink-400 w-28">Location</span>
                    <span className="text-ink-700 font-medium">{user.location || 'Not set'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-ink-400 w-28">Campus</span>
                    <span className="text-ink-700 font-medium">{user.campus || 'Not set'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-ink-400 w-28">Joined</span>
                    <span className="text-ink-700 font-medium">{new Date(user.joinedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-ink-400 w-28">Verification</span>
                    {user.verified ? <VerifiedBadge size="sm" showText /> : <span className="text-ink-500">Not verified</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowReportModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-float max-w-md w-full p-6 animate-scale-in">
            <h3 className="font-bold text-lg text-ink-800 mb-2">Report User</h3>
            <p className="text-sm text-ink-500 mb-4">Help us keep the community safe. Why are you reporting this user?</p>
            <div className="space-y-2 mb-4">
              {['Harassment or bullying', 'Scam or fraudulent activity', 'Spam or fake listings', 'Inappropriate content', 'Impersonation', 'Other'].map(reason => (
                <label key={reason} className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-ink-50 cursor-pointer">
                  <input type="radio" name="report-reason" className="accent-brand-600" />
                  <span className="text-sm text-ink-700">{reason}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowReportModal(false)} className="flex-1 py-2.5 border border-ink-200 rounded-xl text-sm font-semibold text-ink-700">Cancel</button>
              <button onClick={() => setShowReportModal(false)} className="flex-1 py-2.5 bg-error-500 text-white rounded-xl text-sm font-semibold hover:bg-error-600 transition-colors">Submit Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ShieldCheck({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
