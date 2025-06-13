"use client";
import { useContext } from "react";
import { AppContext } from "../provider/AppContext";

export function useCurrentUser() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useCurrentUser must be used within AppProvider");
  }
  return context;
}
