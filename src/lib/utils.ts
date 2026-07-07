import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserInitials(name?: string | null, surname?: string | null) {
  if (!name) return "";
  const names = [name, surname]
    .filter(Boolean)
    .flatMap((n) => n!.split(" "))
    .filter(Boolean);

  const initials = names.map((n) => n.charAt(0).toUpperCase());
  return initials.join("");
}
