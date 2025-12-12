// src/app/api/payments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { proxyToPHP } from '@/lib/php-api';

// Required for static export
export const dynamic = 'force-static';

/* -------------------------------------------------
   Response type for ViewPayments
   ------------------------------------------------- */
interface PaymentResponse {
  id: number;
  amount: number | null;
  pay_type: string | null;
  pay_complete: string | null;
  coordinator: string | null;
  created_at: string;
  bus: {
    id: number;
    bus_code: string | null;
    plate_no: string | null;
    e_payment: number | null;
  } | null;
}

/* -------------------------------------------------
   GET /api/payments?busId=123  → old
        /api/payments          → new (all + bus)
   ------------------------------------------------- */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const response = await proxyToPHP(`/api/payments${url.search}`, {
      method: 'GET',
      headers: request.headers,
    });
    return response;
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch payments', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}

/* -------------------------------------------------
   POST /api/payments
   ------------------------------------------------- */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const response = await proxyToPHP('/api/payments', {
      method: 'POST',
      body,
      headers: request.headers,
    });
    return response;
  } catch (error) {
    console.error('Error submitting payment:', error);
    return NextResponse.json(
      { error: 'Failed to submit payment' },
      { status: 500 }
    );
  }
}