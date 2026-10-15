import type { User } from './types';

export const CURRENT_USER_ID = 'u-current';

export const users: User[] = [];

export const getUserById = (id: string): User | undefined => users.find(u => u.id === id);
export const getSellerById = getUserById;
