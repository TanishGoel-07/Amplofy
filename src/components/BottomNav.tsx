import { NavLink } from 'react-router-dom';
import { Home, Compass, PlusCircle, MessageCircle, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function BottomNav() {
  const { isAuthed, conversations } = useApp();

  if (!isAuthed) return null;

  const unreadMessages = conversations.reduce((sum, c) => sum + c.unread, 0);

  const items = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/explore', icon: Compass, label: 'Explore' },
    { to: '/sell', icon: PlusCircle, label: 'Sell', highlight: true },
    { to: '/messages', icon: MessageCircle, label: 'Messages', badge: unreadMessages > 0 ? unreadMessages : undefined },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-ink-100 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                isActive ? 'text-brand-600' : 'text-ink-400'
              }`
            }
          >
            {item.highlight ? (
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-float -mt-3">
                <item.icon size={22} className="text-white" />
              </div>
            ) : (
              <div className="relative">
                <item.icon size={22} />
                {item.badge ? (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-error-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </div>
            )}
            <span className={`text-[10px] font-medium ${item.highlight ? 'mt-0.5' : ''}`}>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
