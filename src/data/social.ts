import type { Review, Post, Conversation, NotificationItem, Report, VerificationRequest, Comment } from './types';
import { getProductsBySeller } from './products';

export const reviews: Review[] = [];

export const getReviewsBySeller = (_sellerId: string): Review[] => [];

const sampleComments: Comment[] = [];

export const posts: Post[] = [];

export const conversations: Conversation[] = [];

export const notifications: NotificationItem[] = [];

export const reports: Report[] = [];

export const verificationRequests: VerificationRequest[] = [];
