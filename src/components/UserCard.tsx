import { Link } from 'react-router-dom';
import { MapPin, Users } from 'lucide-react';
import type { User } from '@/data/types';
import { useApp } from '@/context/AppContext';
import VerifiedBadge from './VerifiedBadge';
import StarRating from './StarRating';

interface UserCardProps {
  user: User;
  className?: string;
}

export default function UserCard({ user, className = '' }: UserCardProps) {
  const { following, toggleFollow } = useApp();
  const isFollowing = following.includes(user.id);

  return (
    <Link
      to={`/profile/${user.id}`}
      className={`group block bg-white rounded-2xl shadow-soft hover:shadow-float transition-all duration-300 p-5 border border-ink-100 ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover"
          />
          {user.verified && (
            <div className="absolute -bottom-1 -right-1">
              <VerifiedBadge size="sm" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-ink-800 truncate group-hover:text-brand-700 transition-colors">
              {user.name}
            </h3>
          </div>
          <p className="text-sm text-ink-500 truncate mb-1.5">@{user.username}</p>
          <p className="text-sm text-ink-600 line-clamp-2 mb-2">{user.bio}</p>

          <div className="flex items-center gap-3 text-xs text-ink-400">
            <span className="inline-flex items-center gap-1">
              <MapPin size={12} /> {user.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users size={12} /> {user.followers} followers
            </span>
          </div>

          {user.rating > 0 && (
            <div className="mt-2">
              <StarRating rating={user.rating} size="sm" showNumber reviewCount={user.reviewCount} />
            </div>
          )}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          toggleFollow(user.id);
        }}
        className={`mt-4 w-full py-2 rounded-xl text-sm font-semibold transition-colors ${
          isFollowing
            ? 'bg-ink-100 text-ink-600 hover:bg-ink-200'
            : 'bg-brand-600 text-white hover:bg-brand-700'
        }`}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </button>
    </Link>
  );
}
