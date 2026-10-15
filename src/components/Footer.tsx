import { Link } from 'react-router-dom';
import { Store, Mail, Instagram, Twitter, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-ink-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                <Store size={20} className="text-white" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">AMPLOFY</span>
            </Link>
            <p className="text-sm text-ink-400 leading-relaxed">
              The marketplace and community built for students.
            </p>
            <p className="text-xs text-ink-500 mt-4 font-medium">Find. Create. Belong.</p>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Marketplace</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/explore" className="hover:text-brand-300 transition-colors">Explore</Link></li>
              <li><Link to="/sell" className="hover:text-brand-300 transition-colors">Sell Something</Link></li>
              <li><Link to="/wanted" className="hover:text-brand-300 transition-colors">Wanted</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Community</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/community" className="hover:text-brand-300 transition-colors">Community</Link></li>
              <li><Link to="/messages" className="hover:text-brand-300 transition-colors">Messages</Link></li>
              <li><Link to="/favourites" className="hover:text-brand-300 transition-colors">Favourites</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Help &amp; Safety</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/safety" className="hover:text-brand-300 transition-colors">Safety</Link></li>
              <li><Link to="/community-guidelines" className="hover:text-brand-300 transition-colors">Community Guidelines</Link></li>
              <li><Link to="/report-problem" className="hover:text-brand-300 transition-colors">Report a Problem</Link></li>
              <li><Link to="/contact" className="hover:text-brand-300 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/terms" className="hover:text-brand-300 transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-brand-300 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/prohibited" className="hover:text-brand-300 transition-colors">Prohibited Items</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-ink-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-500">
            © 2026 AMPLOFY. Prototype — not yet legally ready for public launch.
          </p>
          <div className="flex items-center gap-3">
            <a href="#" className="w-9 h-9 rounded-lg bg-ink-800 hover:bg-brand-600 flex items-center justify-center transition-colors" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-9 h-9 rounded-lg bg-ink-800 hover:bg-brand-600 flex items-center justify-center transition-colors" aria-label="Twitter">
              <Twitter size={18} />
            </a>
            <a href="#" className="w-9 h-9 rounded-lg bg-ink-800 hover:bg-brand-600 flex items-center justify-center transition-colors" aria-label="Email">
              <Mail size={18} />
            </a>
            <a href="#" className="w-9 h-9 rounded-lg bg-ink-800 hover:bg-brand-600 flex items-center justify-center transition-colors" aria-label="GitHub">
              <Github size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
