import { NextResponse } from 'next/server';
import { AnalyticsService } from './analytics.service';
import { AnalyticsApiError } from './analytics.types';
import { SetCookies } from '@/lib/auth/cookies';

export class AnalyticsController {
  static async getWeakTopics() {
    try {
      const access_token = await SetCookies.verifyCookies();

      if (!access_token) {
        return NextResponse.json(
          { success: false, message: 'Unauthorized' },
          { status: 401 }
        );
      }

      const data = await AnalyticsService.getWeakTopics(access_token.sub);

      return NextResponse.json({ success: true, data });
    } catch (error) {
      if (error instanceof AnalyticsApiError) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: error.statusCode }
        );
      }

      return NextResponse.json(
        { success: false, message: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  static async getAnalytics(req: Request) {
    try {
      const access_token = await SetCookies.verifyCookies();

      if (!access_token) {
        return NextResponse.json(
          { success: false, message: 'Unauthorized' },
          { status: 401 }
        );
      }

      const data = await AnalyticsService.getOverview(access_token.sub);

      return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
      if (error instanceof AnalyticsApiError) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: error.statusCode }
        );
      }

      return NextResponse.json(
        { success: false, message: 'Internal server error' },
        { status: 500 }
      );
    }
  }
}
