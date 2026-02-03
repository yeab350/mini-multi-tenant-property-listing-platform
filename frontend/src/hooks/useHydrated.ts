"use client";

export function useHydrated() {
  // This project relies on Zustand persistence for client-only state.
  // For now, callers can treat components as client-only when needed.
  return true;
}
