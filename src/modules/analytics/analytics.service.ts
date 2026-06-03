import { AnalyticsRepository } from './analytics.repository';
import { AnalyticsApiError } from './analytics.types';
import type { AnalyticsOverviewResponse, WeakTopic } from './analytics.types';

export class AnalyticsService {
  static async getOverview(userId: string): Promise<AnalyticsOverviewResponse> {
    const data = await AnalyticsRepository.getOverview(userId);

    if (!data) {
      throw new AnalyticsApiError('User not found', 404);
    }

    const accuracy =
      data.totalQuestions > 0
        ? Number(((data.totalCorrect / data.totalQuestions) * 100).toFixed(1))
        : 0;

    const lastActivity =
      data.lastCompletedAt ?? data.lastStartedAt ?? data.lastActiveDate;

    return {
      totalAttempts: data.totalAttempts,
      accuracy,
      currentStreak: data.streakCount,
      lastActivity: lastActivity ? lastActivity.toISOString() : null,
    };
  }

  static async getWeakTopics(userId: string): Promise<WeakTopic[]> {
    const sessions = await AnalyticsRepository.getQuizSesssions(userId);

    const topicMap = new Map<
      string,
      { topicName: string; correct: number; total: number }
    >();

    for (const session of sessions) {
      for (const response of session.responses) {
        if (response.isCorrect === null) continue;

        const topic = response.question.topic;
        if (!topic) continue;

        const entry = topicMap.get(topic.id);
        if (entry) {
          entry.total += 1;
          if (response.isCorrect) entry.correct += 1;
        } else {
          topicMap.set(topic.id, {
            topicName: topic.title,
            correct: response.isCorrect ? 1 : 0,
            total: 1,
          });
        }
      }
    }

    const weakTopics: WeakTopic[] = [];

    for (const [, value] of topicMap) {
      const accuracy = (value.correct / value.total) * 100;
      if (accuracy < 60) {
        weakTopics.push({
          topicName: value.topicName,
          accuracy: Math.round(accuracy * 10) / 10,
          attempts: value.total,
          correctAnswers: value.correct,
        });
      }
    }

    weakTopics.sort((a, b) => a.accuracy - b.accuracy);

    return weakTopics.slice(0, 10);
  }
}
