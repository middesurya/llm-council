import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { queryAnalytics, domainUsage } from '@/lib/db/schema';
import { sql, desc, count, avg, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    await requireAdminAuth();

    // Get database connection
    const db = await getDb();
    if (!db) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 500 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '7');

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get domain stats from query_analytics
    const domainStatsResult = await db
      .select({
        domain: queryAnalytics.domain,
        totalQueries: count(),
        avgProcessingTimeMs: avg(queryAnalytics.processingTimeMs),
        avgResponseLength: avg(queryAnalytics.responseLength),
        citationsPerQuery: avg(sql<number>`CAST(${queryAnalytics.citationCount} AS FLOAT)`),
      })
      .from(queryAnalytics)
      .where(eq(queryAnalytics.domain, queryAnalytics.domain)) // Group by domain
      .groupBy(queryAnalytics.domain);

    // Get daily trend for each domain (last 7 days)
    const dailyTrendResult = await db
      .select({
        domain: queryAnalytics.domain,
        date: sql<string>`DATE(${queryAnalytics.timestamp})`,
        count: count(),
      })
      .from(queryAnalytics)
      .where(sql`${queryAnalytics.timestamp} >= ${startDate}`)
      .groupBy(sql`DATE(${queryAnalytics.timestamp})`, queryAnalytics.domain)
      .orderBy(sql`DATE(${queryAnalytics.timestamp})`);

    // Group daily trend by domain
    const domainTrends: Record<string, number[]> = {};
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date.toISOString().split('T')[0]);
    }

    dailyTrendResult.forEach((item: any) => {
      if (!domainTrends[item.domain]) {
        domainTrends[item.domain] = [];
      }
      domainTrends[item.domain].push(item.count);
    });

    // Calculate total queries
    const totalQueries = domainStatsResult.reduce((sum: number, d: any) => sum + (d.totalQueries || 0), 0);

    // Format response
    const domains = domainStatsResult.map((item: any) => {
      const dailyTrend = domainTrends[item.domain] || [0, 0, 0, 0, 0, 0, 0];
      const trendChange = dailyTrend.length >= 2
        ? ((dailyTrend[dailyTrend.length - 1] - dailyTrend[0]) / (dailyTrend[0] || 1)) * 100
        : 0;

      return {
        domain: item.domain,
        totalQueries: item.totalQueries || 0,
        avgProcessingTimeMs: Math.round(item.avgProcessingTimeMs || 0),
        avgResponseLength: Math.round(item.avgResponseLength || 0),
        citationsPerQuery: Math.round((item.citationsPerQuery || 0) * 10) / 10,
        uniqueUsers: 0, // Not tracked in current schema
        dailyTrend,
        trendChange: Math.round(trendChange),
      };
    });

    return NextResponse.json({
      domains,
      totalQueries,
      aggregate: {
        totalQueries,
        avgProcessingTime: Math.round(
          domains.reduce((sum: number, d: any) => sum + d.avgProcessingTimeMs, 0) / (domains.length || 1) / 1000 * 10
        ) / 10,
        activeDomains: domains.length,
        uniqueUsers: domains.reduce((sum: number, d: any) => sum + d.uniqueUsers, 0),
      },
    });
  } catch (error: any) {
    console.error('[API] Domains error:', error);

    // Return error response
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Failed to fetch domain data' },
      { status: 500 }
    );
  }
}
