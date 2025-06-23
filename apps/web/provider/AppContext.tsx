import { createContext } from 'react';
import { User } from '../types/user';

export interface AppContextType {
  user?: User;
  setUser: (value: User | undefined) => void;
}

export const AppContext = createContext<AppContextType>({
  user: undefined,
  setUser: (_user: User | undefined) => {
    // User setting functionality will be implemented
  },
});
