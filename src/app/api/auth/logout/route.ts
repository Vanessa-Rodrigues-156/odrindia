import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  
  // Clear the secure session cookie
  cookieStore.delete('odrindia_session');
  
  // Also clear the client-side access cookie
  cookieStore.delete('currentUser');
  
  return NextResponse.json({ success: true });
}
