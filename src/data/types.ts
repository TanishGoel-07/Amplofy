export type UserRole = 'buyer' | 'seller' | 'admin';

export type ListingType = 'product' | 'pre-owned' | 'digital' | 'service';

export type Category =
  | 'Handmade'
  | 'Fashion'
  | 'Books'
  | 'Electronics'
  | 'Art & Crafts'
  | 'Digital Products'
  | 'Stationery'
  | 'Services'
  | 'Pre-Owned'
  | 'Other';

export type Condition = 'New' | 'Like New' | 'Good' | 'Fair' | 'Pre-Owned' | 'Digital' | 'N/A';

export type ListingStatus = 'draft' | 'pending-review' | 'published' | 'rejected' | 'removed' | 'sold' | 'unavailable';

export type VerificationStatus = 'none' | 'required' | 'pending' | 'verified' | 'failed' | 'expired';

export type TransactionStatus = 'available' | 'offer-received' | 'reserved' | 'sold' | 'unavailable';

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  campus: string;
  verified: boolean;
  verificationStatus: VerificationStatus;
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
