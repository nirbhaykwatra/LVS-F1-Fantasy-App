import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';

async function runMigration() {
    const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
    });

    const db = drizzle(pool);

    console.log('⏳ Running migrations...');

    await migrate(db, { migrationsFolder: './drizzle' });

    console.log('✅ Migrations completed successfully!');

    await pool.end();
    process.exit(0);
}

runMigration().catch((err) => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
});
