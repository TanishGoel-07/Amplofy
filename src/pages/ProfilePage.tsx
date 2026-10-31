import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, Mail, Flag, Ban, Briefcase, FileText,
  Star, Users, UserPlus, Store, ArrowRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useUserMode } from '@/hooks/useUserMode';
import ServiceCard from '@/components/ServiceCard';
import PostCard from '@/components/PostCard';
import VerifiedBadge from '@/components/VerifiedBadge';
import StarRating from '@/components/StarRating';
import ContactSellerModal from '@/components/ContactSellerModal';

type Tab = 'services' | 'posts' | 'reviews' | 'about';

export default function ProfilePage() {
  const { id } = useParams();
  const { isAuthed, currentUser, following, toggleFollow, favouriteSellers, toggleSellerFavourite, startConversation, posts, services } = useApp();
  const { mode } = useUserMode();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('services');
  const [showReportModal, setShowReportModal] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

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
        <p className="text-ink-500 mb-6">Join AMPLOFY to create your campus profile, hire startups, and connect with other students.</p>
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
        <Link to="/startups" className="text-brand-600 font-semibold">← Back to Startups</Link>
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

  const userServices = services.filter(s => s.sellerId === user.id || s.startupId === user.id);
  const userPosts = posts.filter(p => p.authorId === user.id);
  const isFollowing = following.includes(user.id);
  const isFavSeller = favouriteSellers.includes(user.id);

  const tabs: { key: Tab; label: string; icon: typeof Briefcase; count: number }[] = [
    { key: 'services', label: 'Services', icon: Briefcase, count: userServices.length },
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
          <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-5 sm:p-7">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-end gap-4 sm:gap-5">
                <div className="relative">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                    alt={user.name}
                    className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white shadow-card bg-ink-100"
                  />
                  {(user.verified || user.isVerified) && (
                    <div className="absolute -bottom-1 -right-1 bg-brand-500 text-white rounded-full p-1 ring-2 ring-white">
                      <ShieldCheck size={14} className="stroke-[2.5]" />
                    </div>
                  )}
                </div>

                <div className="pb-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-ink-900">{user.name}</h1>
                    <VerifiedBadge size="sm" />
                  </div>
                  <p className="text-xs sm:text-sm text-ink-500 font-medium">
                    {user.college || user.campus || 'Verified Campus Member'}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-ink-400">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {user.location || 'Campus'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> Joined {new Date(user.joinedDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-2 sm:pt-0">
                {!isOwnProfile && (
                  <>
                    <button
                      onClick={() => toggleFollow(user.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isFollowing
                          ? 'bg-ink-100 text-ink-700 hover:bg-ink-200'
                          : 'bg-brand-600 text-white hover:bg-brand-700'
                      }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <button
                      onClick={() => setIsContactOpen(true)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold border border-ink-200 text-ink-700 hover:bg-ink-50 transition-colors inline-flex items-center gap-1"
                    >
                      <Mail size={14} /> Contact
                    </button>
                  </>
                )}

                {isOwnProfile && (
                  <Link
                    to="/dashboard"
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors"
                  >
                    Open Dashboard
                  </Link>
                )}
              </div>
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
          {tab === 'services' && (
            userServices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {userServices.map(s => <ServiceCard key={s.id} service={s} />)}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-ink-100 space-y-3">
                <Briefcase size={32} className="text-ink-300 mx-auto" />
                <p className="font-semibold text-ink-700">No services listed yet</p>
                <p className="text-xs text-ink-500 max-w-sm mx-auto">
                  {isOwnProfile
                    ? mode === 'seller'
                      ? 'Create your first service offering to start receiving client inquiries.'
                      : 'You are currently in Buyer Mode. Switch to Founder Mode to list services.'
                    : 'This student member hasn\'t published any service offerings yet.'}
                </p>
                {isOwnProfile && mode === 'seller' && (
                  <Link to="/sell" className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F766E] text-white rounded-xl text-xs font-semibold hover:bg-teal-700 transition-colors">
                    + Post Service Offering
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
                <p className="text-ink-500 text-xs">No community posts yet.</p>
              </div>
            )
          )}

          {tab === 'reviews' && (
            <div className="text-center py-16 bg-white rounded-2xl border border-ink-100">
              <Star size={32} className="text-ink-300 mx-auto mb-3" />
              <p className="text-ink-500 text-xs">No reviews yet.</p>
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
                    <span className="text-ink-700 font-medium">{user.college || user.campus || 'Not set'}</span>
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

      {user && (
        <ContactSellerModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
          seller={{
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            college: user.college,
            accountType: user.accountType,
            isVerified: user.isVerified || user.verified,
            contactWhatsapp: user.contactWhatsapp,
            contactEmail: user.contactEmail || user.email,
            contactInstagram: user.contactInstagram,
            showContact: user.showContact ?? true,
          }}
          listingTitle={`${user.name}'s Profile`}
        />
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
