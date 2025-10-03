// src/lib/auth.ts
import type { NextAuthOptions, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma"; // si tu alias es "@/*" -> "@/lib/prisma"
// import { prisma } from "../../lib/prisma"; // <-- usa este si NO tienes alias "@"
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password ?? "";
        if (!email || !password) return null;

        const dbUser = await prisma.user.findUnique({ where: { email } });
        if (!dbUser || !dbUser.password) return null;

        const valid = await bcrypt.compare(password, dbUser.password);
        if (!valid) return null;

        // Devuelve un objeto compatible con NextAuth.User (sin any)
        const user: User = {
          id: dbUser.id,
          name: dbUser.name ?? undefined,
          email: dbUser.email,
          image: dbUser.image ?? undefined,
        };
        return user;
      },
    }),
  ],

  pages: { signIn: "/auth/login" },

  callbacks: {
    // Agregamos el userId al token JWT
    async jwt({ token, user }): Promise<JWT> {
      if (user && "id" in user && typeof user.id === "string") {
        token.userId = user.id;
      }
      return token;
    },

    // Exponemos el id en session.user.id
    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
};
