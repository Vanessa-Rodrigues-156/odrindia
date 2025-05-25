import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getJwtUser } from '@/lib/auth-server';
import { cookies } from 'next/headers';

export async function PUT(request: NextRequest) {
  try {
    // Get current user from session
    const currentUser = await getJwtUser(request);
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { userData } = await request.json();
    
    if (!userData || !userData.id) {
      return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
    }
    
    // Make sure the user can only update their own data (unless they're an admin)
    if (userData.id !== currentUser.id && currentUser.userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Cannot update another user\'s data' }, { status: 403 });
    }
    
    // Remove fields that shouldn't be updated directly
    const { password, createdAt, ...updateData } = userData;
    
    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: userData.id },
      data: updateData,
    });
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;
    
    // Update session with new data if it's the current user
    if (userData.id === currentUser.id) {
      // Create new session data
      const sessionData = {
        user: userWithoutPassword,
        exp: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
      
      // Encode session data
      const encodedSession = Buffer.from(JSON.stringify(sessionData)).toString('base64');
      
      // Update the session cookie
      const cookiesStore = await cookies();
      cookiesStore.set({
        name: 'odrindia_session',
        value: encodedSession,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        path: '/',
      });
    }
    
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating user data' },
      { status: 500 }
    );
  }
}
