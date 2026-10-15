import { Link } from 'react-router-dom';
import {
  MessageCircle, UserPlus, Heart, Star, Package, BadgeCheck,
  Bell, CheckCheck, TrendingUp, Check, AlertCircle, Clock,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import VerifiedBadge from '@/components/VerifiedBadge';

const typeConfig: Record<string, { icon: typeof MessageCircle; color: string }> = {
  message: { icon: MessageCircle, color: 'bg-brand-50 text-brand-600' },
  follow: { icon: UserPlus, color: 'bg-sky-50 text-sky-600' },
  like: { icon: Heart, color: 'bg-rose-50 text-rose-600' },
  favourite: { icon: Star, color: 'bg-amber-50 text-amber-600' },
  review: { icon: Star, color: 'bg-emerald-50 text-emerald-600' },
  listing: { icon: Package, color: 'bg-violet-50 text-violet-600' },
  verification: { icon: BadgeCheck, color: 'bg-brand-50 text-brand-600' },
  offer: { icon: TrendingUp, color: 'bg-accent-50 text-accent-600' },
  'listing-approved': { icon: Check, color: 'bg-emerald-50 text-emerald-600' },
  'listing-rejected': { icon: AlertCircle, color: 'bg-error-50 text-error-600' },
  'verification-expiring': { icon: Clock, color: 'bg-amber-50 text-amber-600' },
};

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadNotificationCount } = useApp();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell size={24} className="text-brand-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900">Notifications</h1>
          {unreadNotificationCount > 0 && (
            <span className="bg-error-500 text-white text-sm font-bold rounded-full min-w-[24px] h-6 flex items-center justify-center px-2">
              {unreadNotificationCount}
            </span>
          )}
        </div>
        {unreadNotificationCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            <CheckCheck size={16} /> Mark all read
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map(n => {
            const config = typeConfig[n.type] || { icon: Bell, color: 'bg-ink-50 text-ink-600' };
            const Icon = config.icon;
            return (
              <Link
                key={n.id}
                to={n.link || '#'}
                onClick={() => markNotificationRead(n.id)}
                className={`flex items-start gap-3 p-4 rounded-2xl border transition-all hover:shadow-soft ${n.read ? 'bg-white border-ink-100' : 'bg-brand-50/50 border-brand-100'}`}
              >
                <div className={`w-10 h-10 rounded-xl ${config.color} flex items-center justify-center shrink-0`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm ${n.read ? 'font-medium text-ink-700' : 'font-bold text-ink-800'}`}>
                      {n.title}
                    </p>
                    {!n.read && <span className="w-2 h-2 bg-brand-600 rounded-full shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-sm text-ink-500 mt-0.5">{n.description}</p>
                  <p className="text-xs text-ink-400 mt-1">
                    {new Date(n.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {n.actorAvatar && (
                  <img src={n.actorAvatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                )}
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-ink-100">
          <Bell size={36} className="text-ink-300 mx-auto mb-4" />
          <h3 className="font-bold text-ink-700 mb-2">No notifications</h3>
          <p className="text-sm text-ink-400">You're all caught up!</p>
        </div>
      )}
    </div>
  );
}
