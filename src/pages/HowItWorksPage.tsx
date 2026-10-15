import { Link } from 'react-router-dom';
import {
  UserPlus, ShieldCheck, Store, TrendingUp, ArrowRight,
  Check, BadgeCheck, MessageCircle, Heart, Package,
} from 'lucide-react';

const steps = [
  {
    num: '1',
    icon: UserPlus,
    title: 'Join AMPLOFY',
    desc: 'Create your free account in seconds. It\'s free to join and free to browse.',
    points: ['Sign up with your details', 'Set up your profile', 'Start exploring immediately'],
  },
  {
    num: '2',
    icon: ShieldCheck,
    title: 'Verify You\'re a Student',
    desc: 'Student verification keeps our marketplace safe and within the student community.',
    points: ['Choose school or college student', 'Submit your institution details', 'Get verified and start selling'],
  },
  {
    num: '3',
    icon: Store,
    title: 'Discover or List Products',
    desc: 'Browse products from other students or list your own creations, pre-owned items, or services.',
    points: ['Explore 10+ categories', 'List products, digital goods, or services', 'Add photos, descriptions, and pricing'],
  },
  {
    num: '4',
    icon: TrendingUp,
    title: 'Connect and Buy/Sell',
    desc: 'Message sellers, follow creators, leave reviews, and build your student business.',
    points: ['Message sellers directly', 'Save favourites and follow creators', 'Leave and receive reviews'],
  },
];

const features = [
  { icon: Package, title: 'Browse Listings', desc: 'Explore products across 10 categories' },
  { icon: Heart, title: 'Save Favourites', desc: 'Bookmark products, creators, and posts' },
  { icon: MessageCircle, title: 'Message Sellers', desc: 'Chat directly with product creators' },
  { icon: BadgeCheck, title: 'Student Verified', desc: 'Every seller is a verified student' },
];

export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-3">How It Works</h1>
        <p className="text-lg text-ink-600 max-w-xl mx-auto">
          Get started on AMPLOFY in four simple steps. Join, verify, discover, and connect.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-6 mb-12">
        {steps.map((step, i) => (
          <div key={step.num} className="bg-white rounded-2xl shadow-soft border border-ink-100 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="flex sm:flex-col items-center gap-4 sm:gap-3 shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center relative">
                  <step.icon size={26} className="text-brand-600" />
                  <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-brand-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {step.num}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-xl text-ink-800 mb-2">{step.title}</h2>
                <p className="text-ink-600 mb-4">{step.desc}</p>
                <div className="grid sm:grid-cols-3 gap-2">
                  {step.points.map(p => (
                    <div key={p} className="flex items-start gap-2 text-sm text-ink-600">
                      <Check size={16} className="text-brand-600 shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick features */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        {features.map(f => (
          <div key={f.title} className="bg-white rounded-2xl shadow-soft border border-ink-100 p-4 text-center">
            <div className="w-10 h-10 mx-auto rounded-xl bg-brand-50 flex items-center justify-center mb-3">
              <f.icon size={20} className="text-brand-600" />
            </div>
            <h3 className="font-semibold text-sm text-ink-800 mb-1">{f.title}</h3>
            <p className="text-xs text-ink-400">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">Ready to get started?</h2>
        <p className="text-brand-100 mb-6">Join the student marketplace today. It's free.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/explore" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-brand-700 rounded-xl font-semibold hover:scale-[1.02] transition-transform">
            Explore Marketplace <ArrowRight size={18} />
          </Link>
          <Link to="/sell" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-xl font-semibold border border-brand-400 hover:bg-brand-400 transition-colors">
            Start Selling
          </Link>
        </div>
      </div>
    </div>
  );
}
