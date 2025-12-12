import { NextRequest, NextResponse } from 'next/server';
import { proxyToPHP } from '@/lib/php-api';

// Required for static export
export const dynamic = 'force-static';

export async function generateStaticParams(): Promise<{ id: string }[]> {
  // Return empty array for static export (routes won't actually work in static export)
  return [];
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.text();
    const response = await proxyToPHP(`/api/buses/${id}/status`, {
      method: 'POST',
      body,
      headers: request.headers,
    });
    return response;
  } catch (error) {
    console.error('Error creating status history:', error);
    return NextResponse.json({ error: 'Failed to create status history' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await proxyToPHP(`/api/buses/${id}/status`, {
      method: 'GET',
      headers: request.headers,
    });
    return response;
  } catch (error) {
    console.error('Error fetching status history:', error);
    return NextResponse.json({ error: 'Failed to fetch status history' }, { status: 500 });
  }
}

