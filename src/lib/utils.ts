import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type Status = "active" | "disabled" | "expired"

export const getStatus = (active: boolean, expireAt: Date | null): Status => {
  
  if (expireAt && new Date(expireAt) < new Date()) {
    return "expired"
  }

  return active ? "active" : "disabled"
}