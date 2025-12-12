import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

function serializeBigInt<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_key, value) => (typeof value === 'bigint' ? Number(value) : value))
  );
}

// Helper to get Monday of a given week (UTC-safe to avoid Sunday shifts)
function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getUTCDay(); // 0 = Sunday, 1 = Monday, ...
  const daysToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() + daysToMonday);
  monday.setUTCHours(0, 0, 0, 0);
  return monday;
}

// Helper to format date as YYYY-MM-DD for PostgreSQL Date comparison
function formatDateForPostgres(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const busId = BigInt(id);

    // Verify admin exists and get their ID
    const admin = await prisma.admins.findUnique({
      where: { email: session.user.email! },
    });

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    const body = await request.json();
    const { week_start, amount, reason } = body;

    if (!week_start || !amount) {
      return NextResponse.json(
        { error: 'week_start and amount are required' },
        { status: 400 }
      );
    }

    // Verify bus exists
    const bus = await prisma.buses.findUnique({
      where: { id: busId },
    });

    if (!bus) {
      return NextResponse.json({ error: 'Bus not found' }, { status: 404 });
    }

    // Normalize week_start to Monday (UTC) to avoid off-by-one when saving
    const [year, month, day] = week_start.split('-').map(Number);
    const parsedInput = new Date(Date.UTC(year, month - 1, day));
    const weekStartDate = getMondayOfWeek(parsedInput);

    // Check if expected payment already exists for this bus and week
    const existing = await prisma.expected_payment.findFirst({
      where: {
        bus: busId,
        week_start: weekStartDate,
      },
    });

    let expectedPayment;
    if (existing) {
      // Update existing
      expectedPayment = await prisma.expected_payment.update({
        where: { id: existing.id },
        data: {
          amount: BigInt(amount),
          reason: reason || null,
          created_by: BigInt(admin.id),
        },
      });
    } else {
      // Create new
      expectedPayment = await prisma.expected_payment.create({
        data: {
          bus: busId,
          week_start: weekStartDate,
          amount: BigInt(amount),
          reason: reason || null,
          created_by: BigInt(admin.id),
        },
      });
    }

    return NextResponse.json(serializeBigInt(expectedPayment), { status: 201 });
  } catch (error) {
    console.error('Error creating/updating expected payment:', error);
    return NextResponse.json(
      { error: 'Failed to create/update expected payment' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const busId = BigInt(id);

    const { searchParams } = new URL(request.url);
    const currentWeek = searchParams.get('current');
    const weekStart = searchParams.get('week_start');

    let expectedPayments;

    if (weekStart) {
      try {
        // Parse the week_start string (format: YYYY-MM-DD) in UTC
        const [year, month, day] = weekStart.split('-').map(Number);
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
          throw new Error(`Invalid date format: ${weekStart}`);
        }

        const inputDate = new Date(Date.UTC(year, month - 1, day));
        const normalizedMonday = getMondayOfWeek(inputDate); // UTC-safe Monday

        // Use the normalized Monday directly (UTC midnight) for comparison
        const searchDate = normalizedMonday;

        const payment = await prisma.expected_payment.findFirst({
          where: {
            bus: busId,
            week_start: searchDate,
          },
        });

        expectedPayments = payment ? [payment] : [];
      } catch (dateError) {
        console.error('Error parsing date:', dateError);
        if (dateError instanceof Error) {
          console.error('Date error details:', dateError.message, dateError.stack);
        }
        throw dateError;
      }
    } else if (currentWeek === 'true') {
      // Get the most recent expected payment
      const payment = await prisma.expected_payment.findFirst({
        where: { bus: busId },
        orderBy: { week_start: 'desc' },
      });
      expectedPayments = payment ? [payment] : [];
    } else {
      // Get all expected payments
      expectedPayments = await prisma.expected_payment.findMany({
        where: { bus: busId },
        orderBy: { week_start: 'desc' },
        take: 100,
      });
    }

    return NextResponse.json(serializeBigInt(expectedPayments));
  } catch (error) {
    console.error('Error fetching expected payments:', error);
    // Log more details for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to fetch expected payments', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

