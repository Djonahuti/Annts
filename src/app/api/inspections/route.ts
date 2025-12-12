import { NextRequest, NextResponse } from 'next/server';
import { proxyToPHP } from '@/lib/php-api';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const response = await proxyToPHP(`/api/inspections${url.search}`, {
      method: 'GET',
      headers: request.headers,
    });
    return response;
  } catch (error) {
    console.error('Error fetching inspections:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const response = await proxyToPHP('/api/inspections', {
      method: 'POST',
      body,
      headers: request.headers,
    });
    return response;
  } catch (error) {
    console.error('Error creating inspection:', error);
    return NextResponse.json(
      {
        error: 'Failed to create inspection',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

