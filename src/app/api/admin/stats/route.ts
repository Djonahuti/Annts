import { NextRequest, NextResponse } from 'next/server';
import { proxyToPHP } from '@/lib/php-api';

// Required for static export (though these routes won't work in static export)
export const dynamic = 'force-static';

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