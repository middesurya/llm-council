import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { expertPerformance } from '@/lib/db/schema';
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
    const stage = searchParams.get('stage') || 'stage1';

    // Get performance by provider and stage
    const performanceResult = await db
      .select({
        provider: expertPerformance.provider,
        model: expertPerformance.model,
        stage: expertPerformance.stage,
        role: expertPerformance.role,
        queryCount: count(),
        avgProcessingTimeMs: avg(expertPerformance.processingTimeMs),
        avgAnswerLength: avg(expertPerformance.answerLength),
        avgRanking: avg(expertPerformance.ranking),
        lastActivity: sql<string>`MAX(${expertPerformance.timestamp})`,
      })
      .from(expertPerformance)
      .where(eq(expertPerformance.stage, stage))
      .groupBy(expertPerformance.provider, expertPerformance.model, expertPerformance.stage, expertPerformance.role)
      .orderBy(desc(sql`MAX(${expertPerformance.timestamp})`));

    // Calculate aggregate stats
    const stage1Experts = performanceResult.filter((p: any) => p.stage === 'stage1');
    const totalQueries = stage1Experts.reduce((sum: number, e: any) => sum + (e.queryCount || 0), 0);
    const avgProcessingTime = stage1Experts.reduce((sum: number, e: any) => sum + (e.avgProcessingTimeMs || 0), 0) / (stage1Experts.length || 1);

    return NextResponse.json({
      experts: performanceResult.map((item: any) => ({
        provider: item.provider,
        model: item.model,
        stage: item.stage,
        role: item.role,
        queryCount: item.queryCount || 0,
        avgProcessingTimeMs: Math.round(item.avgProcessingTimeMs || 0),
        avgAnswerLength: Math.round(item.avgAnswerLength || 0),
        avgRanking: item.avgRanking ? Math.round(item.avgRanking * 10) / 10 : null,
        timestamp: item.lastActivity,
      })),
      aggregate: {
        totalQueries,
        avgProcessingTime: Math.round(avgProcessingTime / 1000 * 10) / 10,
        activeExperts: stage1Experts.length,
      },
    });
  } catch (error: any) {
    console.error('[API] Experts error:', error);

    // Return error response
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Failed to fetch expert data' },
      { status: 500 }
    );
  }
}
