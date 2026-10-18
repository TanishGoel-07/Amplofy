import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type {
  Product, Conversation, NotificationItem, Post, User, WantedRequest, Offer,
  BlockedUser, TransactionStatus, Comment,
  Startup, Listing, Order, Quote, OrderNote, Review, OrderStatus,
  StartupLookingFor, LookingForResponse, AccountType,
} from '@/data/types';
import {
  mockStudents, mockStartups, mockProducts, mockServices, mockOrders, mockReviews, mockOrderNotes,
  mockLookingForRequests, mockLookingForResponses,
} from '@/data/mockData';

// ─── DB row types (raw from Supabase) ───
interface ProfileRow {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  campus: string;
  verified: boolean;
  verification_status: string;
  role: string;
  course: string | null;
  year_of_study: string | null;
  interests: string[] | null;
  skills: string[] | null;
  follower_count: number;
  following_count: number;
  listing_count: number;
  rating: number;
  review_count: number;
  created_at: string;
}

interface ProductRow {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  listing_type: string;
  listing_status: string;
  transaction_status: string;
  images: string[] | null;
  location: string;
  campus: string;
  quantity: number;
  tags: string[] | null;
  views: number;
  favourites_count: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

interface ConversationRow {
  id: string;
  participant1_id: string;
  participant2_id: string;
  product_id: string | null;
  product_title: string | null;
  product_image: string | null;
  last_message_at: string;
  created_at: string;
}

interface MessageRow {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  read: boolean;
  created_at: string;
}

interface PostRow {
  id: string;
  author_id: string;
  image: string;
  caption: string;
  type: string;
  product_id: string | null;
  likes_count: number;
  comments_count: number;
  shares: number;
  created_at: string;
}

interface CommentRow {
  id: string;
  post_id: string;
  author_id: string;
  text: string;
  created_at: string;
}

interface OfferRow {
  id: string;
  product_id: string;
  buyer_id: string;
  amount: number;
  status: string;
  counter_amount: number | null;
  message: string | null;
  created_at: string;
}

interface WantedRow {
  id: string;
  requester_id: string;
  title: string;
  description: string;
  category: string;
  budget_min: number | null;
  budget_max: number | null;
  location: string | null;
  campus: string | null;
  expiry_date: string | null;
  status: string;
  created_at: string;
}

interface NotificationRow {
  id: string;
  user_id: string;
  type: string;
  title: string;
  description: string;
  actor_id: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
}

interface BlockedRow {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
}

interface FollowRow {
  id: string;
  follower_id: string;
  followee_id: string;
  created_at: string;
}

interface FavProductRow {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

interface FavSellerRow {
  id: string;
  user_id: string;
  seller_id: string;
  created_at: string;
}

interface SavedPostRow {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

// ─── Mappers (DB row → frontend type) ───
function mapProfile(r: ProfileRow): User {
  return {
    id: r.id,
    name: r.name,
    username: r.username,
    avatar: r.avatar,
    bio: r.bio,
    location: r.location,
    campus: r.campus,
    verified: r.verified,
    verificationStatus: r.verification_status as User['verificationStatus'],
    role: r.role as User['role'],
    followers: r.follower_count,
    following: r.following_count,
    joinedDate: r.created_at.split('T')[0],
    rating: Number(r.rating),
    reviewCount: r.review_count,
    listingCount: r.listing_count,
    course: r.course ?? undefined,
    yearOfStudy: r.year_of_study ?? undefined,
    interests: r.interests ?? undefined,
    skills: r.skills ?? undefined,
  };
}

function mapProduct(
  r: ProductRow,
  seller?: { name: string; avatar: string; verified: boolean },
): Product {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    price: Number(r.price),
    category: r.category as Product['category'],
    condition: r.condition as Product['condition'],
    listingType: r.listing_type as Product['listingType'],
    listingStatus: r.listing_status as Product['listingStatus'],
    transactionStatus: r.transaction_status as Product['transactionStatus'],
    images: r.images ?? [],
    location: r.location,
    campus: r.campus,
    sellerId: r.seller_id,
    sellerName: seller?.name ?? '',
    sellerAvatar: seller?.avatar ?? '',
    sellerVerified: seller?.verified ?? false,
    rating: 0,
    reviewCount: 0,
    postedDate: r.created_at,
    quantity: r.quantity,
    tags: r.tags ?? [],
    views: r.views,
    favourites: r.favourites_count,
    featured: r.featured,
  };
}

// ─── Context interface ───
interface AppState {
  isAuthed: boolean;
  authLoading: boolean;
  currentUser: User | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  deleteAccount: () => Promise<{ error: string | null }>;
  updateProfile: (updates: Partial<User>) => Promise<{ error: string | null }>;

  verificationStatus: 'none' | 'required' | 'pending' | 'verified' | 'failed' | 'expired';
  submitVerification: (data: { studentType: 'school' | 'college'; campus: string; documentFile?: File }) => Promise<{ error: string | null }>;

  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'postedDate'>) => Promise<{ error: string | null; id?: string }>;
  updateProductTransactionStatus: (productId: string, status: TransactionStatus) => Promise<void>;
  deleteProduct: (productId: string) => Promise<{ error: string | null }>;

  wantedRequests: WantedRequest[];
  addWantedRequest: (req: Omit<WantedRequest, 'id' | 'date'>) => Promise<{ error: string | null }>;
  deleteWantedRequest: (id: string) => Promise<{ error: string | null }>;

  offers: Offer[];
  makeOffer: (offer: Omit<Offer, 'id' | 'date' | 'status'>) => Promise<{ error: string | null }>;
  respondToOffer: (offerId: string, status: 'accepted' | 'rejected' | 'countered', counterAmount?: number) => Promise<{ error: string | null }>;

  blockedUsers: BlockedUser[];
  blockUser: (userId: string) => Promise<{ error: string | null }>;
  unblockUser: (userId: string) => Promise<{ error: string | null }>;

  favouriteProducts: string[];
  favouriteSellers: string[];
  savedPosts: string[];
  toggleProductFavourite: (id: string) => Promise<void>;
  toggleSellerFavourite: (id: string) => Promise<void>;
  togglePostSave: (id: string) => Promise<void>;

  following: string[];
  toggleFollow: (id: string) => Promise<void>;

  conversations: Conversation[];
  sendMessage: (conversationId: string, text: string) => Promise<{ error: string | null }>;
  startConversation: (sellerId: string, productId?: string) => Promise<string | null>;

  notifications: NotificationItem[];
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  unreadNotificationCount: number;

  posts: Post[];
  togglePostLike: (id: string) => Promise<void>;
  addComment: (postId: string, text: string) => Promise<{ error: string | null }>;

