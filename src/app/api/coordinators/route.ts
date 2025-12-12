import { NextRequest, NextResponse } from 'next/server';
import { proxyToPHP } from '@/lib/php-api';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const response = await proxyToPHP(`/api/coordinators${url.search}`, {
      method: 'GET',
      headers: request.headers,
    });
    return response;
  } catch (error) {
    console.error('Error fetching coordinators:', error);
    return NextResponse.json({ error: 'Failed to fetch coordinators' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const response = await proxyToPHP('/api/coordinators', {
      method: 'POST',
      body,
      headers: request.headers,
    });
    return response;
  } catch (error) {
    console.error('Error creating coordinator:', error);
    return NextResponse.json({ error: 'Failed to create coordinator' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.text();
    const response = await proxyToPHP('/api/coordinators', {
      method: 'PUT',
      body,
      headers: request.headers,
    });
    return response;
  } catch (error) {
    console.error('Error updating coordinator:', error);
    return NextResponse.json({ error: 'Failed to update coordinator' }, { status: 500 });
  }
}
