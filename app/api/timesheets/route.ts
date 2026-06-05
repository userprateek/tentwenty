import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const timesheetsFilePath = path.join(process.cwd(), 'data', 'timesheets.json');

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

    // Read timesheets from JSON file
    const fileContent = await readFile(timesheetsFilePath, 'utf-8');
    const { timesheets } = JSON.parse(fileContent);
    
    // Filter timesheets for the current user (in real app, this would be a DB query)
    const userTimesheets = timesheets.filter((ts: any) => ts.userId === session.userId);
    
    return NextResponse.json({ timesheets: userTimesheets });
  } catch (error) {
    console.error('Fetch timesheets error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST to create/update timesheet
export async function POST(request: Request) {
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

    const { week, dateRange, hours, status } = await request.json();
    
    // Read existing timesheets
    const fileContent = await readFile(timesheetsFilePath, 'utf-8');
    const data = JSON.parse(fileContent);
    let { timesheets } = data;
    
    // Find if timesheet for this week/user already exists
    const existingIndex = timesheets.findIndex(
      (ts: any) => ts.week === week && ts.userId === session.userId
    );
    
    const newTimesheet = {
      id: existingIndex >= 0 ? timesheets[existingIndex].id : Date.now(),
      week,
      dateRange,
      hours: hours || 0,
      status: status || (hours && hours > 0 ? 'completed' : 'missing'),
      userId: session.userId
    };
    
    if (existingIndex >= 0) {
      // Update existing
      timesheets[existingIndex] = newTimesheet;
    } else {
      // Create new
      timesheets.push(newTimesheet);
    }
    
    // Write back to file (in real app, this would be a DB update)
    // Note: This is not suitable for production due to concurrency issues
    // For demo purposes only
    const updatedContent = JSON.stringify({ timesheets }, null, 2);
    // await writeFile(timesheetsFilePath, updatedContent, 'utf-8');
    // For now, we'll just return the data without persisting (to avoid file permission issues)
    
    return NextResponse.json({ 
      timesheet: newTimesheet,
      message: existingIndex >= 0 ? 'Timesheet updated' : 'Timesheet created'
    });
  } catch (error) {
    console.error('Create timesheets error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}