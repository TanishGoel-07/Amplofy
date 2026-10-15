import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Wallet,
  Rocket,
  Users,
  Sparkles,
  Shirt,
  BookOpen,
  Smartphone,
  Palette,
  Monitor,
  Pencil,
  Briefcase,
  Recycle,
  Package,
  UserPlus,
  ShieldCheck,
  Store,
  TrendingUp,
  Search,
  type LucideIcon,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/ProductCard';

const categoryIcons: Record<string, LucideIcon> = {
  Handmade: Sparkles, Fashion: Shirt, Books: BookOpen, Electronics: Smartphone,
  'Art & Crafts': Palette, 'Digital Products': Monitor, Stationery: Pencil,
  Services: Briefcase, 'Pre-Owned': Recycle, Other: Package,
};

const categoryColors: Record<string, string> = {
  Handmade: 'bg-brand-50 text-brand-600', Fashion: 'bg-accent-50 text-accent-600',
  Books: 'bg-sky-50 text-sky-600', Electronics: 'bg-slate-100 text-slate-600',
  'Art & Crafts': 'bg-rose-50 text-rose-600', 'Digital Products': 'bg-violet-50 text-violet-600',
  Stationery: 'bg-amber-50 text-amber-600', Services: 'bg-emerald-50 text-emerald-600',
  'Pre-Owned': 'bg-teal-50 text-teal-600', Other: 'bg-indigo-50 text-indigo-600',
};

const categories = [
  { name: 'Handmade' }, { name: 'Fashion' },
  { name: 'Books' }, { name: 'Electronics' },
  { name: 'Art & Crafts' }, { name: 'Digital Products' },
  { name: 'Stationery' }, { name: 'Services' },
  { name: 'Pre-Owned' }, { name: 'Other' },
];

const features = [
  { icon: BadgeCheck, title: 'Student Verified', desc: 'Discover products and creators from verified students.', color: 'bg-brand-500' },
  { icon: Wallet, title: 'Affordable', desc: 'Find useful products at student-friendly prices.', color: 'bg-accent-500' },
  { icon: Rocket, title: 'Build Your Brand', desc: 'Turn your hobby or skill into your first small business.', color: 'bg-rose-500' },
  { icon: Users, title: 'Student Community', desc: 'Connect with other young creators, sellers and buyers.', color: 'bg-sky-500' },
];

const steps = [
  { num: '1', icon: UserPlus, title: 'Join', desc: 'Create your free account in seconds.' },
  { num: '2', icon: ShieldCheck, title: 'Verify', desc: 'Verify that you\'re a student.' },
  { num: '3', icon: Store, title: 'Discover or List', desc: 'Browse products or list your own.' },
  { num: '4', icon: TrendingUp, title: 'Connect', desc: 'Connect and buy/sell with students.' },
];

