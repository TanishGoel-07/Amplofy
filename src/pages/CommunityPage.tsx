import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  Rocket,
  Star,
  Calendar,
  Lightbulb,
  Users,
  ArrowRight,
  Plus,
  ThumbsUp,
  MessageSquare,
  Share2,
  CheckCircle2,
  ExternalLink,
  Tag,
  Building2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { CategoryBadge, VerificationBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';

interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  college: string;
  category: 'Tips & Guides' | 'Campus Events' | 'Project Collabs' | 'Venture Launches';
  title: string;
  content: string;
  date: string;
  likes: number;
  tags: string[];
}

const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    authorName: 'David Wu',
    authorAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
    authorRole: 'Founder @ TechNexus Labs',
    college: 'MIT',
    category: 'Tips & Guides',
    title: 'How we scaled our student dev agency to 20+ campus clients in our junior year',
    content:
      'We started by building small landing pages for campus clubs and student food pop-ups. Key lessons: 1) Keep your scope locked, 2) Set clear delivery milestones using order notes, and 3) Always provide student-friendly flat rates.',
    date: '2 hours ago',
    likes: 42,
    tags: ['WebDev', 'StartupTips', 'StudentFreelance'],
  },
  {
    id: 'post-2',
    authorName: 'Priya Sharma',
    authorAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
    authorRole: 'Head Tutor @ Apex STEM Mentors',
    college: 'Stanford University',
    category: 'Campus Events',
    title: 'Midterm Prep Workshop: Calculus II & Differential Equations Study Marathon',
    content:
      'Join us this Saturday from 2 PM to 6 PM in Green Library Room 204. We will be breaking down past midterm problem sets and offering 1-on-1 problem coaching. Free for all Stanford students!',
    date: 'Yesterday',
    likes: 68,
    tags: ['Math', 'Calculus', 'StudySession'],
  },
  {
    id: 'post-3',
    authorName: 'Maya Lin',
    authorAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
    authorRole: 'Creative Director @ Prisma Studio',
    college: 'RISD / Brown',
    category: 'Venture Launches',
    title: 'Introducing our Free Brand Identity Toolkit for Student Founders',
    content:
      'Starting a campus initiative or tech startup? We packaged a Figma design system kit with 40+ responsive UI components, logo templates, and color palettes optimized for student builders.',
    date: '2 days ago',
    likes: 85,
    tags: ['Design', 'Figma', 'Branding'],
  },
  {
    id: 'post-4',
    authorName: 'Ryan Cooper',
    authorAvatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300',
    authorRole: 'Lead @ DormMove Express',
    college: 'UT Austin',
    category: 'Tips & Guides',
    title: 'Dorm Moving Checklist: 5 things students always forget during semester transitions',
    content:
      '1) Mattress protector bags (campus dollies get dirty!), 2) Labelling boxes by room zone, 3) Booking moving carts at least 2 weeks before finals week, 4) Disassembling bed risers before move day.',
    date: '3 days ago',
    likes: 31,
    tags: ['DormLife', 'Moving', 'CampusTips'],
  },
];

