import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

// Helper to check if user is authenticated
function getSessionFromRequest(request: Request) {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  
  const cookies = Object.fromEntries(
    cookieHeader.split('; ')
      .map(cookie => cookie.split('='))
      .map(([k, v]) => [k, decodeURIComponent(v)])
  );
  
  return cookies.sessionToken || null;
}

// Simple session validation (in production, verify signature/expiry)
function validateSession(token: string | null): { valid: boolean; userId?: number; email?: string } | null {
  if (!token) return null;
  
  try {
    const decoded = atob(token);
    const parts = decoded.split(':');
    if (parts.length >= 3) {
      const userId = parseInt(parts[0], 10);
      const email = parts[1];
      if (!isNaN(userId) && email) {
        return { valid: true, userId, email };
      }
    }
  } catch (e) {
    // Invalid token
  }
  
  return { valid: false };
}

export async function GET(request: Request) {
  try {
    // Check authentication
    const sessionToken = getSessionFromRequest(request);
    const session = validateSession(sessionToken);
    
    if (!session?.valid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Read users from JSON file
    const fileContent = await readFile(usersFilePath, 'utf-8');
    const { users } = JSON.parse(fileContent);
    
    // Find user by ID from session
    const user = users.find((u: any) => u.id === session.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Fetch user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}