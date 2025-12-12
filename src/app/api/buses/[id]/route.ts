// src/app/api/buses/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { proxyToPHP } from '@/lib/php-api';

// Required for static export
export const dynamic = 'force-static';

export async function generateStaticParams(): Promise<{ id: string }[]> {
  // Return empty array for static export (routes won't actually work in static export)
  return [];
}

/* -------------------------------------------------
   GET /api/buses/123
   → returns { bus_code: "ABC123" }
   ------------------------------------------------- */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await proxyToPHP(`/api/buses?id=${id}`, {
      method: 'GET',
      headers: request.headers,
    });
    return response;
  } catch (error) {
    console.error('Error fetching bus:', error);
    return NextResponse.json({ error: 'Failed to fetch bus' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.text();
    const response = await proxyToPHP(`/api/buses?id=${id}`, {
      method: 'PATCH',
      body,
      headers: request.headers,
    });
    return response;
  } catch (error) {
    console.error('Error updating bus:', error);
    return NextResponse.json({ error: 'Failed to update bus' }, { status: 500 });
  }
}