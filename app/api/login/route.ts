import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Read users from JSON file
    const fileContent = await readFile(usersFilePath, 'utf-8');
    const { users } = JSON.parse(fileContent);

    // Find user by email
    const user = users.find((u: any) => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // In a real app, compare hashed password
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session token (simplified)
    const sessionToken = btoa(`${user.id}:${user.email}:${Date.now()}`);

    // Set cookie and return user data (without password)
    const { password: _, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      user: userWithoutPassword,
      message: 'Login successful'
    });

    // Set HTTP-only cookie for session
    response.cookies.set('sessionToken', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: GET to check auth status (for debugging)
export async function GET() {
  try {
    const fileContent = await readFile(usersFilePath, 'utf-8');
    const { users } = JSON.parse(fileContent);
    // Return users without passwords for safety
    const usersSafe = users.map(({ password: _, ...rest }: any) => rest);
    return NextResponse.json({ users: usersSafe });
  } catch (error) {
    return NextResponse.json(
      { error: 'Could not read users' },
      { status: 500 }
    );
  }
}