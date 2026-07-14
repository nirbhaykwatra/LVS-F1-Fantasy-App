import { drizzle as drizzlePostgres } from 'drizzle-orm/node-postgres'
import * as schema from './schema';

// @ts-ignore
export const db = drizzlePostgres(process.env.DATABASE_URL!, { schema, casing: 'snake_case' });