export default function HomePage() {
  const { products } = useApp();
  const hasProducts = products.length > 0;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-50/30">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -right-20 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-3 py-1.5 rounded-full text-sm font-semibold mb-5 border border-brand-100">
                <Sparkles size={16} /> The marketplace and community built for students
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ink-900 leading-[1.1] tracking-tight text-balance mb-3">
                <span className="text-brand-600">Find.</span> <span className="text-accent-600">Create.</span> <span className="text-rose-500">Belong.</span>
              </h1>

              <p className="text-lg text-ink-600 leading-relaxed mb-8 max-w-lg text-balance">
                The student marketplace and community. Discover products, services, and creators from fellow students — or start selling your own.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/explore"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-600 text-white rounded-xl font-semibold shadow-float hover:bg-brand-700 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Explore Marketplace <ArrowRight size={18} />
                </Link>
                <Link
                  to="/sell"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-ink-800 rounded-xl font-semibold border border-ink-200 hover:border-brand-300 hover:bg-brand-50 transition-all"
                >
                  Start Selling
                </Link>
              </div>
            </div>

            {/* Hero visual - empty state or product collage */}
            <div className="relative hidden lg:block animate-scale-in">
              {hasProducts ? (
                <div className="grid grid-cols-2 gap-4">
                  {products.slice(0, 4).map((p, i) => (
                    <Link
                      to={`/product/${p.id}`}
                      key={p.id}
                      className={`group bg-white rounded-2xl shadow-card overflow-hidden border border-ink-100 hover:shadow-float transition-all ${i % 2 === 1 ? 'mt-8' : ''}`}
                    >
                      <div className="aspect-square overflow-hidden bg-ink-100">
                        <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-brand-600 font-medium mb-0.5">{p.category}</p>
                        <h3 className="text-sm font-semibold text-ink-800 truncate">{p.title}</h3>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="font-bold text-ink-900">₹{p.price}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl shadow-card border border-ink-100 p-8 text-center">
                  <div className="w-16 h-16 mx-auto bg-brand-50 rounded-2xl flex items-center justify-center mb-4">
                    <Store size={28} className="text-brand-600" />
                  </div>
                  <h3 className="font-bold text-ink-800 mb-2">Be the first to sell here</h3>
                  <p className="text-sm text-ink-500 mb-4">No listings yet. Start your journey as a student entrepreneur today.</p>
                  <Link
                    to="/sell"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors"
                  >
                    <Sparkles size={16} /> Start Selling
                  </Link>
                </div>
              )}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-float p-4 border border-ink-100 max-w-[200px]">
                <div className="flex items-center gap-2 mb-1.5">
                  <ShieldCheck size={20} className="text-brand-600" />
                  <span className="text-sm font-bold text-ink-800">Student Verified</span>
                </div>
                <p className="text-xs text-ink-500">Every seller is a verified student.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FIND / CREATE / BELONG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-3">What you can do on AMPLOFY</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-5 mb-14">
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-ink-100 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
              <Search size={26} className="text-brand-600" />
            </div>
            <h3 className="font-bold text-lg text-ink-800 mb-2">FIND</h3>
            <p className="text-sm text-ink-500 leading-relaxed">Discover products, services, creators and opportunities from fellow students.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-ink-100 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-accent-50 flex items-center justify-center mb-4">
              <Sparkles size={26} className="text-accent-600" />
            </div>
            <h3 className="font-bold text-lg text-ink-800 mb-2">CREATE</h3>
            <p className="text-sm text-ink-500 leading-relaxed">Sell products, showcase your skills, offer services and build something of your own.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-ink-100 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
              <Users size={26} className="text-rose-500" />
            </div>
            <h3 className="font-bold text-lg text-ink-800 mb-2">BELONG</h3>
            <p className="text-sm text-ink-500 leading-relaxed">Connect with a community built specifically for students.</p>
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 mb-3">Why students use AMPLOFY</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(f => (
            <div key={f.title} className="bg-white rounded-2xl p-6 shadow-soft border border-ink-100 hover:shadow-card transition-shadow">
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                <f.icon size={24} className="text-white" />
              </div>
              <h3 className="font-bold text-ink-800 mb-2">{f.title}</h3>
              <p className="text-sm text-ink-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-2">Explore Categories</h2>
            <p className="text-ink-500">Find exactly what you're looking for.</p>
          </div>
          <Link to="/explore" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map(cat => {
            const Icon = categoryIcons[cat.name] || Package;
            return (
              <Link
                key={cat.name}
                to={`/explore?category=${encodeURIComponent(cat.name)}`}
                className="group bg-white rounded-2xl p-4 sm:p-5 shadow-soft border border-ink-100 hover:shadow-card hover:border-brand-200 transition-all text-center"
              >
                <div className={`w-12 h-12 mx-auto rounded-xl ${categoryColors[cat.name]} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-semibold text-sm text-ink-800 mb-0.5">{cat.name}</h3>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trending / Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-accent-600 font-semibold text-sm mb-2">
              <TrendingUp size={18} /> Listings
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-900">Recent Listings</h2>
          </div>
          {hasProducts && (
            <Link to="/explore" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
              View all <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {hasProducts ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {products.slice(0, 8).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-ink-100">
            <div className="w-16 h-16 mx-auto bg-brand-50 rounded-2xl flex items-center justify-center mb-4">
              <Package size={28} className="text-brand-400" />
            </div>
            <h3 className="font-bold text-ink-800 mb-2">No listings yet</h3>
            <p className="text-sm text-ink-500 mb-5">Be one of the first students to sell on AMPLOFY.</p>
            <Link
              to="/sell"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors"
            >
              <Sparkles size={16} /> Start Selling
            </Link>
          </div>
        )}
      </section>

      {/* Student Creators */}
      <section className="bg-gradient-to-b from-brand-50/50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-brand-600 font-semibold text-sm mb-2">
              <Users size={18} /> Creators
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-2">Student Creators to Discover</h2>
            <p className="text-ink-500 max-w-xl mx-auto">Support student entrepreneurs and discover unique products made by talented students.</p>
          </div>

          <div className="text-center py-12 bg-white rounded-2xl border border-ink-100">
            <div className="w-16 h-16 mx-auto bg-brand-50 rounded-2xl flex items-center justify-center mb-4">
              <Users size={28} className="text-brand-400" />
            </div>
            <h3 className="font-bold text-ink-800 mb-2">No creators yet</h3>
            <p className="text-sm text-ink-500 mb-5">Be the first student creator on AMPLOFY. Set up your store and start selling.</p>
            <Link
              to="/join"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors"
            >
              <UserPlus size={16} /> Join AMPLOFY
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-3">How It Works</h2>
          <p className="text-ink-500">Get started in four simple steps.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          {steps.map((step, i) => (
            <div key={step.num} className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-ink-100 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-50 flex items-center justify-center mb-4 relative">
                  <step.icon size={26} className="text-brand-600" />
                  <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-brand-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-bold text-ink-800 mb-2">{step.title}</h3>
                <p className="text-sm text-ink-500">{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-ink-200" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl px-6 py-14 sm:px-12 sm:py-16 text-center">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-400/20 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <p className="text-brand-200 font-semibold text-sm mb-2 tracking-wide">AMPLOFY</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">
              Find. Create. Belong.
            </h2>
            <p className="text-brand-100 text-lg mb-8 max-w-xl mx-auto">
              The marketplace and community built for students. Join today — it's free to explore and free to start selling.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/explore"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-brand-700 rounded-xl font-semibold hover:scale-[1.02] active:scale-95 transition-all"
              >
                Explore Marketplace <ArrowRight size={18} />
              </Link>
              <Link
                to="/sell"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-500 text-white rounded-xl font-semibold border border-brand-400 hover:bg-brand-400 transition-colors"
              >
                Start Selling
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
