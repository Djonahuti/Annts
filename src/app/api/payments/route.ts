// src/app/api/payments/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const busIdParam = searchParams.get('busId');

    // ---- 1. Legacy: ?busId=123 ----
    if (busIdParam) {
      const busId = parseInt(busIdParam, 10);
      if (isNaN(busId)) {
        return NextResponse.json({ error: 'Invalid bus ID' }, { status: 400 });
      }

      const payments = await prisma.payment.findMany({
        where: { bus: BigInt(busId) },
        include: {
          bus_rel: {
            select: {
              id: true,
              bus_code: true,
              plate_no: true,
              e_payment: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      });

      // Serialize BigInts to numbers and format dates
      const formatted = payments.map((p) => {
        let weekFormatted = null;
        if (p.week) {
          if (p.week instanceof Date) {
            weekFormatted = p.week.toISOString().split('T')[0];
          } else {
            try {
              weekFormatted = new Date(p.week).toISOString().split('T')[0];
            } catch (e) {
              weekFormatted = null;
            }
          }
        }

        let paymentDateFormatted = null;
        if (p.payment_date) {
          if (p.payment_date instanceof Date) {
            paymentDateFormatted = p.payment_date.toISOString().split('T')[0];
          } else {
            try {
              paymentDateFormatted = new Date(p.payment_date).toISOString().split('T')[0];
            } catch (e) {
              paymentDateFormatted = null;
            }
          }
        }

        return {
          id: Number(p.id),
          amount: p.amount ? Number(p.amount) : null,
          pay_type: p.pay_type ?? null,
          pay_complete: p.pay_complete ?? null,
          coordinator: p.coordinator ?? null,
          created_at: p.created_at instanceof Date ? p.created_at.toISOString() : String(p.created_at),
          payment_date: paymentDateFormatted,
          week: weekFormatted,
          p_week: p.p_week ?? null,
          receipt: p.receipt ?? null,
          sender: p.sender ?? null,
          payment_day: p.payment_day ?? null,
          issue: p.issue ?? null,
          inspection: p.inspection ?? null,
          completed_by: p.completed_by ?? null,
          bus: p.bus_rel
            ? {
                id: Number(p.bus_rel.id),
                bus_code: p.bus_rel.bus_code ?? null,
                plate_no: p.bus_rel.plate_no ?? null,
                e_payment: p.bus_rel.e_payment ? Number(p.bus_rel.e_payment) : null,
              }
            : null,
        };
      });

      return NextResponse.json(formatted);
    }

    // ---- 2. New: All payments with bus details ----
    const rows = await prisma.payment.findMany({
      select: {
        id: true,
        amount: true,
        pay_type: true,
        pay_complete: true,
        created_at: true,
        coordinator: true,
        bus_rel: {                     // ← use the relation
          select: {
            id: true,
            bus_code: true,
            plate_no: true,
            e_payment: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    const formatted: PaymentResponse[] = rows.map((p) => ({
      id: Number(p.id),
      amount: p.amount ? Number(p.amount) : null,
      pay_type: p.pay_type ?? null,
      pay_complete: p.pay_complete ?? null,
      coordinator: p.coordinator ?? null,
      created_at: p.created_at instanceof Date ? p.created_at.toISOString() : String(p.created_at),
      bus: p.bus_rel
        ? {
            id: Number(p.bus_rel.id),
            bus_code: p.bus_rel.bus_code ?? null,
            plate_no: p.bus_rel.plate_no ?? null,
            e_payment: p.bus_rel.e_payment ? Number(p.bus_rel.e_payment) : null,
          }
        : null,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching payments:', error);
    // Log more details for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Don't disconnect on error - let Prisma manage connections
    // Only return error response
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
export async function POST(request: Request) {
  // Parse body once so we can reuse on retry
  const data = await request.json();
  const {
    week,
    completed_by,
    coordinator,
    bus,           // ← this is bus ID (number)
    p_week,
    receipt,
    amount,
    sender,
    payment_day,
    payment_date,
    pay_type,
    pay_complete,
    issue,
    inspection,
  } = data;

  if (
    !week ||
    !completed_by ||
    !coordinator ||
    !bus ||
    !p_week ||
    !receipt ||
    !payment_day ||
    !payment_date ||
    !pay_type ||
    !pay_complete ||
    !issue ||
    !inspection
  ) {
    return NextResponse.json(
      { error: 'All required fields must be provided' },
      { status: 400 }
    );
  }

  const createData = {
    week: new Date(week),
    completed_by,
    coordinator,
    bus: BigInt(bus),
    p_week,
    receipt,
    amount: amount ? Number(amount) : null,
    sender: sender || null,
    payment_day,
    payment_date: new Date(payment_date),
    pay_type,
    pay_complete,
    issue,
    inspection,
    created_at: new Date(),
  };

  // Create payment and update bus.t_income atomically
  const createPaymentAndUpdateIncome = async () => {
    const amountNumber = createData.amount ? Number(createData.amount) : 0;
    const amountBig = BigInt(amountNumber);
    const busIdBig = createData.bus;

    await prisma.$transaction(async (tx) => {
      await tx.payment.create({ data: createData });

      if (amountBig > BigInt(0) && busIdBig) {
        const current = await tx.buses.findUnique({
          where: { id: busIdBig },
          select: { t_income: true },
        });

        if (current) {
          const newIncome = (current.t_income ?? BigInt(0)) + amountBig;
          await tx.buses.update({
            where: { id: busIdBig },
            data: { t_income: newIncome },
          });
        }
      }
    });
  };

  try {
    await createPaymentAndUpdateIncome();

    return NextResponse.json(
      { message: 'Payment submitted successfully' },
      { status: 201 }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any    
  } catch (error: any) {
    console.error('Error submitting payment:', error);

    if (error.code === 'P2002') {
      // Reset sequence for payment and retry once
      try {
        await prisma.$executeRawUnsafe(`
          SELECT setval(
            'public.payment_id_seq',
            COALESCE((SELECT MAX(id) FROM public.payment), 1),
            true
          );
        `);

        await createPaymentAndUpdateIncome();
        return NextResponse.json(
          { message: 'Payment submitted successfully' },
          { status: 201 }
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any        
      } catch (healErr: any) {
        console.error('Payment sequence self-heal failed:', healErr);
        return NextResponse.json(
          { error: 'Unique constraint violation on payment id; sequence reset failed.' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to submit payment' },
      { status: 500 }
    );
  }
}

// Add serializeBigInt util, copied if needed:
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeBigInt(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'bigint') return obj.toString();
  if (Array.isArray(obj)) return obj.map(serializeBigInt);
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, serializeBigInt(v)])
    );
  }
  return obj;
}