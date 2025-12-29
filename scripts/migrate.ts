/**
 * Database Migration Runner
 *
 * Run SQL migrations against the database
 */

import 'dotenv/config';
import { Client } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const migrationsDir = join(process.cwd(), 'drizzle');

async function runMigrations() {
  const client = new Client({ connectionString: DATABASE_URL });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Get list of migration files
    const migrationFiles = [
      '0001_initial.sql',
      '0002_observability.sql',
      '0003_phase4_analytics.sql'
    ];

    // Check which migrations have already been run
    const migrationsTable = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = '_migrations'
      )
    `);

    if (!migrationsTable.rows[0].exists) {
      // Create migrations tracking table
      await client.query(`
        CREATE TABLE IF NOT EXISTS "_migrations" (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          executed_at TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log('✅ Created migrations tracking table');
    }

    const executedMigrations = await client.query(
      'SELECT name FROM "_migrations" ORDER BY id'
    );
    const executedNames = new Set(executedMigrations.rows.map((r) => r.name));

    // Run pending migrations
    for (const file of migrationFiles) {
      if (executedNames.has(file)) {
        console.log(`⊙ Skipping ${file} (already executed)`);
        continue;
      }

      const migrationPath = join(migrationsDir, file);
      console.log(`Running ${file}...`);

      try {
        const sql = readFileSync(migrationPath, 'utf8');
        await client.query('BEGIN');
        await client.query(sql);

        // Record migration
        await client.query({
          text: 'INSERT INTO "_migrations" (name) VALUES ($1)',
          values: [file]
        });

        await client.query('COMMIT');
        console.log(`✅ Executed ${file}`);
      } catch (error) {
        await client.query('ROLLBACK');
        console.error(`❌ Failed to execute ${file}:`, error);
        throw error;
      }
    }

    console.log('\n✅ All migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('✅ Database connection closed');
  }
}

// Run migrations
runMigrations();
