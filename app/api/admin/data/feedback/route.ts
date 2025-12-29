import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { feedback } from '@/lib/db/schema';
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
    const limit = parseInt(searchParams.get('limit') || '50');

    // Get all feedback with pagination
    const feedbackResult = await db
      .select()
      .from(feedback)
      .orderBy(desc(feedback.createdAt))
      .limit(limit);

    // Calculate summary stats
    const statsResult = await db
      .select({
        total: count(),
        avgRating: avg(feedback.rating),
      })
      .from(feedback);

    // Get rating distribution
    const ratingDistributionResult = await db
      .select({
        rating: feedback.rating,
        count: count(),
      })
      .from(feedback)
      .groupBy(feedback.rating)
      .orderBy(feedback.rating);

    // Get category breakdown
    const categoryBreakdownResult = await db
      .select({
        category: feedback.category,
        count: count(),
      })
      .from(feedback)
      .where(sql`${feedback.category} IS NOT NULL`)
      .groupBy(feedback.category);

    const totalFeedback = statsResult[0]?.total || 0;
    const avgRating = statsResult[0]?.avgRating || 0;

    // Build rating distribution (1-5 stars)
    const ratingDistribution = [1, 2, 3, 4, 5].map((rating: number) => {
      const found = ratingDistributionResult.find((r: any) => r.rating === rating);
      return found?.count || 0;
    });

    // Build category breakdown
    const categoryCounts: Record<string, number> = {};
    categoryBreakdownResult.forEach((item: any) => {
      if (item.category) {
        categoryCounts[item.category] = item.count;
      }
    });

    // Calculate positive/negative counts
    const positiveCount = ratingDistribution[3] + ratingDistribution[4]; // 4-5 stars
    const negativeCount = ratingDistribution[0] + ratingDistribution[1]; // 1-2 stars

    return NextResponse.json({
      feedback: feedbackResult,
      stats: {
        totalFeedback,
        avgRating: Math.round(avgRating * 10) / 10,
        positiveCount,
        negativeCount,
      },
      ratingDistribution,
      categoryCounts,
    });
  } catch (error: any) {
    console.error('[API] Feedback error:', error);

    // Return error response
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Failed to fetch feedback data' },
      { status: 500 }
    );
  }
}
