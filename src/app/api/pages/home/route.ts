import { NextRequest, NextResponse } from 'next/server';
import { proxyToPHP } from '@/lib/php-api';

export async function GET(request: NextRequest) {
  try {
    const response = await proxyToPHP('/api/pages/home', {
      method: 'GET',
      headers: request.headers,
    });
    return response;
  } catch (error) {
    console.error('Error fetching home page:', error);
    return NextResponse.json({ error: 'Failed to fetch home page' }, { status: 500 });
  }
}