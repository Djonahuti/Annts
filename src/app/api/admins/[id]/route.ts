import { NextRequest, NextResponse } from 'next/server';
import { proxyToPHP } from '@/lib/php-api';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.text();
    const response = await proxyToPHP(`/api/admins?id=${id}`, {
      method: 'PATCH',
      body,
      headers: request.headers,
    });
    return response;
  } catch (error) {
    console.error('Error updating admin role:', error);
    return NextResponse.json({ error: 'Failed to update admin role' }, { status: 500 });
  }
}

