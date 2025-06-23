import { fetcher } from '@/utils/fetcher';
import { User } from '@/types/user';

export const usersApi = {
  getUsers: async (): Promise<User[]> => {
    return await fetcher({ path: '/users' });
  },

  getUserById: async (id: string): Promise<User> => {
    return await fetcher({ path: `/users/${id}` });
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    return await fetcher({
      path: `/users/${id}`,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteUser: async (id: string): Promise<void> => {
    return await fetcher({
      path: `/users/${id}`,
      method: 'DELETE',
    });
  },
};
