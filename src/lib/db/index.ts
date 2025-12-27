// Lazy-load database to avoid Turbopack symlink issues on Windows
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

let _db: any = null;
let _initPromise: Promise<any> | null = null;

async function initializeDb() {
  if (_db !== null) return _db;
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    if (!databaseUrl || databaseUrl.trim() === "") {
      console.warn("DATABASE_URL environment variable is not set");
      return null;
    }

    try {
      // Dynamic import to avoid Turbopack symlink issues
      const { drizzle } = await import("drizzle-orm/node-postgres");
      const { Pool } = await import("pg");

      const pool = new Pool({
        connectionString: databaseUrl,
        max: 1,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      _db = drizzle(pool, { schema });
      return _db;
    } catch (error) {
      console.warn("Failed to initialize database connection:", error instanceof Error ? error.message : error);
      return null;
    }
  })();

  return _initPromise;
}

export async function getDb() {
  return await initializeDb();
}

// For backward compatibility
export const db = null as any;

export * from "./schema";
export * from "./logging";
export * from "./feedback";
