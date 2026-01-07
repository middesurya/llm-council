/**
 * Database Setup Script
 * Run this after deploying to set up the database schema
 *
 * Usage: npx tsx scripts/setup-db.ts
 */

import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { sql } from "drizzle-orm";

// Load environment variables
config({ path: ".env.local" });
config({ path: ".env" });

async function setupDatabase() {
  console.log("🚀 Setting up database...\n");

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL is not set");
    process.exit(1);
  }

  // Mask the password in the URL for logging
  const maskedUrl = databaseUrl.replace(/:([^@]+)@/, ":****@");
  console.log(`📦 Connecting to: ${maskedUrl}\n`);

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined,
  });

  const db = drizzle(pool);

  try {
    // Test connection
    console.log("🔌 Testing connection...");
    await db.execute(sql`SELECT 1`);
    console.log("✅ Connected successfully!\n");

    // Run migrations
    console.log("📋 Running migrations...");

    // Import and run migrations
    const { migrate } = await import("drizzle-orm/node-postgres/migrator");
    await migrate(db, { migrationsFolder: "./drizzle" });

    console.log("✅ Migrations complete!\n");

    // Verify tables
    console.log("📊 Verifying tables...");
    const tables = await db.execute(sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log("Tables created:");
    tables.rows.forEach((row: any) => {
      console.log(`  - ${row.table_name}`);
    });

    console.log("\n✅ Database setup complete!");
  } catch (error: any) {
    console.error("❌ Error setting up database:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
