import { drizzle as drizzlePostgres } from 'drizzle-orm/node-postgres'
import * as schema from './schema';
import * as relations from './relations';

export const db = drizzlePostgres(process.env.DATABASE_URL!, { schema: { ...schema , ...relations}, casing: 'snake_case' });