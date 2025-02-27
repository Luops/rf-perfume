import { User } from "@supabase/supabase-js";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function saveUserDataOnStorage(user: User) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function loadUserDataOnStorage(): User | null {
  if (global.window !== undefined) {
    return JSON.parse(localStorage.getItem("user")!);
  }

  return null;
}

export function clearUserDataOnStorage(): void {
  localStorage.removeItem("user");
}
