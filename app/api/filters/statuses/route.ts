import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const statusesFilePath = path.join(process.cwd(), 'data', 'filters', 'statuses.json');

export async function GET() {
  try {
    const fileContent = await readFile(statusesFilePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch statuses error:', error);
    return NextResponse.json(
      { error: 'Could not read statuses' },
      { status: 500 }
    );
  }
}