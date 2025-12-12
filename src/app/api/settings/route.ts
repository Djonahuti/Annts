import { NextRequest, NextResponse } from 'next/server';
import { proxyToPHP } from '@/lib/php-api';

// Required for static export
export const dynamic = 'force-static';

/* -------------------------------------------------
   Shared response type (matches frontend interface)
   ------------------------------------------------- */
export interface SettingsResponse {
  id: number;
  logo: string | null;
  logo_blk: string | null;
  footer_write: string | null;
  footer_head: string | null;
  footer_head2: string | null;
  services: string[] | null;
  phone: string[] | null;
  email: string[] | null;
  address: string | null;
  bottom_left: string | null;
  bottom_right: string[] | null;
}

/* -------------------------------------------------
   GET /api/settings
   → returns current settings
   ------------------------------------------------- */
export async function GET(request: NextRequest) {
  try {
    const response = await proxyToPHP('/api/settings', {
      method: 'GET',
      headers: request.headers,
    });
    return response;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

/* -------------------------------------------------
   PATCH /api/settings
   → update settings (used by Edit page)
   ------------------------------------------------- */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.text();
    const response = await proxyToPHP('/api/settings', {
      method: 'PATCH',
      body,
      headers: request.headers,
    });
    return response;
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}