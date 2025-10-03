// src/lib/prisma.ts
import 'server-only';
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * Si defines PRISMA_ACCELERATE_URL en Netlify, lo usamos.
 * Si no, usamos DATABASE_URL (con el plugin de Prisma para binarios).
 */
const url =
  process.env.PRISMA_ACCELERATE_URL ?? process.env.DATABASE_URL ?? '';

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ['warn', 'error'],
    datasources: { db: { url } },
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