  // Campus marketplace entities
  startups: Startup[];
  services: Listing[];
  listings: Listing[];
  orders: Order[];
  quotes: Quote[];
  orderNotes: OrderNote[];
  reviews: Review[];
  // Startup Looking For system
  lookingForRequests: StartupLookingFor[];
  lookingForResponses: LookingForResponse[];
  addLookingForRequest: (req: Partial<StartupLookingFor>) => Promise<{ error: string | null; id?: string }>;
  updateLookingForRequest: (id: string, updates: Partial<StartupLookingFor>) => Promise<void>;
  deleteLookingForRequest: (id: string) => Promise<void>;
  addLookingForResponse: (res: Partial<LookingForResponse>) => Promise<{ error: string | null; id?: string }>;
  updateLookingForResponseStatus: (id: string, status: LookingForResponse['status']) => Promise<void>;
  getStartupBySlug: (slug: string) => Startup | undefined;
  getListingById: (id: string) => Listing | undefined;
  addListing: (listing: Partial<Listing>) => Promise<{ error: string | null; id?: string }>;
  updateListingStatus: (id: string, status: 'draft' | 'live' | 'featured' | 'paused') => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  createOrder: (order: Partial<Order>) => Promise<{ error: string | null; id?: string }>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  addOrderNote: (note: Partial<OrderNote>) => Promise<{ error: string | null; id?: string }>;
  addReview: (review: Partial<Review>) => Promise<{ error: string | null; id?: string }>;
  createStartup: (startup: Partial<Startup>) => Promise<{ error: string | null; startup?: Startup }>;
  registerCampusUser: (params: {
    name: string;
    email: string;
    password?: string;
    accountType: AccountType;
    college: string;
    department?: string;
    year?: string;
    contactWhatsapp?: string;
    contactEmail?: string;
    contactInstagram?: string;
    showContact?: boolean;
    isVerified?: boolean;
    startupData?: Partial<Startup>;
  }) => Promise<{ error: string | null; user?: User }>;

  // helpers
  getProfileById: (id: string) => Promise<User | null>;
  fetchProfilesByIds: (ids: string[]) => Promise<User[]>;
  searchProfiles: (query: string) => Promise<User[]>;
  fetchCreators: (limit?: number) => Promise<User[]>;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => mockStudents[0]);
  const [isAuthed, setIsAuthed] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'none' | 'required' | 'pending' | 'verified' | 'failed' | 'expired'>('verified');

  const [listings, setListings] = useState<Listing[]>(() => [...mockProducts, ...mockServices]);
  const [services, setServices] = useState<Listing[]>(() => mockServices);
  const [startups, setStartups] = useState<Startup[]>(() => mockStartups);
  const [orders, setOrders] = useState<Order[]>(() => mockOrders);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [orderNotes, setOrderNotes] = useState<OrderNote[]>(() => mockOrderNotes);
  const [reviews, setReviews] = useState<Review[]>(() => mockReviews);
  const [lookingForRequests, setLookingForRequests] = useState<StartupLookingFor[]>(() => mockLookingForRequests);
  const [lookingForResponses, setLookingForResponses] = useState<LookingForResponse[]>(() => mockLookingForResponses);

  const [products, setProducts] = useState<Product[]>(() =>
    mockProducts.map(l => ({
      id: l.id,
      title: l.title,
      description: l.description,
      price: l.basePrice,
      category: l.category as Product['category'],
      condition: (l.condition || 'New') as Product['condition'],
      listingType: 'product',
      listingStatus: 'published',
      transactionStatus: 'available',
      images: l.images,
      location: l.location,
      campus: l.campus,
      sellerId: l.sellerId,
      sellerName: l.seller?.name || '',
      sellerAvatar: l.seller?.avatar || '',
      sellerVerified: l.seller?.isVerified || false,
      rating: l.rating,
      reviewCount: l.reviewCount,
      postedDate: l.createdAt,
      quantity: 1,
      tags: [l.category, l.ownerType],
      views: l.views,
      favourites: 0,
      featured: l.status === 'featured',
    }))
  );
  const [wantedRequests, setWantedRequests] = useState<WantedRequest[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [favouriteProducts, setFavouriteProducts] = useState<string[]>([]);
  const [favouriteSellers, setFavouriteSellers] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<string[]>([]);

  // ─── Profile cache for mapping products/posts ───
  const [profileCache, setProfileCache] = useState<Record<string, { name: string; avatar: string; verified: boolean }>>({});

  const fetchProfile = useCallback(async (id: string): Promise<{ name: string; avatar: string; verified: boolean } | null> => {
    if (profileCache[id]) return profileCache[id];
    const { data, error } = await supabase
      .from('profiles')
      .select('name, avatar, verified')
      .eq('id', id)
      .maybeSingle();
    if (error || !data) return null;
    const entry = { name: data.name, avatar: data.avatar, verified: data.verified };
    setProfileCache(prev => ({ ...prev, [id]: entry }));
    return entry;
  }, [profileCache]);

  const getProfileById = useCallback(async (id: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error || !data) return null;
    return mapProfile(data as ProfileRow);
  }, []);

  const fetchProfilesByIds = useCallback(async (ids: string[]): Promise<User[]> => {
    if (ids.length === 0) return [];
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('id', ids);
    if (error || !data) return [];
    return data.map((r: ProfileRow) => mapProfile(r));
  }, []);

