import { NavLink } from 'react-router-dom';
import { Home, Compass, Plus, ShoppingBag, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function BottomNav() {
  const { isAuthed } = useApp();

  const items = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/products', icon: Compass, label: 'Browse' },
    { to: isAuthed ? '/sell' : '/signin', icon: Plus, label: 'Post', highlight: true },
    { to: isAuthed ? '/orders' : '/signin', icon: ShoppingBag, label: 'Orders' },
    { to: isAuthed ? '/profile' : '/signin', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-[env(safe-area-inset-bottom)] shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-[#0F766E]' : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            {item.highlight ? (
              <div className="w-11 h-11 rounded-2xl bg-[#0F766E] hover:bg-[#115E59] flex items-center justify-center shadow-md -mt-4 text-white transition-transform active:scale-95">
                <item.icon className="w-6 h-6" />
              </div>
            ) : (
              <item.icon className="w-5 h-5 mb-0.5" />
            )}
            <span className={`text-[10px] font-semibold ${item.highlight ? 'mt-1' : ''}`}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
