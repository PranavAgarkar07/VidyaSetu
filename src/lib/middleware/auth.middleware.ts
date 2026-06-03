import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { jwtService } from '@/lib/auth/jwt';
import type { AuthUser } from '@/modules/auth/auth.types';

export async function requireAuth(
  request: Request
): Promise<
  | { user: AuthUser; response: undefined }
  | { user: undefined; response: NextResponse }
> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');

  if (!token) {
    return {
      user: undefined,
      response: NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      ),
    };
  }

  try {
    const payload = jwtService.verifyAccessToken(token.value);
    return {
      user: {
        id: payload.sub,
        email: '',
        role: payload.role as AuthUser['role'],
      },
      response: undefined,
    };
  } catch {
    return {
      user: undefined,
      response: NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      ),
    };
  }
}
