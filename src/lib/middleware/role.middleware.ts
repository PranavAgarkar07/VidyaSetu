import { NextResponse } from 'next/server';

import type { AuthUser, UserRole } from '@/modules/auth/auth.types';

export function requireRole(...roles: UserRole[]) {
  return (user: AuthUser): { authorized: boolean; response?: NextResponse } => {
    if (!roles.includes(user.role)) {
      return {
        authorized: false,
        response: NextResponse.json(
          { message: 'Insufficient permissions' },
          { status: 403 }
        ),
      };
    }

    return { authorized: true };
  };
}
