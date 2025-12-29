import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { queryAnalytics, expertPerformance } from '@/lib/db/schema';
import { sql, desc, count, avg } from 'drizzle-orm';

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

    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const days = parseInt(searchParams.get('days') || '7');

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Total queries
    const totalQueriesResult = await db
      .select({ count: count() })
      .from(queryAnalytics);

    // Average processing time
    const avgProcessingTimeResult = await db
      .select({ avg: avg(queryAnalytics.processingTimeMs) })
      .from(queryAnalytics);

    // Average response length
    const avgResponseLengthResult = await db
      .select({ avg: avg(queryAnalytics.responseLength) })
      .from(queryAnalytics);

    // Citations rate (queries with citations / total queries)
    const citationsResult = await db
      .select({ count: count() })
      .from(queryAnalytics)
      .where(sql`${queryAnalytics.hasCitations} = 1`);

    // Domain usage
    const domainUsageResult = await db
      .select({
        domain: queryAnalytics.domain,
        count: count(),
      })
      .from(queryAnalytics)
      .groupBy(queryAnalytics.domain);

    // Expert performance
    const expertPerformanceResult = await db
      .select({
        provider: expertPerformance.provider,
        count: count(),
        avgTime: avg(expertPerformance.processingTimeMs),
      })
      .from(expertPerformance)
      .where(sql`${expertPerformance.stage} = 'stage1'`)
      .groupBy(expertPerformance.provider);

    // Daily query trend (last 7 days)
    const dailyTrendResult = await db
      .select({
        date: sql<string>`DATE(${queryAnalytics.timestamp})`,
        count: count(),
      })
      .from(queryAnalytics)
      .where(sql`${queryAnalytics.timestamp} >= ${startDate}`)
      .groupBy(sql`DATE(${queryAnalytics.timestamp})`)
      .orderBy(sql`DATE(${queryAnalytics.timestamp})`);

    const totalQueries = totalQueriesResult[0]?.count || 0;
    const citationsCount = citationsResult[0]?.count || 0;
    const avgProcessingTime = avgProcessingTimeResult[0]?.avg || 0;
    const avgResponseLength = avgResponseLengthResult[0]?.avg || 0;

    return NextResponse.json({
      totalQueries,
      avgProcessingTime: Math.round(avgProcessingTime / 1000 * 10) / 10, // Convert to seconds, 1 decimal
      avgResponseLength: Math.round(avgResponseLength),
      citationsRate: totalQueries > 0 ? Math.round((citationsCount / totalQueries) * 100) : 0,
      domainUsage: domainUsageResult.reduce((acc: Record<string, number>, item: any) => {
        acc[item.domain] = item.count;
        return acc;
      }, {}),
      expertPerformance: expertPerformanceResult.reduce((acc: Record<string, { avgTime: number; queries: number }>, item: any) => {
        acc[item.provider] = {
          avgTime: Math.round((item.avgTime || 0) / 1000 * 10) / 10,
          queries: item.count,
        };
        return acc;
      }, {}),
      dailyTrend: dailyTrendResult.map((item: any) => item.count),
    });
  } catch (error: any) {
    console.error('[API] Dashboard error:', error);

    // Return error response
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
