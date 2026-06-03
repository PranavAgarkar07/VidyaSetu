import { prisma } from '@/lib/prisma';

type OverviewRaw = {
  streakCount: number;
  lastActiveDate: Date | null;
  totalAttempts: number;
  totalCorrect: number;
  totalQuestions: number;
  lastCompletedAt: Date | null;
  lastStartedAt: Date | null;
};

export class AnalyticsRepository {
  static async getQuizSesssions(userId: string) {
    return await prisma.quizSession.findMany({
      where: {
        userId: userId,
      },
      include: {
        responses: {
          include: {
            question: {
              include: {
                topic: true,
              },
            },
          },
        },
      },
    });
  }

  static async getOverview(userId: string): Promise<OverviewRaw | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        streakCount: true,
        lastActiveDate: true,
      },
    });

    if (!user) return null;

    const aggregation = await prisma.quizSession.aggregate({
      where: { userId },
      _count: { id: true },
      _sum: { correctCount: true, totalQuestions: true },
      _max: { completedAt: true, startedAt: true },
    });

    return {
      streakCount: user.streakCount,
      lastActiveDate: user.lastActiveDate,
      totalAttempts: aggregation._count.id,
      totalCorrect: aggregation._sum.correctCount ?? 0,
      totalQuestions: aggregation._sum.totalQuestions ?? 0,
      lastCompletedAt: aggregation._max.completedAt,
      lastStartedAt: aggregation._max.startedAt,
    };
  }
}
