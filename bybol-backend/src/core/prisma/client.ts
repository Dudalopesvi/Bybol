import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '../../config/env.js';

const _prisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = _prisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  pool: new PrismaPg({ connectionString: env.DATABASE_URL })
});

if (process.env.NODE_ENV !== 'production') {
  _prisma.prisma = prisma;
}