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
    const response = await proxyToPHP(`/api/buses/${id}/expected-payment`, {
      method: 'POST',
      body,
      headers: request.headers,
    });
    return response;
  } catch (error) {
    console.error('Error creating/updating expected payment:', error);
    return NextResponse.json(
      { error: 'Failed to create/update expected payment' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const response = await proxyToPHP(`/api/buses/${id}/expected-payment${url.search}`, {
      method: 'GET',
      headers: request.headers,
    });
    return response;
  } catch (error) {
    console.error('Error fetching expected payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expected payments', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

