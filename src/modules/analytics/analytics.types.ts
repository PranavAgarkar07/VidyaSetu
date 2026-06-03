export class AnalyticsApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'AnalyticsApiError';
    this.statusCode = statusCode;
  }
}

export type AnalyticsOverviewResponse = {
  totalAttempts: number;
  accuracy: number;
  currentStreak: number;
  lastActivity: string | null;
};

export type WeakTopic = {
  topicName: string;
  accuracy: number;
  attempts: number;
  correctAnswers: number;
};
