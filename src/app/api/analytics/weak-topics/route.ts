import { AnalyticsController } from '@/modules/analytics/analytics.controller';

export async function GET() {
  return AnalyticsController.getWeakTopics();
}
