import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Globe,
  Instagram,
  Linkedin,
  Github,
  Mail,
  MessageCircle,
  ExternalLink,
  Star,
  CheckCircle2,
  Users,
  GraduationCap,
  Sparkles,
  ArrowLeft,
  Briefcase,
  Layers,
  Award,
  FolderGit2,
  Handshake,
  Plus,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { CategoryBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import ServiceCard from '@/components/ServiceCard';
import ProductCard from '@/components/ProductCard';
import ContactSellerModal from '@/components/ContactSellerModal';
import OrderQuoteModal from '@/components/OrderQuoteModal';
import { LookingForCard } from '@/components/LookingForCard';
import { RespondLookingForModal } from '@/components/RespondLookingForModal';
import { CreateLookingForModal } from '@/components/CreateLookingForModal';
import type { StartupLookingFor } from '@/data/types';

// Team members generator based on startup owner and campus student network
function getTeamMembers(startupId: string, ownerId: string, college: string) {
  const memberDirectory: Record<
    string,
    Array<{
      name: string;
      role: string;
      department: string;
      avatar: string;
      bio: string;
    }>
  > = {
    'b1111111-1111-4111-b111-111111111111': [
      {
        name: 'David Wu',
        role: 'Co-Founder & Lead Architect',
        department: 'Computer Science',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'Senior CS student at MIT. Full-stack developer with experience at two seed-stage startups.',
      },
      {
        name: 'Marcus Chen',
        role: 'AI / Backend Engineer',
        department: 'EECS & Machine Learning',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'Junior EECS student. Builds scalable Python microservices and LLM integrations.',
      },
      {
        name: 'Liam Patel',
        role: 'Frontend & UI Developer',
        department: 'Software Engineering',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'React and Tailwind specialist. Passionate about fluid web animations and design systems.',
      },
      {
        name: 'Maya Lin',
        role: 'Product Designer (Consultant)',
        department: 'Graphic Design & HCI',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'Design systems lead and UI/UX researcher at RISD / Brown.',
      },
    ],
    'b2222222-2222-4222-b222-222222222222': [
      {
        name: 'Maya Lin',
        role: 'Founder & Creative Director',
        department: 'Graphic Design',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'Award-winning visual designer at RISD / Brown. Brand identities for over 30 campus ventures.',
      },
      {
        name: 'Sarah Mitchell',
        role: 'UI/UX & Brand Specialist',
        department: 'Design & Visual Arts',
        avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'Specializes in mobile product design, Figma wireframing, and user research testing.',
      },
      {
        name: 'David Wu',
        role: 'Technical Strategy Advisor',
        department: 'Computer Science',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'Ensures our digital designs are seamlessly implementable on modern web stacks.',
      },
    ],
    'b3333333-3333-4333-b333-333333333333': [
      {
        name: 'Alex Rivera',
        role: 'Founder & Principal Photographer',
        department: 'Film & Media Studies',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'Cal Berkeley senior with 5+ years of portraiture, event coverage, and commercial photography.',
      },
      {
        name: 'Elena Rostova',
        role: 'Creative Stylist & Retoucher',
        department: 'Visual Arts',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'Fine art photographer and post-processing expert handling Lightroom color grading.',
      },
    ],
    'b4444444-4444-4444-b444-444444444444': [
      {
        name: 'Ryan Cooper',
        role: 'Founder & Operations Lead',
        department: 'Business Administration',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'UT Austin business student. Scaled campus dorm moving logistics to 200+ moves per semester.',
      },
      {
        name: 'Carlos Mendoza',
        role: 'Logistics & Van Fleet Manager',
        department: 'Supply Chain Management',
        avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'Coordinates transport schedules, campus parking permits, and equipment management.',
      },
      {
        name: 'Jordan Hayes',
        role: 'Student Support Coordinator',
        department: 'Communications',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'Handles scheduling, customer inquiries, and move-day dispatch communications.',
      },
    ],
    'b5555555-5555-4555-b555-555555555555': [
      {
        name: 'Priya Sharma',
        role: 'Co-Founder & Head of STEM Tutoring',
        department: 'Applied Mathematics',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'Stanford Math major. Putnam exam honorable mention. 300+ hours of Calculus & Physics coaching.',
      },
      {
        name: 'Marcus Chen',
        role: 'CS & Algorithms Lead Tutor',
        department: 'EECS',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'Peer instructor for Data Structures and Algorithms with top marks in systems courses.',
      },
      {
        name: 'Sophia Lane',
        role: 'Study Skills & Pre-Med Mentor',
        department: 'Psychology & Pre-Med',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'Guides students through Organic Chemistry study schedules and active recall frameworks.',
      },
    ],
    'b6666666-6666-4666-b666-666666666666': [
      {
        name: 'Leo Martinez',
        role: 'Founder & Audio Engineer',
        department: 'Music Production',
        avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'NYU Tisch sound designer, producer, and multi-instrumentalist. Pro Tools & Logic certified.',
      },
      {
        name: 'Elena Rostova',
        role: 'Co-Producer & Vocal Consultant',
        department: 'Visual Arts & Vocal Studies',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: 'Vocal arranger and podcast producer assisting student creators and campus radio programs.',
      },
    ],
  };

  return (
    memberDirectory[startupId] || [
      {
        name: 'Student Founder',
        role: 'Founder & Team Lead',
        department: 'Campus Founder',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
        bio: `Undergraduate student and founder at ${college}. Leading the venture team on campus.`,
      },
    ]
  );
}

// Portfolio items for ventures
const PORTFOLIO_DATA: Record<
  string,
  Array<{
    title: string;
    tag: string;
    description: string;
    image: string;
    date: string;
  }>
> = {
  'b1111111-1111-4111-b111-111111111111': [
    {
      title: 'CampusRide — Peer Carpool Web App',
      tag: 'React / Node.js / Supabase',
      description: 'Built a real-time ride-sharing MVP for MIT students with interactive route maps and verification.',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
      date: 'Fall 2024',
    },
    {
      title: 'DormEats Food Pre-Order Portal',
      tag: 'Next.js / Stripe API',
      description: 'An online meal order queue for campus pop-up kitchens handling 150+ daily lunch orders.',
      image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
      date: 'Spring 2024',
    },
    {
      title: 'Athena AI Study Summarizer',
      tag: 'Python / FastAPI / OpenAI',
      description: 'Lecture transcript summarizer and automated quiz generator used by over 300 students.',
      image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800',
      date: 'Winter 2024',
    },
  ],
  'b2222222-2222-4222-b222-222222222222': [
    {
      title: 'Kinetix Robotics Brand Identity',
      tag: 'Branding / Guidelines / 3D',
      description: 'Complete brand guide, vector mascot, and sponsorship deck for campus engineering competition team.',
      image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=800',
      date: 'Fall 2024',
    },
    {
      title: 'Solaris Energy Pitch Deck & Visuals',
      tag: 'Pitch Deck / Typography',
      description: 'Designed a 14-slide investor deck that helped student founders secure $50K angel grant.',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
      date: 'Spring 2024',
    },
  ],
};

export default function StartupProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const { startups, services, listings, reviews, lookingForRequests, updateLookingForRequest, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'services' | 'products' | 'team' | 'portfolio' | 'reviews' | 'looking-for'>('services');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [respondingRequest, setRespondingRequest] = useState<StartupLookingFor | null>(null);
  const [isCreateLookingForOpen, setIsCreateLookingForOpen] = useState(false);

  // Find startup by slug
  const startup = useMemo(() => {
    return startups.find(s => s.slug === slug);
  }, [startups, slug]);

  if (!startup) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Startup Not Found</h2>
        <p className="text-sm text-slate-500">
          The campus venture you are looking for does not exist or may have been updated.
        </p>
        <Link to="/startups">
          <Button variant="primary" size="md">
            Browse All Startups
          </Button>
        </Link>
      </div>
    );
  }

  // Filter startup services
  const startupServices = useMemo(() => {
    return services.filter(
      s => s.startupId === startup.id || s.sellerId === startup.ownerId
    );
  }, [services, startup]);

  // Filter startup products
  const startupProducts = useMemo(() => {
    return listings.filter(
      l =>
        l.type === 'product' &&
        (l.startupId === startup.id || l.sellerId === startup.ownerId)
    );
  }, [listings, startup]);

  // Filter startup reviews
  const startupReviews = useMemo(() => {
    return reviews.filter(
      r => r.sellerId === startup.ownerId || r.sellerId === startup.id
    );
  }, [reviews, startup]);

  // Filter startup looking for requests
  const startupLookingFor = useMemo(() => {
    return lookingForRequests.filter(
      r => r.startupId === startup.id || r.startupSlug === startup.slug
    );
  }, [lookingForRequests, startup]);

  const team = getTeamMembers(startup.id, startup.ownerId, startup.college);
  const portfolio = PORTFOLIO_DATA[startup.id] || [
    {
      title: `${startup.name} Campus Launch Project`,
      tag: startup.category,
      description: `Flagship student project delivering expert solutions to university clubs and academic cohorts.`,
      image: startup.coverUrl,
      date: '2024',
    },
    {
      title: 'Undergraduate Community Initiative',
      tag: 'Campus Collaboration',
      description: 'Collaborative workshop and student mentorship service organized on campus.',
      image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
      date: '2024',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Cover Banner */}
      <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-slate-900">
        <img
          src={startup.coverUrl}
          alt={startup.name}
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/30 to-transparent" />

        {/* Breadcrumb Back Button */}
        <div className="absolute top-4 left-4 sm:left-8 z-10">
          <Link
            to="/startups"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/70 backdrop-blur-sm text-xs font-semibold text-white border border-white/20 hover:bg-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Startups</span>
          </Link>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Startup Profile Header Card */}
        <div className="relative -mt-16 sm:-mt-20 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            {/* Left: Logo + Info */}
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={startup.logoUrl}
                  alt={startup.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {startup.name}
                  </h1>
                  {startup.isVerified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-[#0F766E] border border-teal-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E]" />
                      Verified Startup
                    </span>
                  )}
                  <CategoryBadge category={startup.category} />
                </div>

                <p className="text-sm font-medium text-slate-600 max-w-2xl leading-relaxed">
                  {startup.tagline}
                </p>

                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5 font-medium text-slate-700">
                    <GraduationCap className="w-4 h-4 text-[#0F766E]" />
                    <span>Founded at {startup.college}</span>
                  </div>
                  <div className="flex items-center gap-1 font-medium text-slate-700">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{startup.teamSize} Team Members</span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-slate-900">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{startup.rating.toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">({startup.reviewCount} campus reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto shrink-0">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setIsContactOpen(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5"
              >
                <Mail className="w-4 h-4 text-[#0F766E]" />
                <span>Contact</span>
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => setIsQuoteOpen(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5"
              >
                <Briefcase className="w-4 h-4 text-white" />
                <span>Request Quote</span>
              </Button>
            </div>
          </div>

          {/* Bio / Description & Social Links Bar */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              {startup.description}
            </p>

            {/* Links */}
            <div className="flex items-center gap-3 shrink-0">
              {startup.website && (
                <a
                  href={startup.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F766E] hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Website</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 text-slate-400" />
                </a>
              )}
              {startup.socialLinks?.instagram && (
                <a
                  href={`https://instagram.com/${startup.socialLinks.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:text-pink-600 flex items-center justify-center transition-colors"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {startup.socialLinks?.linkedin && (
                <a
                  href={`https://linkedin.com/company/${startup.socialLinks.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:text-blue-600 flex items-center justify-center transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {startup.socialLinks?.github && (
                <a
                  href={`https://github.com/${startup.socialLinks.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors"
                  title="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 mb-8 bg-white rounded-t-xl px-2">
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'services'
                  ? 'bg-teal-50 text-[#0F766E]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Services</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-bold">
                {startupServices.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'products'
                  ? 'bg-teal-50 text-[#0F766E]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Products</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-bold">
                {startupProducts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('team')}
              className={`px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'team'
                  ? 'bg-teal-50 text-[#0F766E]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Team</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-bold">
                {team.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'portfolio'
                  ? 'bg-teal-50 text-[#0F766E]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>Portfolio</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-bold">
                {portfolio.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'reviews'
                  ? 'bg-teal-50 text-[#0F766E]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Reviews</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-bold">
                {startup.reviewCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('looking-for')}
              className={`px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'looking-for'
                  ? 'bg-purple-50 text-purple-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Handshake className="w-4 h-4 text-purple-600" />
              <span>Looking For</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">
                {startupLookingFor.length}
              </span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {/* TAB 1: SERVICES */}
          {activeTab === 'services' && (
            <div>
              {startupServices.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {startupServices.map(service => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
                  <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="font-bold text-slate-800">No Services Active</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    This startup hasn't published active service packages at this moment. You can still reach out via custom quote!
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsQuoteOpen(true)}
                  >
                    Request Custom Service Quote
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {activeTab === 'products' && (
            <div>
              {startupProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {startupProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
                  <Layers className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="font-bold text-slate-800">No Physical Goods Listed</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    This venture currently focuses exclusively on professional student services and digital packages.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TEAM */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Venture Founders & Student Leaders
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Meet the students behind {startup.name} building solutions for our university community.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {team.map((member, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 rounded-xl border border-slate-200/80 p-5 flex items-start gap-4 transition-all hover:border-slate-300"
                    >
                      <Avatar
                        src={member.avatar}
                        name={member.name}
                        size="lg"
                        className="border-2 border-white shadow-xs shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-slate-900 text-sm">
                            {member.name}
                          </h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Student
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#0F766E]">
                          {member.role}
                        </p>
                        <p className="text-xs text-slate-400 font-medium">
                          {member.department} • {startup.college}
                        </p>
                        <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                          {member.bio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PORTFOLIO */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portfolio.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs group hover:shadow-md transition-all duration-200"
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900/80 backdrop-blur-sm text-white">
                          {item.tag}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-base text-slate-900">
                          {item.title}
                        </h4>
                        <span className="text-xs text-slate-400 font-medium">
                          {item.date}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Rating Summary Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center gap-6 shadow-xs">
                <div className="text-center sm:text-left sm:border-r sm:border-slate-100 sm:pr-8">
                  <div className="text-4xl font-extrabold text-slate-900">
                    {startup.rating.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1 my-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(startup.rating)
                            ? 'fill-amber-500 text-amber-500'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-slate-500">
                    Based on {startup.reviewCount} verified campus reviews
                  </div>
                </div>

                <div className="flex-1 space-y-2 text-xs text-slate-600 w-full max-w-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-12 font-medium">5 stars</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: '85%' }} />
                    </div>
                    <span className="w-8 text-right text-slate-400 font-semibold">85%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-12 font-medium">4 stars</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: '12%' }} />
                    </div>
                    <span className="w-8 text-right text-slate-400 font-semibold">12%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-12 font-medium">3 stars</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: '3%' }} />
                    </div>
                    <span className="w-8 text-right text-slate-400 font-semibold">3%</span>
                  </div>
                </div>
              </div>

              {/* Review List */}
              <div className="space-y-4">
                {startupReviews.length > 0 ? (
                  startupReviews.map(r => (
                    <div
                      key={r.id}
                      className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={r.reviewerAvatar}
                            name={r.reviewerName}
                            size="md"
                          />
                          <div>
                            <div className="font-bold text-sm text-slate-900">
                              {r.reviewerName}
                            </div>
                            <div className="text-xs text-slate-400">
                              Verified Student Reviewer
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= r.rating
                                  ? 'fill-amber-500 text-amber-500'
                                  : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        "{r.comment}"
                      </p>
                      <div className="text-[11px] text-slate-400">
                        {new Date(r.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-xs text-slate-500">
                    No individual review comments submitted yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: LOOKING FOR */}
          {activeTab === 'looking-for' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Open Collaborator & Team Opportunities
                  </h3>
                  <p className="text-xs text-slate-500">
                    Positions, co-founder calls, and collaboration requests currently open at {startup.name}.
                  </p>
                </div>
                {(currentUser?.id === startup.ownerId || currentUser?.id === startup.id) && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsCreateLookingForOpen(true)}
                    className="flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white"
                  >
                    <Plus size={14} />
                    <span>Post Request</span>
                  </Button>
                )}
              </div>

              {startupLookingFor.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {startupLookingFor.map(req => (
                    <LookingForCard
                      key={req.id}
                      request={req}
                      onRespond={r => setRespondingRequest(r)}
                      isOwner={currentUser?.id === startup.ownerId}
                      onStatusChange={(id, status) => updateLookingForRequest(id, { status })}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
                  <Handshake className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-slate-900 text-sm">No Open Requests Right Now</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {startup.name} hasn't posted any open team or collaborator calls at the moment. You can still reach out via Contact Seller or Custom Quote.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Contact Seller Modal */}
      <ContactSellerModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        seller={{
          name: startup.name,
          avatar: startup.logoUrl,
          college: startup.college,
          accountType: 'startup',
          isVerified: startup.isVerified,
          contactWhatsapp: startup.contactWhatsapp,
          contactEmail: startup.contactEmail,
          contactInstagram: startup.contactInstagram,
          showContact: startup.showContact,
        }}
        listingTitle={`${startup.name} Campus Venture`}
      />

      {/* Request Custom Quote Modal */}
      <OrderQuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        startup={startup}
        mode="quote"
      />

      {/* Looking For Response Modal */}
      <RespondLookingForModal
        isOpen={!!respondingRequest}
        onClose={() => setRespondingRequest(null)}
        request={respondingRequest}
      />

      {/* Create Looking For Modal */}
      <CreateLookingForModal
        isOpen={isCreateLookingForOpen}
        onClose={() => setIsCreateLookingForOpen(false)}
        preselectedStartupId={startup.id}
      />
    </div>
  );
}
