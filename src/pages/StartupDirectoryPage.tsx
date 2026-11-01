import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, Building2, MapPin, ArrowRight, Handshake, Rocket, Plus } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import StartupCard from '@/components/StartupCard';
import { Button } from '@/components/ui/Button';
import CreateStartupModal from '@/components/CreateStartupModal';

const INDUSTRIES = [
  'All Industries',
  'Development',
  'Design',
  'Branding',
  'Pitch Decks',
  'Photography & Film',
  'Marketing',
  'Tutoring',
  'Music & Audio',
  'Writing & Editorial',
  'Hardware & 3D',
  'Event Production',
  'Campus Logistics',
  'Legal & Compliance',
  'Other',
];

const COLLEGES = [
  'All Campuses',
  'MIT',
  'Stanford University',
  'UC Berkeley',
  'RISD / Brown',
  'UT Austin',
  'NYU Tisch',
];

export default function StartupDirectoryPage() {
  const { startups, lookingForRequests } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedCollege, setSelectedCollege] = useState('All Campuses');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const filteredStartups = useMemo(() => {
    let result = [...startups];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          s.tagline.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.college.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      );
    }

    if (selectedIndustry !== 'All Industries') {
      result = result.filter(
        s => s.category.toLowerCase() === selectedIndustry.toLowerCase()
      );
    }

    if (selectedCollege !== 'All Campuses') {
      result = result.filter(s =>
        s.college.toLowerCase().includes(selectedCollege.toLowerCase())
      );
    }

    return result;
  }, [startups, searchQuery, selectedIndustry, selectedCollege]);

  const featured = startups.slice(0, 2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Campus Venture Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Student-Founded Startups
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Discover high-impact ventures, creative studios, and technical labs built by university founders on campus.
        </p>

        {/* Directory vs Looking For Sub-Navigation Switcher & Action */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <span className="px-4 py-2 rounded-lg text-xs font-bold bg-white text-slate-900 shadow-xs">
              Startups Directory ({startups.length})
            </span>
            <Link
              to="/looking-for"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-purple-700 transition-colors"
            >
              <Handshake size={14} className="text-purple-600" />
              <span>"Looking For" Board</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-100 text-purple-800 font-extrabold">
                {lookingForRequests.length} Open
              </span>
            </Link>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsRegisterModalOpen(true)}
            leftIcon={<Rocket className="w-4 h-4" />}
          >
            + Register Startup
          </Button>
        </div>
      </div>

      {/* Looking For Highlight Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-teal-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm border border-purple-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wide">
              New System
            </span>
            <h3 className="font-bold text-base sm:text-lg">Are you a student designer, dev, or looking to co-found?</h3>
          </div>
          <p className="text-xs sm:text-sm text-purple-200 max-w-2xl leading-relaxed">
            Campus startups are actively seeking co-founders, clothing designers, beta testers, and marketing collaborators right now.
          </p>
        </div>
        <Link
          to="/looking-for"
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
        >
          <span>Browse {lookingForRequests.length} Requests</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Featured Ventures Highlight */}
      {featured.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Featured Campus Ventures</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.map(st => (
              <StartupCard key={st.id} startup={st} />
            ))}
          </div>
        </div>
      )}

      {/* Search & Filters Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search startups by name, tagline, or skills..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0F766E]"
            />
          </div>

          {/* Industry Filter */}
          <select
            value={selectedIndustry}
            onChange={e => setSelectedIndustry(e.target.value)}
            className="w-full md:w-48 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0F766E]"
          >
            {INDUSTRIES.map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>

          {/* College Filter */}
          <select
            value={selectedCollege}
            onChange={e => setSelectedCollege(e.target.value)}
            className="w-full md:w-48 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0F766E]"
          >
            {COLLEGES.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
      </div>

      {/* All Startups Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            All Startups ({filteredStartups.length})
          </h2>
        </div>

        {filteredStartups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStartups.map(startup => (
              <StartupCard key={startup.id} startup={startup} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4 shadow-2xs">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-[#0F766E] flex items-center justify-center mx-auto border border-teal-100 shadow-xs">
              <Rocket className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {startups.length === 0 ? 'Be the Founding Venture from Your Campus!' : 'No startups found'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {startups.length === 0
                  ? 'Amplofy connects collegiate software agencies, creative studios, and technical labs with student clients. Register your startup today to showcase your team and services.'
                  : 'Try adjusting your industry or campus filters to discover more collegiate teams.'}
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              {startups.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedIndustry('All Industries');
                    setSelectedCollege('All Campuses');
                  }}
                >
                  Reset Filters
                </Button>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsRegisterModalOpen(true)}
                leftIcon={<Rocket className="w-4 h-4" />}
              >
                Register Campus Startup
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Register Startup Modal */}
      <CreateStartupModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccess={() => {
          setIsRegisterModalOpen(false);
        }}
      />
    </div>
  );
}