  const searchProfiles = useCallback(async (query: string): Promise<User[]> => {
    if (!query.trim()) return [];
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`name.ilike.%${query}%,username.ilike.%${query}%,bio.ilike.%${query}%`)
      .limit(20);
    if (error || !data) return [];
    return data.map((r: ProfileRow) => mapProfile(r));
  }, []);

  const fetchCreators = useCallback(async (limit = 6): Promise<User[]> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('follower_count', { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    let creators = data.map((r: ProfileRow) => mapProfile(r));
    if (currentUser) {
      creators = creators.filter(u => u.id !== currentUser.id);
    }
    return creators;
  }, [currentUser]);

  // ─── Load public data (products, wanted, posts) ───
  const loadPublicData = useCallback(async () => {
    // Products with published status
    const { data: productRows } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (productRows) {
      const sellerIds = [...new Set(productRows.map((r: ProductRow) => r.seller_id))];
      const { data: sellers } = await supabase
        .from('profiles')
        .select('id, name, avatar, verified')
        .in('id', sellerIds);
      const sellerMap: Record<string, { name: string; avatar: string; verified: boolean }> = {};
      for (const s of sellers ?? []) {
        sellerMap[s.id] = { name: s.name, avatar: s.avatar, verified: s.verified };
      }
      setProfileCache(prev => ({ ...prev, ...sellerMap }));
      setProducts(productRows.map((r: ProductRow) => mapProduct(r, sellerMap[r.seller_id])));
    }

    // Wanted requests
    const { data: wantedRows } = await supabase
      .from('wanted_requests')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    if (wantedRows) {
      const reqIds = [...new Set(wantedRows.map((r: WantedRow) => r.requester_id))];
      const { data: reqProfiles } = await supabase
        .from('profiles')
        .select('id, name, avatar, verified')
        .in('id', reqIds);
      const reqMap: Record<string, { name: string; avatar: string; verified: boolean }> = {};
      for (const s of reqProfiles ?? []) {
        reqMap[s.id] = { name: s.name, avatar: s.avatar, verified: s.verified };
      }
      setWantedRequests(wantedRows.map((r: WantedRow) => {
        const p = reqMap[r.requester_id];
        return {
          id: r.id,
          title: r.title,
          description: r.description,
          category: r.category as WantedRequest['category'],
          budgetMin: r.budget_min ?? undefined,
          budgetMax: r.budget_max ?? undefined,
          location: r.location ?? undefined,
          campus: r.campus ?? undefined,
          requesterId: r.requester_id,
          requesterName: p?.name ?? '',
          requesterAvatar: p?.avatar ?? '',
          requesterVerified: p?.verified ?? false,
          date: r.created_at,
          expiryDate: r.expiry_date ?? '',
          status: r.status as WantedRequest['status'],
        };
      }));
    }

    // Posts
    const { data: postRows } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (postRows) {
      const authorIds = [...new Set(postRows.map((r: PostRow) => r.author_id))];
      const { data: authors } = await supabase
        .from('profiles')
        .select('id, name, avatar, verified')
        .in('id', authorIds);
      const authorMap: Record<string, { name: string; avatar: string; verified: boolean }> = {};
      for (const a of authors ?? []) {
        authorMap[a.id] = { name: a.name, avatar: a.avatar, verified: a.verified };
      }
      // Fetch comments for all posts
      const postIds = postRows.map((r: PostRow) => r.id);
      const { data: commentRows } = await supabase
        .from('comments')
        .select('*')
        .in('post_id', postIds)
        .order('created_at', { ascending: true });
      const commentsByPost: Record<string, Comment[]> = {};
      for (const c of commentRows ?? []) {
        const cr = c as CommentRow;
        const author = authorMap[cr.author_id];
        if (!commentsByPost[cr.post_id]) commentsByPost[cr.post_id] = [];
        commentsByPost[cr.post_id].push({
          id: cr.id,
          authorId: cr.author_id,
          authorName: author?.name ?? '',
          authorAvatar: author?.avatar ?? '',
          text: cr.text,
          date: cr.created_at,
        });
      }
      // Fetch user's liked posts
      if (currentUser) {
        const { data: likedRows } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', currentUser.id);
        setLikedPostIds((likedRows ?? []).map((l: { post_id: string }) => l.post_id));
        // Fetch saved posts
        const { data: savedRows } = await supabase
          .from('saved_posts')
          .select('post_id')
          .eq('user_id', currentUser.id);
        setSavedPosts((savedRows ?? []).map((s: { post_id: string }) => s.post_id));
      }
      setPosts(postRows.map((r: PostRow) => {
        const a = authorMap[r.author_id];
        return {
          id: r.id,
          authorId: r.author_id,
          authorName: a?.name ?? '',
          authorAvatar: a?.avatar ?? '',
          authorVerified: a?.verified ?? false,
          image: r.image,
          caption: r.caption,
          type: r.type as Post['type'],
          likes: r.likes_count,
          comments: commentsByPost[r.id] ?? [],
          shares: r.shares,
          saved: false,
          liked: false,
          date: r.created_at,
          productId: r.product_id ?? undefined,
        };
      }));
    }
  }, [currentUser]);

  // ─── Load user-specific data ───
  const loadUserData = useCallback(async (userId: string) => {
    // Favourite products
    const { data: favProds } = await supabase
      .from('favourite_products')
      .select('product_id')
      .eq('user_id', userId);
    setFavouriteProducts((favProds ?? []).map((f: { product_id: string }) => f.product_id));

    // Favourite sellers
    const { data: favSellers } = await supabase
      .from('favourite_sellers')
      .select('seller_id')
      .eq('user_id', userId);
    setFavouriteSellers((favSellers ?? []).map((f: { seller_id: string }) => f.seller_id));

    // Following
    const { data: followRows } = await supabase
      .from('follows')
      .select('followee_id')
      .eq('follower_id', userId);
    setFollowing((followRows ?? []).map((f: { followee_id: string }) => f.followee_id));

    // Blocked users
    const { data: blockRows } = await supabase
      .from('blocked_users')
      .select('blocked_id, created_at')
      .eq('blocker_id', userId);
    const blockedRows = (blockRows ?? []) as { blocked_id: string; created_at: string }[];
    const blockedIds = blockedRows.map(b => b.blocked_id);
    if (blockedIds.length > 0) {
      const { data: blockedProfiles } = await supabase
        .from('profiles')
        .select('id, name, avatar')
        .in('id', blockedIds);
      setBlockedUsers((blockedProfiles ?? []).map((p: { id: string; name: string; avatar: string }, i: number) => ({
        id: `${p.id}-${i}`,
        userId: p.id,
        userName: p.name,
        userAvatar: p.avatar,
        blockedDate: blockedRows[i]?.created_at ?? new Date().toISOString(),
      })));
    } else {
      setBlockedUsers([]);
    }

    // Conversations with messages
    const { data: convRows } = await supabase
      .from('conversations')
      .select('*')
      .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
      .order('last_message_at', { ascending: false });
    if (convRows && convRows.length > 0) {
      const convs: Conversation[] = [];
      for (const cr of convRows as ConversationRow[]) {
        const otherId = cr.participant1_id === userId ? cr.participant2_id : cr.participant1_id;
        const { data: otherProfile } = await supabase
          .from('profiles')
          .select('name, avatar, verified')
          .eq('id', otherId)
          .maybeSingle();
        const { data: msgRows } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', cr.id)
          .order('created_at', { ascending: true });
        const msgs = (msgRows ?? []).map((m: MessageRow) => ({
          id: m.id,
          senderId: m.sender_id,
          text: m.text,
          date: m.created_at,
        }));
        const unread = (msgRows ?? []).filter((m: MessageRow) => !m.read && m.sender_id !== userId).length;
        convs.push({
          id: cr.id,
          participantId: otherId,
          participantName: otherProfile?.name ?? '',
          participantAvatar: otherProfile?.avatar ?? '',
          participantVerified: otherProfile?.verified ?? false,
          productId: cr.product_id ?? undefined,
          productTitle: cr.product_title ?? undefined,
          productImage: cr.product_image ?? undefined,
          messages: msgs,
          lastMessageDate: cr.last_message_at ?? cr.created_at,
          unread,
        });
      }
      setConversations(convs);
    } else {
      setConversations([]);
    }

    // Offers (where user is buyer or seller)
    const { data: offerRows } = await supabase
      .from('offers')
      .select('*, products!inner(seller_id)')
      .or(`buyer_id.eq.${userId}`);
    // Also get offers on user's products
    const { data: sellerOffers } = await supabase
      .from('offers')
      .select('*')
      .in('product_id', (
        await supabase.from('products').select('id').eq('seller_id', userId)
      ).data?.map((p: { id: string }) => p.id) ?? []);
    const allOffers = [...(offerRows ?? []), ...(sellerOffers ?? [])];
    const uniqueOffers = allOffers.filter((o, i, arr) => arr.findIndex((x) => x.id === o.id) === i);
    if (uniqueOffers.length > 0) {
      const buyerIds = [...new Set(uniqueOffers.map((o: OfferRow) => o.buyer_id))];
      const { data: buyerProfiles } = await supabase
        .from('profiles')
        .select('id, name, avatar')
        .in('id', buyerIds);
      const buyerMap: Record<string, { name: string; avatar: string }> = {};
      for (const b of buyerProfiles ?? []) {
        buyerMap[b.id] = { name: b.name, avatar: b.avatar };
      }
      setOffers(uniqueOffers.map((o: OfferRow) => {
        const b = buyerMap[o.buyer_id];
        return {
          id: o.id,
          productId: o.product_id,
          buyerId: o.buyer_id,
          buyerName: b?.name ?? '',
          buyerAvatar: b?.avatar ?? '',
          amount: Number(o.amount),
          status: o.status as Offer['status'],
          counterAmount: o.counter_amount ? Number(o.counter_amount) : undefined,
          date: o.created_at,
          message: o.message ?? undefined,
        };
      }));
    } else {
      setOffers([]);
    }

    // Notifications
    const { data: notifRows } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    setNotifications((notifRows ?? []).map((n: NotificationRow) => ({
      id: n.id,
      type: n.type as NotificationItem['type'],
      title: n.title,
      description: n.description,
      date: n.created_at,
      read: n.read,
      link: n.link ?? undefined,
    })));
  }, []);

  // ─── Auth state listener + initial load ───
  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        (async () => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          if (profile && mounted) {
            const u = mapProfile(profile as ProfileRow);
            setCurrentUser(u);
            setVerificationStatus(u.verificationStatus);
            setIsAuthed(true);
            await loadUserData(u.id);
          }
          setAuthLoading(false);
        })();
      } else {
        setAuthLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          if (profile && mounted) {
            const u = mapProfile(profile as ProfileRow);
            setCurrentUser(u);
            setVerificationStatus(u.verificationStatus);
            setIsAuthed(true);
            await loadUserData(u.id);
          }
        } else {
          setCurrentUser(null);
          setIsAuthed(false);
          setVerificationStatus('none');
          setConversations([]);
          setNotifications([]);
          setOffers([]);
          setBlockedUsers([]);
          setFavouriteProducts([]);
          setFavouriteSellers([]);
          setSavedPosts([]);
          setFollowing([]);
          setLikedPostIds([]);
        }
        setAuthLoading(false);
      })();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load public data on mount and when currentUser changes (for likes/saves)
  useEffect(() => {
    loadPublicData();
  }, [loadPublicData]);

  // ─── Auth methods ───
  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) return { error: error.message };
    if (!data.user) return { error: 'Account creation failed. Please try again.' };
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setIsAuthed(false);
    setVerificationStatus('none');
    setConversations([]);
    setNotifications([]);
    setOffers([]);
    setBlockedUsers([]);
    setFavouriteProducts([]);
    setFavouriteSellers([]);
    setSavedPosts([]);
    setFollowing([]);
    setLikedPostIds([]);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return { error: error.message };
    return { error: null };
  }, []);

  const deleteAccount = useCallback(async () => {
    if (!currentUser) return { error: 'Not signed in.' };
    const { error } = await supabase.auth.signOut();
    // Note: actual user deletion from auth.users requires admin/service role
    // For now, we sign out and clear local state. Full deletion would need an edge function.
    if (error) return { error: error.message };
    setCurrentUser(null);
    setIsAuthed(false);
    setVerificationStatus('none');
    return { error: null };
  }, [currentUser]);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!currentUser) return { error: 'Not signed in.' };
    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.username !== undefined) dbUpdates.username = updates.username;
    if (updates.avatar !== undefined) dbUpdates.avatar = updates.avatar;
    if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
    if (updates.location !== undefined) dbUpdates.location = updates.location;
    if (updates.campus !== undefined) dbUpdates.campus = updates.campus;
    if (updates.course !== undefined) dbUpdates.course = updates.course;
    if (updates.yearOfStudy !== undefined) dbUpdates.year_of_study = updates.yearOfStudy;
    if (updates.interests !== undefined) dbUpdates.interests = updates.interests;
    if (updates.skills !== undefined) dbUpdates.skills = updates.skills;
    if (updates.accountType !== undefined) dbUpdates.account_type = updates.accountType;
    if (updates.college !== undefined) dbUpdates.college = updates.college;
    if (updates.department !== undefined) dbUpdates.department = updates.department;
    if (updates.year !== undefined) dbUpdates.year = updates.year;
    if (updates.isVerified !== undefined) {
      dbUpdates.is_verified = updates.isVerified;
      dbUpdates.verified = updates.isVerified;
    }
    if (updates.contactWhatsapp !== undefined) dbUpdates.contact_whatsapp = updates.contactWhatsapp;
    if (updates.contactEmail !== undefined) dbUpdates.contact_email = updates.contactEmail;
    if (updates.contactInstagram !== undefined) dbUpdates.contact_instagram = updates.contactInstagram;
    if (updates.showContact !== undefined) dbUpdates.show_contact = updates.showContact;

    const { error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', currentUser.id);
    if (error) return { error: error.message };
    setCurrentUser(prev => prev ? { ...prev, ...updates } : prev);
    return { error: null };
  }, [currentUser]);

  // ─── Verification ───
  const submitVerification = useCallback(async (data: {
    studentType: 'school' | 'college';
    campus: string;
    documentFile?: File;
  }) => {
    if (!currentUser) return { error: 'Not signed in.' };

    let documentPath: string | null = null;

    if (data.documentFile) {
      const filePath = `${currentUser.id}/${Date.now()}-${data.documentFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('verification-documents')
        .upload(filePath, data.documentFile);
      if (uploadError) return { error: uploadError.message };
      documentPath = filePath;
    }

    const { error: insertError } = await supabase
      .from('verification_requests')
      .insert({
        user_id: currentUser.id,
        student_type: data.studentType,
        campus: data.campus,
        document_path: documentPath,
        status: 'pending',
      });
    if (insertError) return { error: insertError.message };

    // Update profile verification status
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ verification_status: 'pending' })
      .eq('id', currentUser.id);
    if (profileError) return { error: profileError.message };

    setVerificationStatus('pending');
    setCurrentUser(prev => prev ? { ...prev, verificationStatus: 'pending' } : prev);
    return { error: null };
  }, [currentUser]);

  // ─── Products ───
  const addProduct = useCallback(async (product: Omit<Product, 'id' | 'postedDate'>) => {
    if (!currentUser) return { error: 'Not signed in.' };
    const { data, error } = await supabase
      .from('products')
      .insert({
        seller_id: currentUser.id,
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        condition: product.condition,
        listing_type: product.listingType,
        listing_status: product.listingStatus,
        transaction_status: product.transactionStatus,
        images: product.images,
        location: product.location,
        campus: product.campus,
        quantity: product.quantity,
        tags: product.tags,
      })
      .select()
      .single();
    if (error) return { error: error.message };
    // Add to local state
    setProducts(prev => [mapProduct(data as ProductRow, {
      name: currentUser.name,
      avatar: currentUser.avatar,
      verified: currentUser.verified,
    }), ...prev]);
    return { error: null, id: data.id };
  }, [currentUser]);

  const updateProductTransactionStatus = useCallback(async (productId: string, status: TransactionStatus) => {
    const { error } = await supabase
      .from('products')
      .update({ transaction_status: status })
      .eq('id', productId);
    if (error) {
      console.error('Failed to update transaction status:', error.message);
      return;
    }
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, transactionStatus: status } : p));
  }, []);

  const deleteProduct = useCallback(async (productId: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
    if (error) return { error: error.message };
    setProducts(prev => prev.filter(p => p.id !== productId));
    return { error: null };
  }, []);

  // ─── Wanted Requests ───
  const addWantedRequest = useCallback(async (req: Omit<WantedRequest, 'id' | 'date'>) => {
    if (!currentUser) return { error: 'Not signed in.' };
    const { data, error } = await supabase
      .from('wanted_requests')
      .insert({
        requester_id: currentUser.id,
        title: req.title,
        description: req.description,
        category: req.category,
        budget_min: req.budgetMin,
        budget_max: req.budgetMax,
        location: req.location,
        campus: req.campus,
        expiry_date: req.expiryDate,
        status: 'active',
      })
      .select()
      .single();
    if (error) return { error: error.message };
    setWantedRequests(prev => [{
      id: data.id,
      title: req.title,
      description: req.description,
      category: req.category,
      budgetMin: req.budgetMin,
      budgetMax: req.budgetMax,
      location: req.location,
      campus: req.campus,
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      requesterAvatar: currentUser.avatar,
      requesterVerified: currentUser.verified,
      date: data.created_at,
      expiryDate: req.expiryDate,
      status: 'active',
    }, ...prev]);
    return { error: null };
  }, [currentUser]);

  const deleteWantedRequest = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('wanted_requests')
      .delete()
      .eq('id', id);
    if (error) return { error: error.message };
    setWantedRequests(prev => prev.filter(r => r.id !== id));
    return { error: null };
  }, []);

  // ─── Offers ───
  const makeOffer = useCallback(async (offer: Omit<Offer, 'id' | 'date' | 'status'>) => {
    if (!currentUser) return { error: 'Not signed in.' };
    const { data, error } = await supabase
      .from('offers')
      .insert({
        product_id: offer.productId,
        buyer_id: currentUser.id,
        amount: offer.amount,
        status: 'pending',
        message: offer.message,
      })
      .select()
      .single();
    if (error) return { error: error.message };

    // Create notification for seller
    const { data: product } = await supabase
      .from('products')
      .select('seller_id, title')
      .eq('id', offer.productId)
      .maybeSingle();
    if (product) {
      await supabase.from('notifications').insert({
        user_id: product.seller_id,
        type: 'offer',
        title: 'New offer received',
        description: `${currentUser.name} offered ₹${offer.amount} for ${product.title}`,
        actor_id: currentUser.id,
        link: `/product/${offer.productId}`,
      });
    }

    setOffers(prev => [...prev, {
      id: data.id,
      productId: offer.productId,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerAvatar: currentUser.avatar,
      amount: offer.amount,
      status: 'pending',
      date: data.created_at,
      message: offer.message,
    }]);
    return { error: null };
  }, [currentUser]);

  const respondToOffer = useCallback(async (offerId: string, status: 'accepted' | 'rejected' | 'countered', counterAmount?: number) => {
    const updateData: Record<string, unknown> = { status };
    if (counterAmount !== undefined) updateData.counter_amount = counterAmount;
    const { error } = await supabase
      .from('offers')
      .update(updateData)
      .eq('id', offerId);
    if (error) return { error: error.message };

    setOffers(prev => prev.map(o => o.id === offerId ? {
      ...o,
      status,
      counterAmount: counterAmount ?? o.counterAmount,
    } : o));
    return { error: null };
  }, []);

  // ─── Blocked Users ───
  const blockUser = useCallback(async (userId: string) => {
    if (!currentUser) return { error: 'Not signed in.' };
    const { data, error } = await supabase
      .from('blocked_users')
      .insert({ blocker_id: currentUser.id, blocked_id: userId })
      .select()
      .single();
    if (error) return { error: error.message };

    const { data: profile } = await supabase
      .from('profiles')
      .select('name, avatar')
      .eq('id', userId)
      .maybeSingle();
    setBlockedUsers(prev => [...prev, {
      id: data.id,
      userId,
      userName: profile?.name ?? '',
      userAvatar: profile?.avatar ?? '',
      blockedDate: data.created_at,
    }]);
    return { error: null };
  }, [currentUser]);

  const unblockUser = useCallback(async (userId: string) => {
    if (!currentUser) return { error: 'Not signed in.' };
    const { error } = await supabase
      .from('blocked_users')
      .delete()
      .eq('blocker_id', currentUser.id)
      .eq('blocked_id', userId);
    if (error) return { error: error.message };
    setBlockedUsers(prev => prev.filter(b => b.userId !== userId));
    return { error: null };
  }, [currentUser]);

  // ─── Favourites ───
  const toggleProductFavourite = useCallback(async (id: string) => {
    if (!currentUser) return;
    const isFav = favouriteProducts.includes(id);
    if (isFav) {
      await supabase.from('favourite_products').delete().eq('user_id', currentUser.id).eq('product_id', id);
      setFavouriteProducts(prev => prev.filter(f => f !== id));
    } else {
      await supabase.from('favourite_products').insert({ user_id: currentUser.id, product_id: id });
      setFavouriteProducts(prev => [...prev, id]);
    }
  }, [currentUser, favouriteProducts]);

  const toggleSellerFavourite = useCallback(async (id: string) => {
    if (!currentUser) return;
    const isFav = favouriteSellers.includes(id);
    if (isFav) {
      await supabase.from('favourite_sellers').delete().eq('user_id', currentUser.id).eq('seller_id', id);
      setFavouriteSellers(prev => prev.filter(f => f !== id));
    } else {
      await supabase.from('favourite_sellers').insert({ user_id: currentUser.id, seller_id: id });
      setFavouriteSellers(prev => [...prev, id]);
    }
  }, [currentUser, favouriteSellers]);

  const togglePostSave = useCallback(async (id: string) => {
    if (!currentUser) return;
    const isSaved = savedPosts.includes(id);
    if (isSaved) {
      await supabase.from('saved_posts').delete().eq('user_id', currentUser.id).eq('post_id', id);
      setSavedPosts(prev => prev.filter(f => f !== id));
    } else {
      await supabase.from('saved_posts').insert({ user_id: currentUser.id, post_id: id });
      setSavedPosts(prev => [...prev, id]);
    }
  }, [currentUser, savedPosts]);

  // ─── Following ───
  const toggleFollow = useCallback(async (id: string) => {
    if (!currentUser) return;
    const isFollowing = following.includes(id);
    if (isFollowing) {
      await supabase.from('follows').delete().eq('follower_id', currentUser.id).eq('followee_id', id);
      setFollowing(prev => prev.filter(f => f !== id));
    } else {
      await supabase.from('follows').insert({ follower_id: currentUser.id, followee_id: id });
      setFollowing(prev => [...prev, id]);
      // Create notification
      await supabase.from('notifications').insert({
        user_id: id,
        type: 'follow',
        title: 'New follower',
        description: `${currentUser.name} started following you`,
        actor_id: currentUser.id,
      });
    }
  }, [currentUser, following]);

  // ─── Messaging ───
  const startConversation = useCallback(async (sellerId: string, productId?: string): Promise<string | null> => {
    if (!currentUser) return null;

    // Check if conversation already exists between these two users
    const { data: existing } = await supabase
      .from('conversations')
      .select('*')
      .or(`and(participant1_id.eq.${currentUser.id},participant2_id.eq.${sellerId}),and(participant1_id.eq.${sellerId},participant2_id.eq.${currentUser.id})`)
      .maybeSingle();

    if (existing) return existing.id;

    // Get product info if applicable
    let productTitle: string | null = null;
    let productImage: string | null = null;
    if (productId) {
      const { data: product } = await supabase
        .from('products')
        .select('title, images')
        .eq('id', productId)
        .maybeSingle();
      if (product) {
        productTitle = product.title;
        productImage = product.images?.[0] ?? null;
      }
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        participant1_id: currentUser.id,
        participant2_id: sellerId,
        product_id: productId ?? null,
        product_title: productTitle,
        product_image: productImage,
      })
      .select()
      .single();
    if (error) return null;

    // Add to local state
    const { data: sellerProfile } = await supabase
      .from('profiles')
      .select('name, avatar, verified')
      .eq('id', sellerId)
      .maybeSingle();
    setConversations(prev => [{
      id: data.id,
      participantId: sellerId,
      participantName: sellerProfile?.name ?? '',
      participantAvatar: sellerProfile?.avatar ?? '',
      participantVerified: sellerProfile?.verified ?? false,
      productId: productId,
      productTitle: productTitle ?? undefined,
      productImage: productImage ?? undefined,
      messages: [],
      lastMessageDate: data.created_at,
      unread: 0,
    }, ...prev]);

    return data.id;
  }, [currentUser]);

  const sendMessage = useCallback(async (conversationId: string, text: string) => {
    if (!currentUser) return { error: 'Not signed in.' };
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: currentUser.id,
        text,
      })
      .select()
      .single();
    if (error) return { error: error.message };

    // Update conversation's last_message_at
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversationId);

    // Create notification for the other participant
    const conv = conversations.find(c => c.id === conversationId);
    if (conv) {
      await supabase.from('notifications').insert({
        user_id: conv.participantId,
        type: 'message',
        title: 'New message',
        description: `${currentUser.name}: ${text.slice(0, 50)}`,
        actor_id: currentUser.id,
        link: '/messages',
      });
    }

    setConversations(prev => prev.map(c => c.id === conversationId ? {
      ...c,
      messages: [...c.messages, {
        id: data.id,
        senderId: currentUser.id,
        text,
        date: data.created_at,
      }],
      lastMessageDate: data.created_at,
    } : c));
    return { error: null };
  }, [currentUser, conversations]);

  // ─── Notifications ───
  const markNotificationRead = useCallback(async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    if (!currentUser) return;
    await supabase.from('notifications').update({ read: true }).eq('user_id', currentUser.id).eq('read', false);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, [currentUser]);

  // ─── Posts ───
  const togglePostLike = useCallback(async (id: string) => {
    if (!currentUser) return;
    const isLiked = likedPostIds.includes(id);
    if (isLiked) {
      await supabase.from('post_likes').delete().eq('user_id', currentUser.id).eq('post_id', id);
      setLikedPostIds(prev => prev.filter(l => l !== id));
      setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: Math.max(0, p.likes - 1), liked: false } : p));
    } else {
      await supabase.from('post_likes').insert({ user_id: currentUser.id, post_id: id });
      setLikedPostIds(prev => [...prev, id]);
      setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1, liked: true } : p));
    }
  }, [currentUser, likedPostIds]);

  const addComment = useCallback(async (postId: string, text: string) => {
    if (!currentUser) return { error: 'Not signed in.' };
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        author_id: currentUser.id,
        text,
      })
      .select()
      .single();
    if (error) return { error: error.message };

    // Update comments_count on post
    const { error: rpcError } = await supabase.rpc('increment_comments_count', { post_id: postId });
    if (rpcError) {
      // Fallback: manual update
      await supabase.from('posts').update({
        comments_count: (posts.find(p => p.id === postId)?.comments.length ?? 0) + 1,
      }).eq('id', postId);
    }

    setPosts(prev => prev.map(p => p.id === postId ? {
      ...p,
      comments: [...p.comments, {
        id: data.id,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatar,
        text,
        date: data.created_at,
      }],
    } : p));
    return { error: null };
  }, [currentUser, posts]);

  // Update posts with liked/saved state when those arrays change
  useEffect(() => {
    setPosts(prev => prev.map(p => ({
      ...p,
      liked: likedPostIds.includes(p.id),
      saved: savedPosts.includes(p.id),
    })));
  }, [likedPostIds, savedPosts]);

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  // ─── Campus Marketplace Handlers ───
  const getStartupBySlug = useCallback((slug: string) => {
    return startups.find(s => s.slug === slug);
  }, [startups]);

  const getListingById = useCallback((id: string) => {
    return listings.find(l => l.id === id);
  }, [listings]);

  const addListing = useCallback(async (listingData: Partial<Listing>): Promise<{ error: string | null; id?: string }> => {
    const id = `lst-${Date.now()}`;
    const newListing: Listing = {
      id,
      sellerId: currentUser?.id || 'guest',
      type: listingData.type || 'product',
      ownerType: listingData.ownerType || 'profile',
      startupId: listingData.startupId || null,
      title: listingData.title || 'Untitled Listing',
      description: listingData.description || '',
      category: listingData.category || 'Other',
      condition: listingData.condition || 'New',
      status: listingData.status || 'live',
      priceType: listingData.priceType || 'fixed',
      basePrice: listingData.basePrice || 0,
      deliveryDays: listingData.deliveryDays || 1,
      images: listingData.images && listingData.images.length > 0 ? listingData.images : ['https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=800'],
      location: listingData.location || currentUser?.location || 'On Campus',
      distance: '0.2 mi',
      campus: currentUser?.campus || 'Main Campus',
      rating: 5.0,
      reviewCount: 0,
      views: 1,
      acceptCustomQuotes: listingData.acceptCustomQuotes ?? true,
      packages: listingData.packages || [],
      startup: listingData.startup || (listingData.startupId ? startups.find(s => s.id === listingData.startupId) : undefined),
      createdAt: new Date().toISOString(),
      seller: currentUser ? {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        department: currentUser.department,
        college: currentUser.college,
        accountType: currentUser.accountType || 'student',
        isVerified: currentUser.isVerified || false,
        contactWhatsapp: currentUser.contactWhatsapp,
        contactEmail: currentUser.contactEmail,
        contactInstagram: currentUser.contactInstagram,
        showContact: currentUser.showContact ?? true,
      } : undefined,
    };

    setListings(prev => [newListing, ...prev]);
    if (newListing.type === 'service') {
      setServices(prev => [newListing, ...prev]);
    } else {
      setProducts(prev => [{
        id: newListing.id,
        title: newListing.title,
        description: newListing.description,
        price: newListing.basePrice,
        category: newListing.category as Product['category'],
        condition: (newListing.condition || 'New') as Product['condition'],
        listingType: 'product',
        listingStatus: 'published',
        transactionStatus: 'available',
        images: newListing.images,
        location: newListing.location,
        campus: newListing.campus,
        sellerId: newListing.sellerId,
        sellerName: newListing.seller?.name || '',
        sellerAvatar: newListing.seller?.avatar || '',
        sellerVerified: newListing.seller?.isVerified || false,
        rating: 5.0,
        reviewCount: 0,
        postedDate: newListing.createdAt,
        quantity: 1,
        tags: [newListing.category],
        views: 1,
        favourites: 0,
        featured: false,
      }, ...prev]);
    }

    return { error: null, id };
  }, [currentUser]);

  const updateListingStatus = useCallback(async (id: string, status: 'draft' | 'live' | 'featured' | 'paused') => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    setServices(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    setProducts(prev => prev.map(p => p.id === id ? { ...p, listingStatus: status === 'paused' ? 'paused' : 'published' } : p));
  }, []);

  const deleteListing = useCallback(async (id: string) => {
    setListings(prev => prev.filter(l => l.id !== id));
    setServices(prev => prev.filter(s => s.id !== id));
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const createOrder = useCallback(async (orderData: Partial<Order>): Promise<{ error: string | null; id?: string }> => {
    const id = `ord-${Date.now()}`;
    const targetListing = listings.find(l => l.id === orderData.listingId);

    const newOrder: Order = {
      id,
      listingId: orderData.listingId || '',
      listingTitle: orderData.listingTitle || targetListing?.title || 'Campus Order',
      listingImage: orderData.listingImage || targetListing?.images[0],
      listingType: orderData.listingType || targetListing?.type || 'product',
      packageId: orderData.packageId || null,
      packageTier: orderData.packageTier,
      buyerId: currentUser?.id || 'guest-buyer',
      buyerName: currentUser?.name || 'Campus Student',
      buyerAvatar: currentUser?.avatar,
      sellerId: orderData.sellerId || targetListing?.sellerId || '',
      sellerName: orderData.sellerName || targetListing?.seller?.name || 'Seller',
      sellerAvatar: orderData.sellerAvatar || targetListing?.seller?.avatar,
      startupId: orderData.startupId || targetListing?.startupId || null,
      startupName: targetListing?.startup?.name,
      status: orderData.status || 'inquiry',
      amount: orderData.amount || targetListing?.basePrice || 0,
      inquiryMessage: orderData.inquiryMessage || '',
      createdAt: new Date().toISOString(),
      notesCount: orderData.inquiryMessage ? 1 : 0,
    };

    setOrders(prev => [newOrder, ...prev]);

    if (orderData.inquiryMessage) {
      setOrderNotes(prev => [
        ...prev,
        {
          id: `note-${Date.now()}`,
          orderId: id,
          authorId: currentUser?.id || 'guest-buyer',
          authorName: currentUser?.name || 'Campus Student',
          authorAvatar: currentUser?.avatar,
          body: orderData.inquiryMessage || '',
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    return { error: null, id };
  }, [currentUser, listings]);

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  }, []);

  const addOrderNote = useCallback(async (noteData: Partial<OrderNote>): Promise<{ error: string | null; id?: string }> => {
    const id = `note-${Date.now()}`;
    const newNote: OrderNote = {
      id,
      orderId: noteData.orderId || '',
      authorId: currentUser?.id || 'guest',
      authorName: currentUser?.name || 'User',
      authorAvatar: currentUser?.avatar,
      body: noteData.body || '',
      attachmentUrl: noteData.attachmentUrl,
      createdAt: new Date().toISOString(),
    };

    setOrderNotes(prev => [...prev, newNote]);
    setOrders(prev => prev.map(o => o.id === noteData.orderId ? { ...o, notesCount: (o.notesCount || 0) + 1 } : o));
    return { error: null, id };
  }, [currentUser]);

  const addReview = useCallback(async (reviewData: Partial<Review>): Promise<{ error: string | null; id?: string }> => {
    const id = `rev-${Date.now()}`;
    const newReview: Review = {
      id,
      orderId: reviewData.orderId,
      listingId: reviewData.listingId,
      reviewerId: currentUser?.id || 'reviewer',
      reviewerName: currentUser?.name || 'Campus Reviewer',
      reviewerAvatar: currentUser?.avatar || '',
      revieweeId: reviewData.revieweeId || '',
      rating: reviewData.rating || 5,
      comment: reviewData.comment || '',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setReviews(prev => [newReview, ...prev]);
    return { error: null, id };
  }, [currentUser]);

  const createStartup = useCallback(async (data: Partial<Startup>): Promise<{ error: string | null; startup?: Startup }> => {
    const id = `stp-${Date.now()}`;
    const slug = (data.name || 'startup')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newStartup: Startup = {
      id,
      ownerId: currentUser?.id || 'founder',
      name: data.name || 'My Campus Startup',
      slug,
      logoUrl: data.logoUrl || 'https://images.pexels.com/photos/256514/pexels-photo-256514.jpeg?auto=compress&cs=tinysrgb&w=200',
      coverUrl: data.coverUrl || 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200',
      tagline: data.tagline || 'Student-founded venture on campus.',
      description: data.description || '',
      category: data.category || 'Development',
      college: data.college || currentUser?.college || 'Campus University',
      teamSize: data.teamSize || 1,
      website: data.website || '',
      socialLinks: data.socialLinks || {},
      contactWhatsapp: data.contactWhatsapp || currentUser?.contactWhatsapp,
      contactEmail: data.contactEmail || currentUser?.contactEmail,
      contactInstagram: data.contactInstagram || currentUser?.contactInstagram,
      showContact: data.showContact ?? true,
      isVerified: false,
      rating: 5.0,
      reviewCount: 0,
      servicesCount: 0,
      productsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setStartups(prev => [newStartup, ...prev]);
    return { error: null, startup: newStartup };
  }, [currentUser]);

  const registerCampusUser = useCallback(async (params: {
    name: string;
    email: string;
    password?: string;
    accountType: AccountType;
    college: string;
    department?: string;
    year?: string;
    contactWhatsapp?: string;
    contactEmail?: string;
    contactInstagram?: string;
    showContact?: boolean;
    isVerified?: boolean;
    startupData?: Partial<Startup>;
  }): Promise<{ error: string | null; user?: User }> => {
    let newId = `usr-${Date.now()}`;
    if (params.password) {
      try {
        const { data } = await supabase.auth.signUp({
          email: params.email,
          password: params.password,
          options: { data: { name: params.name } },
        });
        if (data?.user) {
          newId = data.user.id;
        }
      } catch {
        // fallback to state
      }
    }

    const newUser: User = {
      id: newId,
      name: params.name,
      username: params.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, ''),
      email: params.email,
      avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300`,
      bio: params.accountType === 'startup'
        ? `Founder at ${params.startupData?.name || 'Campus Venture'}.`
        : `${params.department || 'Student'} at ${params.college}.`,
      location: params.college,
      campus: params.college,
      college: params.college,
      department: params.department || 'General Studies',
      year: params.year || 'Undergraduate',
      verified: params.isVerified ?? true,
      isVerified: params.isVerified ?? true,
      verificationStatus: params.isVerified ? 'verified' : 'pending',
      accountType: params.accountType,
      contactWhatsapp: params.contactWhatsapp,
      contactEmail: params.contactEmail || params.email,
      contactInstagram: params.contactInstagram,
      showContact: params.showContact ?? true,
      role: params.accountType === 'buyer' ? 'buyer' : 'seller',
      followers: 1,
      following: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      rating: 5.0,
      reviewCount: 0,
      listingCount: 0,
    };

    setCurrentUser(newUser);
    setIsAuthed(true);
    setVerificationStatus(newUser.verificationStatus);

    if (params.accountType === 'startup' && params.startupData) {
      const stpId = `stp-${Date.now()}`;
      const slug = (params.startupData.name || 'my-startup')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const newStartup: Startup = {
        id: stpId,
        ownerId: newId,
        name: params.startupData.name || 'Campus Venture',
        slug,
        logoUrl: params.startupData.logoUrl || 'https://images.pexels.com/photos/256514/pexels-photo-256514.jpeg?auto=compress&cs=tinysrgb&w=200',
        coverUrl: params.startupData.coverUrl || 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200',
        tagline: params.startupData.tagline || 'Student-founded startup on campus.',
        description: params.startupData.description || 'Campus venture building technology and design services.',
        category: params.startupData.category || 'Development',
        college: params.college,
        teamSize: params.startupData.teamSize || 2,
        website: params.startupData.website || '',
        contactWhatsapp: params.contactWhatsapp,
        contactEmail: params.contactEmail || params.email,
        contactInstagram: params.contactInstagram,
        showContact: params.showContact ?? true,
        isVerified: params.isVerified ?? true,
        rating: 5.0,
        reviewCount: 0,
        servicesCount: 0,
        productsCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };

      setStartups(prev => [newStartup, ...prev]);
    }

    return { error: null, user: newUser };
  }, []);

  // ─── Looking For System Methods ───
  const addLookingForRequest = useCallback(async (req: Partial<StartupLookingFor>): Promise<{ error: string | null; id?: string }> => {
    const newId = req.id || `lf-${Date.now()}`;
    const targetStartup = startups.find(s => s.id === req.startupId) || startups[0];
    const newReq: StartupLookingFor = {
      id: newId,
      startupId: targetStartup?.id || 'b1111111-1111-4111-b111-111111111111',
      startupName: targetStartup?.name || req.startupName || 'Campus Startup',
      startupSlug: targetStartup?.slug || req.startupSlug || 'campus-startup',
      startupLogo: targetStartup?.logoUrl || req.startupLogo || 'https://images.pexels.com/photos/256514/pexels-photo-256514.jpeg?auto=compress&cs=tinysrgb&w=200',
      startupCollege: targetStartup?.college || req.startupCollege || 'Main Campus',
      startupCategory: targetStartup?.category || req.startupCategory || 'Startup',
      isStartupVerified: targetStartup?.isVerified ?? true,
      type: req.type || 'co-founder',
      title: req.title || 'Looking For Collaborators',
      description: req.description || '',
      skillsNeeded: req.skillsNeeded || [],
      compensationType: req.compensationType || 'unpaid-collab',
      compensationDetails: req.compensationDetails || '',
      timeCommitment: req.timeCommitment || 'Flexible',
      locationType: req.locationType || 'hybrid',
      campus: req.campus || targetStartup?.college || 'Campus Quad',
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0],
      responseCount: 0,
      contactWhatsapp: req.contactWhatsapp || targetStartup?.contactWhatsapp || currentUser?.contactWhatsapp,
      contactEmail: req.contactEmail || targetStartup?.contactEmail || currentUser?.contactEmail || currentUser?.email,
      contactInstagram: req.contactInstagram || targetStartup?.contactInstagram || currentUser?.contactInstagram,
      showContact: req.showContact ?? true,
    };
    setLookingForRequests(prev => [newReq, ...prev]);
    return { error: null, id: newId };
  }, [startups, currentUser]);

  const updateLookingForRequest = useCallback(async (id: string, updates: Partial<StartupLookingFor>) => {
    setLookingForRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  }, []);

  const deleteLookingForRequest = useCallback(async (id: string) => {
    setLookingForRequests(prev => prev.filter(r => r.id !== id));
  }, []);

  const addLookingForResponse = useCallback(async (res: Partial<LookingForResponse>): Promise<{ error: string | null; id?: string }> => {
    const newId = res.id || `lfr-${Date.now()}`;
    const newRes: LookingForResponse = {
      id: newId,
      requestId: res.requestId || '',
      startupId: res.startupId || '',
      startupName: res.startupName || '',
      applicantId: res.applicantId || currentUser?.id || 'anon',
      applicantName: res.applicantName || currentUser?.name || 'Campus Student',
      applicantEmail: res.applicantEmail || currentUser?.contactEmail || currentUser?.email || 'student@campus.edu',
      applicantWhatsapp: res.applicantWhatsapp || currentUser?.contactWhatsapp,
      applicantInstagram: res.applicantInstagram || currentUser?.contactInstagram,
      applicantAvatar: res.applicantAvatar || currentUser?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
      applicantCollege: res.applicantCollege || currentUser?.college || 'University',
      applicantMajor: res.applicantMajor || currentUser?.department || 'Student',
      roleOrPitch: res.roleOrPitch || '',
      portfolioUrl: res.portfolioUrl || '',
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setLookingForResponses(prev => [newRes, ...prev]);
    setLookingForRequests(prev => prev.map(r => r.id === res.requestId ? { ...r, responseCount: (r.responseCount || 0) + 1 } : r));
    return { error: null, id: newId };
  }, [currentUser]);

  const updateLookingForResponseStatus = useCallback(async (id: string, status: LookingForResponse['status']) => {
    setLookingForResponses(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }, []);

  return (
    <AppContext.Provider value={{
      isAuthed, authLoading, currentUser,
      signIn, signUp, signOut, resetPassword, deleteAccount, updateProfile,
      verificationStatus, submitVerification,
      products, addProduct, updateProductTransactionStatus, deleteProduct,
      wantedRequests, addWantedRequest, deleteWantedRequest,
      offers, makeOffer, respondToOffer,
      blockedUsers, blockUser, unblockUser,
      favouriteProducts, favouriteSellers, savedPosts,
      toggleProductFavourite, toggleSellerFavourite, togglePostSave,
      following, toggleFollow,
      conversations, sendMessage, startConversation,
      notifications, markNotificationRead, markAllNotificationsRead, unreadNotificationCount,
      posts, togglePostLike, addComment,
      // Campus marketplace
      startups,
      services,
      listings,
      orders,
      quotes,
      orderNotes,
      reviews,
      // Looking For
      lookingForRequests,
      lookingForResponses,
      addLookingForRequest,
      updateLookingForRequest,
      deleteLookingForRequest,
      addLookingForResponse,
      updateLookingForResponseStatus,
      getStartupBySlug,
      getListingById,
      addListing,
      updateListingStatus,
      deleteListing,
      createOrder,
      updateOrderStatus,
      addOrderNote,
      addReview,
      createStartup,
      registerCampusUser,
      getProfileById,
      fetchProfilesByIds,
      searchProfiles,
      fetchCreators,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
