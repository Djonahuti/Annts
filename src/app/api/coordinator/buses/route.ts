import { NextRequest, NextResponse } from 'next/server';
import { proxyToPHP } from '@/lib/php-api';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const response = await proxyToPHP(`/api/coordinator/buses${url.search}`, {
      method: 'GET',
      headers: request.headers,
    });
    return response;
  } catch (error) {
    console.error('Error fetching coordinator & buses:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}