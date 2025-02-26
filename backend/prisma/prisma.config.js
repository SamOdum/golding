import { env } from '../config/env';

/**
 * Prisma client configuration
 * @type {import('@prisma/client').Prisma.PrismaClientOptions}
 *
 * @property {object} datasources - Database connection configuration
 * @property {object} datasources.db - Primary database configuration
 * @property {string} datasources.db.url - Database connection URL
 *
 * @example
 * // Development URL format:
 * postgresql://postgres:postgres@localhost:5432/golding
 *
 * // Production URL format:
 * postgresql://user:password@host:port/database
 */
const config = {
  datasources: {
    db: {
      url: env.DATABASE_URL,
    },
  },
};

export default config;
