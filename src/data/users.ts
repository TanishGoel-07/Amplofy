import type { User } from './types';
import { mockStudents } from './mockData';

export const CURRENT_USER_ID = mockStudents[0].id;

export const users: User[] = mockStudents;

export const getUserById = (id: string): User | undefined =>
  users.find(u => u.id === id);

export const getSellerById = getUserById;
