import { NextRequest, NextResponse } from 'next/server';
import { getJwtUser } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
  try {
    // Get user from session
    const user = await getJwtUser(request);
    
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    
    // Return user data
    return NextResponse.json({ authenticated: true, user });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { error: 'An error occurred while retrieving session' },
      { status: 500 }
    );
  }
}
