// src/types/profile.ts
export type Role =
  | "Builder"
  | "Founder"
  | "Developer"
  | "Designer"
  | "Investor"
  | "Marketer";

export type Profile = {
  // claves visibles en el card/listado
  handle: string;        // viene de "username"
  name: string;          // viene de "fullName"
  role: "Builder" | "Founder" | "Developer" | "Designer" | "Investor" | "Marketer";
  avatar: string;        // viene de "avatarUrl"
  bio: string;
  location: string;
  tags: string[];        // viene de "skills" (CSV → array)
  available: boolean;

  // enlaces opcionales
  linkedin?: string;
  x?: string;            // Twitter/X
  calendly?: string;
  telegram?: string;
  discord?: string;
};