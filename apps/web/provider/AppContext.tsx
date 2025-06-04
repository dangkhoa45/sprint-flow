import { createContext } from "react";
import { User } from "../types/user";

export type AppContextType = {
  user?: User;
  setUser: (value: User) => void;
};

export const AppContext = createContext<AppContextType>({
  user: undefined,
  setUser: () => {},
});
