import type { Product } from './types';

export const products: Product[] = [];

export const getProductById = (id: string): Product | undefined => products.find(p => p.id === id);
export const getProductsBySeller = (_sellerId: string): Product[] => [];
export const getFeaturedProducts = (): Product[] => [];
export const getSimilarProducts = (_product: Product, _limit = 4): Product[] => [];
