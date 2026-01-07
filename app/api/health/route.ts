import { NextResponse } from "next/server";
import { isRedisAvailable } from "@/lib/cache/client";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    database: { status: "up" | "down"; latency?: number; error?: string };
    redis: { status: "up" | "down"; latency?: number; error?: string };
  };
}

const startTime = Date.now();

export async function GET() {
  const checks: HealthStatus["checks"] = {
    database: { status: "down" },
    redis: { status: "down" },
  };

  // Check Database
  const dbStart = Date.now();
  try {
    await db.execute(sql`SELECT 1`);
    checks.database = {
      status: "up",
      latency: Date.now() - dbStart,
    };
  } catch (error: any) {
    checks.database = {
      status: "down",
      error: error.message || "Database connection failed",
    };
  }

  // Check Redis
  const redisStart = Date.now();
  try {
    const healthy = await isRedisAvailable();
    if (healthy) {
      checks.redis = {
        status: "up",
        latency: Date.now() - redisStart,
      };
    } else {
      checks.redis = {
        status: "down",
        error: "Redis health check failed",
      };
    }
  } catch (error: any) {
    checks.redis = {
      status: "down",
      error: error.message || "Redis connection failed",
    };
  }

  // Determine overall status
  const dbUp = checks.database.status === "up";
  const redisUp = checks.redis.status === "up";

  let overallStatus: HealthStatus["status"];
  if (dbUp && redisUp) {
    overallStatus = "healthy";
  } else if (dbUp) {
    // Database is critical, Redis is optional
    overallStatus = "degraded";
  } else {
    overallStatus = "unhealthy";
  }

  const response: HealthStatus = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "0.1.0",
    uptime: Math.floor((Date.now() - startTime) / 1000),
    checks,
  };

  const statusCode = overallStatus === "unhealthy" ? 503 : 200;

  return NextResponse.json(response, { status: statusCode });
}
