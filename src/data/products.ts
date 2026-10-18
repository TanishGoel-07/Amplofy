import type { Product, Listing } from './types';
import { mockProducts, mockServices } from './mockData';

// Map Listing to Product for backward compatibility
function listingToProduct(l: Listing): Product {
  return {
    id: l.id,
    title: l.title,
    description: l.description,
    price: l.basePrice,
    category: l.category as Product['category'],
    condition: (l.condition || 'New') as Product['condition'],
    listingType: l.type === 'service' ? 'service' : 'product',
    listingStatus: l.status === 'live' || l.status === 'featured' ? 'published' : (l.status as Product['listingStatus']),
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
  };
}

export const products: Product[] = mockProducts.map(listingToProduct);
export const allListings: Listing[] = [...mockProducts, ...mockServices];

export const getProductById = (id: string): Product | undefined =>
  products.find(p => p.id === id);

export const getListingById = (id: string): Listing | undefined =>
  allListings.find(l => l.id === id);

export const getProductsBySeller = (sellerId: string): Product[] =>
  products.filter(p => p.sellerId === sellerId);

export const getFeaturedProducts = (): Product[] =>
  products.filter(p => p.featured);

export const getSimilarProducts = (product: Product, limit = 4): Product[] =>
  products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, limit);

export const getServices = (): Listing[] => mockServices;

export const getFeaturedServices = (): Listing[] =>
  mockServices.filter(s => s.status === 'featured');
