import React, { useState, useMemo } from 'react';
import {
  Search, Plus, Sparkles, Filter, X, Rocket, Palette,
  Megaphone, FlaskConical, ShoppingBag, MessageSquareQuote,
  Handshake, Building2, Users, ShieldCheck, Check
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { LookingForCategory, StartupLookingFor, CompensationType, LookingForLocationType } from '@/data/types';
import { LookingForCard } from '@/components/LookingForCard';
import { RespondLookingForModal } from '@/components/RespondLookingForModal';
import { CreateLookingForModal } from '@/components/CreateLookingForModal';
import { Button } from '@/components/ui/Button';

const CATEGORY_TABS: { id: LookingForCategory | 'all'; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'all', label: 'All Requests', icon: Sparkles },
  { id: 'co-founder', label: 'Co-Founders', icon: Rocket },
  { id: 'designer-dev', label: 'Design & Dev', icon: Palette },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
  { id: 'beta-testers', label: 'Beta Testers', icon: FlaskConical },
  { id: 'first-customers', label: 'First Customers', icon: ShoppingBag },
  { id: 'product-feedback', label: 'Product Feedback', icon: MessageSquareQuote },
  { id: 'startup-collab', label: 'Startup Collabs', icon: Handshake },
];

export default function LookingForPage() {
  const { lookingForRequests, updateLookingForRequest, isAuthed, currentUser } = useApp();

  const [activeCategory, setActiveCategory] = useState<LookingForCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('all');
  const [selectedCompensation, setSelectedCompensation] = useState<CompensationType | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<LookingForLocationType | 'all'>('all');

  const [respondingRequest, setRespondingRequest] = useState<StartupLookingFor | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Extract colleges
  const colleges = useMemo(() => {
    const list = Array.from(new Set(lookingForRequests.map(r => r.startupCollege).filter(Boolean)));
    return list.sort();
  }, [lookingForRequests]);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return lookingForRequests.filter(req => {
      // Category filter
      if (activeCategory !== 'all' && req.type !== activeCategory) {
        return false;
      }
      // College filter
      if (selectedCollege !== 'all' && req.startupCollege !== selectedCollege) {
        return false;
      }
      // Compensation filter
      if (selectedCompensation !== 'all' && req.compensationType !== selectedCompensation) {
        return false;
      }
      // Location filter
      if (selectedLocation !== 'all' && req.locationType !== selectedLocation) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = req.title.toLowerCase().includes(q);
        const matchesDesc = req.description.toLowerCase().includes(q);
        const matchesStartup = req.startupName.toLowerCase().includes(q);
        const matchesSkills = req.skillsNeeded?.some(s => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesStartup && !matchesSkills) {
          return false;
        }
      }
      return true;
    });
  }, [lookingForRequests, activeCategory, selectedCollege, selectedCompensation, selectedLocation, searchQuery]);

  const totalResponses = useMemo(() => {
    return lookingForRequests.reduce((acc, r) => acc + (r.responseCount || 0), 0);
  }, [lookingForRequests]);

  const uniqueStartupsCount = useMemo(() => {
    return new Set(lookingForRequests.map(r => r.startupId)).size;
  }, [lookingForRequests]);

  const resetFilters = () => {
    setActiveCategory('all');
    setSelectedCollege('all');
    setSelectedCompensation('all');
    setSelectedLocation('all');
    setSearchQuery('');
  };

  const hasActiveFilters = activeCategory !== 'all' || selectedCollege !== 'all' || selectedCompensation !== 'all' || selectedLocation !== 'all' || !!searchQuery.trim();

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-teal-900 via-teal-800 to-teal-900 text-white pt-10 pb-14 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-700/60 border border-teal-500/40 text-teal-200 text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles size={13} className="text-amber-400" />
                Startup Opportunity & Collaborator Board
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Startup "Looking For" System
              </h1>
              <p className="text-teal-100 text-sm sm:text-base mt-2 leading-relaxed">
                Connect early-stage student startups with co-founders, graphic designers, developers, campus marketers, and beta testers across collegiate networks.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                variant="primary"
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-3 shadow-lg flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                <span>Post a Startup Request</span>
              </Button>
            </div>
          </div>

          {/* Metrics bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-teal-700/60">
            <div className="bg-teal-950/40 backdrop-blur-xs rounded-xl p-3 border border-teal-700/40">
              <div className="text-xl sm:text-2xl font-black text-amber-400">{lookingForRequests.length}</div>
              <div className="text-xs text-teal-200 font-medium">Open Requests</div>
            </div>
            <div className="bg-teal-950/40 backdrop-blur-xs rounded-xl p-3 border border-teal-700/40">
              <div className="text-xl sm:text-2xl font-black text-white">{uniqueStartupsCount}</div>
              <div className="text-xs text-teal-200 font-medium">Startups Hiring/Collabing</div>
            </div>
            <div className="bg-teal-950/40 backdrop-blur-xs rounded-xl p-3 border border-teal-700/40">
              <div className="text-xl sm:text-2xl font-black text-white">{totalResponses}</div>
              <div className="text-xs text-teal-200 font-medium">Student Pitches Sent</div>
            </div>
            <div className="bg-teal-950/40 backdrop-blur-xs rounded-xl p-3 border border-teal-700/40">
              <div className="text-xl sm:text-2xl font-black text-white">{colleges.length}</div>
              <div className="text-xs text-teal-200 font-medium">Campuses Represented</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6">
        {/* Search & Filter Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 mb-6">
          {/* Top row: Search input + dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <div className="md:col-span-2 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by role, startup, skills (e.g. streetwear, Figma, AI, TikTok)..."
                className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Campus dropdown */}
            <div>
              <select
                value={selectedCollege}
                onChange={e => setSelectedCollege(e.target.value)}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500 font-medium"
              >
                <option value="all">All Campuses</option>
                {colleges.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Compensation dropdown */}
            <div>
              <select
                value={selectedCompensation}
                onChange={e => setSelectedCompensation(e.target.value as CompensationType | 'all')}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500 font-medium"
              >
                <option value="all">All Perks / Compensation</option>
                <option value="paid">💰 Paid / Hourly</option>
                <option value="equity">📈 Equity Pool</option>
                <option value="revenue-share">🏷️ Revenue Share</option>
                <option value="free-product">🎁 Free Product / Perks</option>
                <option value="college-credit">🎓 College Credit</option>
                <option value="unpaid-collab">🤝 Mutual Collab</option>
              </select>
            </div>
          </div>

          {/* Category Tabs Strip */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100">
            {CATEGORY_TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
                  }`}
                >
                  <Icon size={13} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="ml-auto text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 shrink-0 px-2 py-1"
              >
                <X size={13} /> Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredRequests.length}</span> {filteredRequests.length === 1 ? 'opportunity' : 'opportunities'}
          </p>
        </div>

        {/* Grid of Looking For Cards */}
        {filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRequests.map(req => (
              <LookingForCard
                key={req.id}
                request={req}
                onRespond={r => setRespondingRequest(r)}
                isOwner={currentUser?.id === req.startupId}
                onStatusChange={(id, status) => updateLookingForRequest(id, { status })}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Search size={24} />
            </div>
            <h3 className="font-bold text-slate-900 text-base">No matching requests found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              We couldn't find any startup opportunities matching your current filters.
            </p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Clear All Filters
              </Button>
              <Button variant="primary" size="sm" onClick={() => setIsCreateModalOpen(true)}>
                Post this Request
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Response Modal */}
      <RespondLookingForModal
        isOpen={!!respondingRequest}
        onClose={() => setRespondingRequest(null)}
        request={respondingRequest}
      />

      {/* Create Modal */}
      <CreateLookingForModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
