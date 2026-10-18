export type AccountType = 'student' | 'startup' | 'buyer';

export type UserRole = 'buyer' | 'seller' | 'admin';

export type ListingType = 'product' | 'pre-owned' | 'digital' | 'service';

export type Category =
  | 'Handmade'
  | 'Fashion'
  | 'Books'
  | 'Textbooks'
  | 'Electronics'
  | 'Art & Crafts'
  | 'Digital Products'
  | 'Stationery'
  | 'Services'
  | 'Pre-Owned'
  | 'Dorm'
  | 'Tutoring'
  | 'Design'
  | 'Development'
  | 'Photography'
  | 'Labor'
  | 'Coaching'
  | 'Music'
  | 'Marketing'
  | 'Other';

export type Condition = 'New' | 'Like New' | 'Good' | 'Fair' | 'Pre-Owned' | 'Digital' | 'N/A';

export type ListingStatus = 'draft' | 'pending-review' | 'published' | 'live' | 'featured' | 'paused' | 'rejected' | 'removed' | 'sold' | 'unavailable';

export type VerificationStatus = 'none' | 'required' | 'pending' | 'verified' | 'failed' | 'expired';

export type TransactionStatus = 'available' | 'offer-received' | 'reserved' | 'sold' | 'unavailable';

export interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  avatar: string;
  bio: string;
  location: string;
  campus: string;
  college?: string;
  department?: string;
  year?: string;
  verified: boolean;
  isVerified?: boolean;
  verificationStatus: VerificationStatus;
  accountType?: AccountType;
  contactWhatsapp?: string;
  contactEmail?: string;
  contactInstagram?: string;
  showContact?: boolean;
  role: UserRole;
  followers: number;
  following: number;
  joinedDate: string;
  rating: number;
  reviewCount: number;
  listingCount: number;
  course?: string;
  yearOfStudy?: string;
  interests?: string[];
  skills?: string[];
}

export interface Startup {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  logoUrl: string;
  coverUrl: string;
  tagline: string;
  description: string;
  category: string;
  college: string;
  teamSize: number;
  website?: string;
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  contactWhatsapp?: string;
  contactEmail?: string;
  contactInstagram?: string;
  showContact: boolean;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  servicesCount?: number;
  productsCount?: number;
  createdAt: string;
}

export interface StartupMember {
  id: string;
  startupId: string;
  profileId: string;
  role: string;
  profile?: User;
}

export interface ServicePackage {
  id: string;
  listingId: string;
  tier: 'basic' | 'standard' | 'premium';
  title: string;
  price: number;
  deliveryDays: number;
  revisions: number;
  features: string[];
}

export interface Listing {
  id: string;
  sellerId: string;
  type: 'product' | 'service';
  ownerType: 'profile' | 'startup';
  startupId?: string | null;
  startup?: Startup;
  title: string;
  description: string;
  category: string;
  condition?: string;
  status: 'draft' | 'live' | 'featured' | 'paused';
  priceType: 'fixed' | 'hourly' | 'starting_at';
  basePrice: number;
  deliveryDays?: number;
  images: string[];
  location: string;
  distance?: string;
  campus: string;
  rating: number;
  reviewCount: number;
  views: number;
  acceptCustomQuotes?: boolean;
  seller?: {
    id: string;
    name: string;
    avatar: string;
    department?: string;
    college?: string;
    accountType: AccountType;
    isVerified: boolean;
    contactWhatsapp?: string;
    contactEmail?: string;
    contactInstagram?: string;
    showContact: boolean;
  };
  packages?: ServicePackage[];
  createdAt: string;
}

export type OrderStatus =
  | 'inquiry'
  | 'quote_sent'
  | 'accepted'
  | 'in_progress'
  | 'delivered'
  | 'completed'
  | 'reviewed'
  | 'cancelled';

export interface Order {
  id: string;
  listingId: string;
  listingTitle?: string;
  listingImage?: string;
  listingType?: 'product' | 'service';
  packageId?: string | null;
  packageTier?: 'basic' | 'standard' | 'premium';
  buyerId: string;
  buyerName?: string;
  buyerAvatar?: string;
  sellerId: string;
  sellerName?: string;
  sellerAvatar?: string;
  startupId?: string | null;
  startupName?: string;
  status: OrderStatus;
  amount: number;
  inquiryMessage: string;
  createdAt: string;
  notesCount?: number;
}

export interface Quote {
  id: string;
  listingId: string;
  listingTitle?: string;
  buyerId: string;
  buyerName?: string;
  sellerId: string;
  sellerName?: string;
  message: string;
  amount: number;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: string;
}

export interface OrderNote {
  id: string;
  orderId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  body: string;
  attachmentUrl?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  orderId?: string;
  listingId?: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  revieweeId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  condition: Condition;
  listingType: ListingType;
  listingStatus: ListingStatus;
  transactionStatus: TransactionStatus;
  images: string[];
  location: string;
  campus: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerVerified: boolean;
  rating: number;
  reviewCount: number;
  postedDate: string;
  quantity: number;
  tags: string[];
  views: number;
  favourites: number;
  featured?: boolean;
}

