import { Link } from 'react-router-dom';
import {
  Store, BadgeCheck, Users, Rocket, Heart, ArrowRight,
  ShieldCheck, Sparkles, Target,
} from 'lucide-react';

export default function AboutPage() {
  const values = [
    { icon: BadgeCheck, title: 'Student-First', desc: 'Every feature is designed with students in mind — from affordability to safety.' },
    { icon: ShieldCheck, title: 'Safe & Trusted', desc: 'Student verification and moderation keep the community protected.' },
    { icon: Rocket, title: 'Entrepreneurship', desc: 'We empower students to turn skills and hobbies into their first small business.' },
    { icon: Heart, title: 'Community', desc: 'More than a marketplace — a place to connect, share, and grow together.' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-12">
        <div className="w-16 h-16 mx-auto bg-brand-50 rounded-3xl flex items-center justify-center mb-5">
          <Store size={32} className="text-brand-600" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-4">About AMPLOFY</h1>
        <p className="text-lg text-ink-600 max-w-2xl mx-auto text-balance">
          A verified student marketplace where students can buy, sell, promote, and discover products and services created by other students.
        </p>
        <p className="text-brand-600 font-semibold mt-3">Buy. Sell. Create. Connect — with students.</p>
      </div>

      {/* Story */}
      <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-6 sm:p-8 mb-6">
        <h2 className="font-bold text-xl text-ink-800 mb-4 flex items-center gap-2">
          <Sparkles size={22} className="text-brand-600" /> Our Story
        </h2>
        <div className="space-y-4 text-ink-600 leading-relaxed">
          <p>
            AMPLOFY was born from a simple idea: students are incredibly talented. They make handmade jewellery, design digital templates, take beautiful photographs, write comprehensive notes, and create products that other students would love to buy.
          </p>
          <p>
            But there was no dedicated platform for student-to-student commerce. Generic marketplaces feel impersonal and unsafe. Social media isn't built for selling. And existing platforms don't verify that buyers and sellers are actually students.
          </p>
          <p>
            AMPLOFY changes that. We're building a marketplace exclusively for verified students — a place where a 17-year-old can sell her first handmade bracelet, where a college student can resell textbooks to a junior, and where a digital designer can find their first customers.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {values.map(v => (
          <div key={v.title} className="bg-white rounded-2xl shadow-soft border border-ink-100 p-6">
            <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
              <v.icon size={22} className="text-brand-600" />
            </div>
            <h3 className="font-bold text-ink-800 mb-2">{v.title}</h3>
            <p className="text-sm text-ink-500 leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>

      {/* Vision */}
      <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-8 sm:p-10 text-center text-white mb-8">
        <Target size={32} className="mx-auto mb-4 opacity-80" />
        <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
        <p className="text-brand-100 text-lg leading-relaxed max-w-2xl mx-auto text-balance">
          Student → First product → First customer → First review → First repeat customer → First small business.
        </p>
        <p className="text-brand-200 mt-4 text-sm">
          We help students take their first step into entrepreneurship.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-800">
        <strong>Note:</strong> AMPLOFY is currently a prototype/MVP and is not legally ready for public launch. No real payments are processed. All data shown is fictional and for demonstration purposes only.
      </div>

      <div className="text-center">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors"
        >
          Explore Marketplace <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
