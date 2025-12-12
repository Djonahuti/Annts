import { NextRequest, NextResponse } from 'next/server';
import { proxyToPHP } from '@/lib/php-api';

// Required for static export
export const dynamic = 'force-static';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const response = await proxyToPHP(`/api/drivers${url.search}`, {
      method: 'GET',
      headers: request.headers,
    });
    return response;
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return NextResponse.json({ error: 'Failed to fetch drivers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const response = await proxyToPHP('/api/drivers', {
      method: 'POST',
      body,
      headers: request.headers,
    });
    return response;
  } catch (error) {
    console.error('Error registering driver:', error);
    return NextResponse.json({ error: 'Failed to register driver' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.text();
    const response = await proxyToPHP('/api/drivers', {
      method: 'PUT',
      body,
      headers: request.headers,
    });
    return response;
  } catch (error) {
    console.error('Error updating driver:', error);
    return NextResponse.json({ error: 'Failed to update driver' }, { status: 500 });
  }
}