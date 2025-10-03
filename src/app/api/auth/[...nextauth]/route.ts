// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // o ruta relativa correcta

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
