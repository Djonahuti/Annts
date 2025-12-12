import { NextRequest, NextResponse } from 'next/server';
import { proxyToPHP } from '@/lib/php-api';


export async function GET(request: NextRequest) {
  try {
    const response = await proxyToPHP('/api/admin/stats', {
      method: 'GET',
      headers: request.headers,
    });
    return response;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}