export default function CommunityPage() {
  const { toast } = useToast();
  const { startups, reviews, currentUser } = useApp();

  const [activeSection, setActiveSection] = useState<'feed' | 'startups' | 'reviews'>('feed');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);

  // New post modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<CommunityPost['category']>('Tips & Guides');

  // Filtered posts
  const filteredPosts = filterCategory === 'All'
    ? posts
    : posts.filter(p => p.category === filterCategory);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: currentUser?.name || 'Campus Student',
      authorAvatar: currentUser?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
      authorRole: currentUser?.department || 'Student',
      college: currentUser?.college || 'Campus University',
      category: newCategory,
      title: newTitle.trim(),
      content: newContent.trim(),
      date: 'Just now',
      likes: 1,
      tags: [newCategory.replace(/\s+/g, '')],
    };

    setPosts([newPost, ...posts]);
    setNewTitle('');
    setNewContent('');
    setIsModalOpen(false);
    toast.success('Your post has been published to the Student Hub!');
  };

  const handleLike = (postId: string) => {
    setPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Campus Community</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Student Hub & Venture Spotlights
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Exchange skills, discover campus hackathons, read founder stories, and connect with fellow student innovators.
        </p>
      </div>

      {/* Main Section Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveSection('feed')}
            className={`pb-3 px-3 text-sm font-semibold transition-all flex items-center gap-2 border-b-2 -mb-px ${
              activeSection === 'feed'
                ? 'border-[#0F766E] text-[#0F766E]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student Hub Feed</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
              {posts.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('startups')}
            className={`pb-3 px-3 text-sm font-semibold transition-all flex items-center gap-2 border-b-2 -mb-px ${
              activeSection === 'startups'
                ? 'border-[#0F766E] text-[#0F766E]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Rocket className="w-4 h-4 text-amber-500" />
            <span>Startup Spotlights</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold">
              {startups.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('reviews')}
            className={`pb-3 px-3 text-sm font-semibold transition-all flex items-center gap-2 border-b-2 -mb-px ${
              activeSection === 'reviews'
                ? 'border-[#0F766E] text-[#0F766E]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Campus Reviews</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
              {reviews.length}
            </span>
          </button>
        </div>

        {activeSection === 'feed' && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Share Post</span>
          </Button>
        )}
      </div>

      {/* ========================================================
          SECTION 1: STUDENT HUB FEED
         ======================================================== */}
      {activeSection === 'feed' && (
        <div className="space-y-6">
          {/* Category filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['All', 'Tips & Guides', 'Campus Events', 'Project Collabs', 'Venture Launches'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterCategory === cat
                    ? 'bg-teal-50 text-[#0F766E] border border-teal-200'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map(post => (
              <div
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Author Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar src={post.authorAvatar} name={post.authorName} size="md" />
                      <div>
                        <div className="font-bold text-sm text-slate-900 leading-tight">
                          {post.authorName}
                        </div>
                        <div className="text-xs text-[#0F766E] font-medium">
                          {post.authorRole} • <span className="text-slate-400">{post.college}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">{post.date}</span>
                  </div>

                  {/* Category Pill */}
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                    {post.category}
                  </span>

                  {/* Title & Body */}
                  <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* Footer: Tags & Likes */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map(t => (
                      <span key={t} className="text-[10px] text-slate-400 font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleLike(post.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 hover:text-[#0F766E] hover:bg-teal-50 transition-colors text-xs font-semibold"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{post.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          SECTION 2: STARTUP SPOTLIGHTS
         ======================================================== */}
      {activeSection === 'startups' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {startups.map(st => (
              <div
                key={st.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-32 w-full bg-slate-800 overflow-hidden">
                    <img src={st.coverUrl} alt={st.name} className="w-full h-full object-cover opacity-80" />
                    <div className="absolute top-3 right-3">
                      <CategoryBadge category={st.category} />
                    </div>
                  </div>

                  <div className="p-5 space-y-3 -mt-8">
                    <div className="w-14 h-14 rounded-xl border-2 border-white shadow-md overflow-hidden bg-white">
                      <img src={st.logoUrl} alt={st.name} className="w-full h-full object-cover" />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-base text-slate-900">{st.name}</h4>
                        <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />
                      </div>
                      <p className="text-xs text-slate-400 font-medium">
                        Founded at {st.college} • {st.teamSize} Team Members
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {st.tagline}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{st.rating.toFixed(1)}</span>
                    <span className="text-[11px] text-slate-400 font-normal">({st.reviewCount})</span>
                  </div>

                  <Link
                    to={`/startups/${st.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F766E] hover:underline"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          SECTION 3: VERIFIED CAMPUS REVIEWS
         ======================================================== */}
      {activeSection === 'reviews' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map(r => (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar src={r.reviewerAvatar} name={r.reviewerName} size="sm" />
                    <div>
                      <div className="font-bold text-xs text-slate-900">{r.reviewerName}</div>
                      <div className="text-[11px] text-slate-400">Verified Campus Client</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= r.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-700 italic leading-relaxed">
                  "{r.comment}"
                </p>

                <div className="text-[11px] text-slate-400 pt-1">
                  Posted on {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Create Post */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Share with Campus Community"
        subtitle="Post advice, hackathon announcements, or project collaborations"
        size="md"
      >
        <form onSubmit={handleCreatePost} className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Category
            </label>
            <select
              value={newCategory}
              onChange={e => setNewCategory(e.target.value as any)}
              className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs text-slate-900 border border-slate-200"
            >
              <option value="Tips & Guides">Tips & Guides</option>
              <option value="Campus Events">Campus Events</option>
              <option value="Project Collabs">Project Collabs</option>
              <option value="Venture Launches">Venture Launches</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Post Title
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="e.g. Free peer tutoring study group for CS 106B"
              className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Content / Details
            </label>
            <textarea
              rows={4}
              required
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              placeholder="Share the full details, time, location, or actionable tips..."
              className="w-full bg-slate-50 rounded-xl p-3 text-xs text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Publish Post
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
