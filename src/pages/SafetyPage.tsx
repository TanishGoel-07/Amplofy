import { Link } from 'react-router-dom';
import {
  ShieldCheck, MapPin, Lock, KeyRound, CreditCard, Flag,
  Package, AlertTriangle, Users, ArrowRight,
} from 'lucide-react';

const guidelines = [
  {
    icon: MapPin,
    title: 'Meet in Public Places',
    desc: 'When exchanging physical goods, always meet in public, well-lit locations. Campus libraries, coffee shops, and college common areas are great options. Never meet at someone\'s private residence or in isolated areas.',
  },
  {
    icon: Lock,
    title: 'Protect Your Personal Information',
    desc: 'Do not share unnecessary personal information like your home address, daily schedule, or financial details. Communicate through the platform\'s messaging system rather than personal channels.',
  },
  {
    icon: KeyRound,
    title: 'Never Share Passwords or Codes',
    desc: 'AMPLOFY will never ask for your password, OTP, or verification codes. Never share these with anyone, including people claiming to be platform staff or administrators.',
  },
  {
    icon: CreditCard,
    title: 'Be Careful with Payments',
    desc: 'The platform does not currently process payments. When arranging payment independently, use trusted methods and be cautious. Never pay in advance to someone you don\'t trust.',
  },
  {
    icon: Flag,
    title: 'Report Suspicious Behaviour',
    desc: 'If you encounter suspicious listings, scam attempts, or inappropriate behaviour, report it immediately using the "Report" button on any listing or profile.',
  },
  {
    icon: Package,
    title: 'Only List Legal Products',
    desc: 'Only list legal and permitted products and services. Do not list prohibited, dangerous, counterfeit, stolen, or illegal items. Review our Prohibited Items policy.',
  },
];

export default function SafetyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-10">
        <div className="w-16 h-16 mx-auto bg-brand-50 rounded-3xl flex items-center justify-center mb-5">
          <ShieldCheck size={32} className="text-brand-600" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink-900 mb-3">Safety & Trust</h1>
        <p className="text-lg text-ink-600 max-w-2xl mx-auto">
          Your safety is our top priority. Follow these guidelines to have a safe and positive experience on AMPLOFY.
        </p>
      </div>

      {/* Important notice for minors */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
        <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <p className="font-semibold mb-1">Important for all students, especially minors</p>
          <p>Some users on this platform may be minors (ages 15-17). We do not encourage or facilitate unsafe private meetups. Always meet in public or campus locations, inform a parent or guardian about your plans, and never share sensitive personal information.</p>
        </div>
      </div>

      {/* Guidelines */}
      <div className="space-y-4 mb-10">
        {guidelines.map(g => (
          <div key={g.title} className="bg-white rounded-2xl shadow-soft border border-ink-100 p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                <g.icon size={22} className="text-brand-600" />
              </div>
              <div>
                <h2 className="font-bold text-ink-800 mb-2">{g.title}</h2>
                <p className="text-sm text-ink-600 leading-relaxed">{g.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Campus exchange */}
      <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <Users size={24} className="text-brand-600 shrink-0" />
          <div>
            <h2 className="font-bold text-ink-800 mb-2">Campus Exchange Locations</h2>
            <p className="text-sm text-ink-600 leading-relaxed">
              We encourage meeting at campus or public locations for exchanging physical goods. Good options include:
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-ink-600">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-brand-500 rounded-full" /> Campus libraries or study areas</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-brand-500 rounded-full" /> Coffee shops and restaurants</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-brand-500 rounded-full" /> College common rooms and courtyards</li>
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-brand-500 rounded-full" /> Shopping malls and public markets</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Prohibited items link */}
      <div className="bg-white rounded-2xl shadow-soft border border-ink-100 p-6 mb-8">
        <h2 className="font-bold text-ink-800 mb-2">Prohibited Items</h2>
        <p className="text-sm text-ink-600 mb-4">
          AMPLOFY maintains a strict policy against illegal and dangerous items. Make sure you understand what's not allowed.
        </p>
        <Link to="/prohibited" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700">
          View Prohibited Items Policy <ArrowRight size={16} />
        </Link>
      </div>

      {/* Reporting */}
      <div className="bg-error-50 border border-error-100 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <Flag size={24} className="text-error-600 shrink-0" />
          <div>
            <h2 className="font-bold text-ink-800 mb-2">Report a Problem</h2>
            <p className="text-sm text-ink-600 leading-relaxed mb-3">
              If you see something suspicious, report it. Every listing has a "Report Listing" button and every profile has "Report User" and "Block User" options. Our admin team reviews all reports promptly.
            </p>
            <p className="text-sm text-error-700 font-medium">
              When in doubt, report it. Your reports help keep the community safe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
