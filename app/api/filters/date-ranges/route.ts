import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const dateRangesFilePath = path.join(process.cwd(), 'data', 'filters', 'date-ranges.json');

export async function GET() {
  try {
    const fileContent = await readFile(dateRangesFilePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch date ranges error:', error);
    return NextResponse.json(
      { error: 'Could not read date ranges' },
      { status: 500 }
    );
  }
}