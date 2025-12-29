import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { queryAnalytics } from '@/lib/db/schema';
import { sql, desc, count, avg, and, gte, lte, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    await requireAdminAuth();

    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const domain = searchParams.get('domain');
    const searchMethod = searchParams.get('searchMethod');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Build where clause
    const conditions = [];

    if (domain) {
      conditions.push(eq(queryAnalytics.domain, domain));
    }

    if (searchMethod) {
      conditions.push(eq(queryAnalytics.searchMethod, searchMethod));
    }

    if (dateFrom) {
      conditions.push(gte(queryAnalytics.timestamp, new Date(dateFrom)));
    }

    if (dateTo) {
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59);
      conditions.push(lte(queryAnalytics.timestamp, endDate));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count for pagination
    const countResult = await db
      .select({ count: count() })
      .from(queryAnalytics)
      .where(whereClause);

    const totalCount = countResult[0]?.count || 0;

    // Get queries with pagination
    const queriesResult = await db
      .select()
      .from(queryAnalytics)
      .where(whereClause)
      .orderBy(desc(queryAnalytics.timestamp))
      .limit(limit)
      .offset(offset);

    // Calculate summary stats
    const allQueriesResult = await db
      .select({
        total: count(),
        withCitations: count(sql`CASE WHEN ${queryAnalytics.hasCitations} = 1 THEN 1 END`),
        avgTime: avg(queryAnalytics.processingTimeMs),
      })
      .from(queryAnalytics)
      .where(whereClause);

    const stats = allQueriesResult[0] || { total: 0, withCitations: 0, avgTime: 0 };

    return NextResponse.json({
      queries: queriesResult,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
      stats: {
        totalQueries: stats.total || 0,
        withCitations: stats.withCitations || 0,
        avgProcessingTime: Math.round((stats.avgTime || 0) / 1000 * 10) / 10,
      },
    });
  } catch (error: any) {
    console.error('[API] Queries error:', error);

    // Return error response
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Failed to fetch query data' },
      { status: 500 }
    );
  }
}
