"use client";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Axios from "axios";
import { configure } from "axios-hooks";
import { LRUCache } from "lru-cache";
import { SnackbarProvider } from "notistack";
import { ReactNode, useEffect, useState } from "react";
import { User } from "../types/user";
import { AppContext } from "./AppContext";
import SWRProvider from "./SWRProvider";
import { ThemeModeProvider } from "./ThemeContext";
import ThemeRegistry from "./ThemeRegistry";

const cache = new LRUCache({ max: 10 });
const axios = Axios.create({ withCredentials: true });

configure({ axios, cache } as never);

type Props = {
  children: ReactNode;
  currentUser?: User;
};

function AppProvider({ children, currentUser }: Props) {
  const [user, setUser] = useState<User | undefined>(currentUser);

  useEffect(() => {
    setUser(currentUser);
  }, [currentUser]);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      <ThemeModeProvider>
        <ThemeRegistry>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <SnackbarProvider
              anchorOrigin={{ horizontal: "center", vertical: "top" }}
            >
              <SWRProvider>{children}</SWRProvider>
            </SnackbarProvider>
          </LocalizationProvider>
        </ThemeRegistry>
      </ThemeModeProvider>
    </AppContext.Provider>
  );
}

export default AppProvider;