export interface Offer {
  id: string;
  productId: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  counterAmount?: number;
  date: string;
  message?: string;
}

export interface WantedRequest {
  id: string;
  title: string;
  description: string;
  category: Category;
  budgetMin?: number;
  budgetMax?: number;
  location?: string;
  campus?: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  requesterVerified: boolean;
  date: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'fulfilled' | 'deleted';
}

export type LookingForCategory =
  | 'co-founder'
  | 'designer-dev'
  | 'marketing'
  | 'beta-testers'
  | 'first-customers'
  | 'product-feedback'
  | 'startup-collab'
  | 'other';

export type CompensationType =
  | 'equity'
  | 'paid'
  | 'stipend'
  | 'revenue-share'
  | 'free-product'
  | 'college-credit'
  | 'unpaid-collab';

export type LookingForLocationType = 'on-campus' | 'remote' | 'hybrid';

export interface StartupLookingFor {
  id: string;
  startupId: string;
  startupName: string;
  startupSlug: string;
  startupLogo: string;
  startupCollege: string;
  startupCategory: string;
  isStartupVerified: boolean;
  type: LookingForCategory;
  title: string;
  description: string;
  skillsNeeded: string[];
  compensationType: CompensationType;
  compensationDetails?: string;
  timeCommitment: string;
  locationType: LookingForLocationType;
  campus?: string;
  status: 'open' | 'filled' | 'paused';
  createdAt: string;
  responseCount: number;
  contactWhatsapp?: string;
  contactEmail?: string;
  contactInstagram?: string;
  showContact: boolean;
}

export interface LookingForResponse {
  id: string;
  requestId: string;
  startupId: string;
  startupName: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantWhatsapp?: string;
  applicantInstagram?: string;
  applicantAvatar: string;
  applicantCollege: string;
  applicantMajor?: string;
  roleOrPitch: string;
  portfolioUrl?: string;
  status: 'pending' | 'reviewed' | 'connected' | 'archived';
  createdAt: string;
}


export interface BlockedUser {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  blockedDate: string;
}

export interface Review {
  id: string;
  productId: string;
  productTitle: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  comment: string;
  date: string;
  verifiedTransaction: boolean;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorVerified: boolean;
  image: string;
  caption: string;
  type: 'product' | 'update' | 'behind-the-scenes' | 'promotion' | 'launch' | 'achievement';
  likes: number;
  comments: Comment[];
  shares: number;
  saved: boolean;
  liked: boolean;
  date: string;
  productId?: string;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  date: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantVerified: boolean;
  productId?: string;
  productTitle?: string;
  productImage?: string;
  messages: Message[];
  lastMessageDate: string;
  unread: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  date: string;
}

export interface NotificationItem {
  id: string;
  type: 'message' | 'follow' | 'like' | 'favourite' | 'review' | 'listing' | 'verification' | 'offer' | 'listing-approved' | 'listing-rejected' | 'verification-expiring';
  title: string;
  description: string;
  date: string;
  read: boolean;
  actorAvatar?: string;
  link?: string;
}

export interface Report {
  id: string;
  type: 'listing' | 'user' | 'message';
  targetId: string;
  targetName: string;
  reason: string;
  description?: string;
  reporterName: string;
  date: string;
  status: 'report-received' | 'under-review' | 'resolved' | 'dismissed' | 'listing-removed' | 'user-warned' | 'user-suspended' | 'user-banned';
}

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  studentType: 'school' | 'college';
  campus: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  documentUploaded: boolean;
}

export interface CategoryInfo {
  name: Category;
  icon: string;
  count: number;
  gradient: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { name: 'Handmade', icon: 'Sparkles', count: 0, gradient: 'from-brand-400 to-brand-600' },
  { name: 'Fashion', icon: 'Shirt', count: 0, gradient: 'from-accent-400 to-accent-600' },
  { name: 'Books', icon: 'BookOpen', count: 0, gradient: 'from-sky-400 to-sky-600' },
  { name: 'Electronics', icon: 'Smartphone', count: 0, gradient: 'from-slate-400 to-slate-600' },
  { name: 'Art & Crafts', icon: 'Palette', count: 0, gradient: 'from-rose-400 to-rose-600' },
  { name: 'Digital Products', icon: 'Monitor', count: 0, gradient: 'from-violet-400 to-violet-600' },
  { name: 'Stationery', icon: 'Pencil', count: 0, gradient: 'from-amber-400 to-amber-600' },
  { name: 'Services', icon: 'Briefcase', count: 0, gradient: 'from-emerald-400 to-emerald-600' },
  { name: 'Pre-Owned', icon: 'Recycle', count: 0, gradient: 'from-teal-400 to-teal-600' },
  { name: 'Other', icon: 'Package', count: 0, gradient: 'from-indigo-400 to-indigo-600' },
];
