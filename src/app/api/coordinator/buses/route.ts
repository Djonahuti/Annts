import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper: Convert BigInt → string
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  try {
    const coordinator = await prisma.coordinators.findFirst({
      where: { email: email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });

    if (!coordinator) {
      return NextResponse.json({ error: 'Coordinator not found' }, { status: 404 });
    }

    const buses = await prisma.buses.findMany({
      where: { coordinator: BigInt(coordinator.id) },
      select: {
        id: true,
        bus_code: true,
        plate_no: true,
        e_payment: true,
        driver_rel: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        status_history: {
          select: { status: true },
          orderBy: { changed_at: 'desc' },
          take: 1,
        },
      },
    });

    // Filter out buses with "Completed" status
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredBuses = buses.filter((b: any) => {
      const mostRecentStatus = b.status_history && b.status_history.length > 0
        ? b.status_history[0].status
        : 'Active'; // Default to Active if no status history
      return mostRecentStatus !== 'Completed';
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedBuses = filteredBuses.map((b: any) => ({
      id: Number(b.id),
      bus_code: b.bus_code,
      plate_no: b.plate_no,
      e_payment: b.e_payment ? b.e_payment.toString() : null,
      driver_id: b.driver_rel?.id ? Number(b.driver_rel.id) : null,
      driver_name: b.driver_rel?.name || null,
      driver_phone: b.driver_rel?.phone || null,
    }));

    // Sort by bus_code alphabetically (nulls last)
    mappedBuses.sort((a, b) => {
      if (!a.bus_code && !b.bus_code) return 0;
      if (!a.bus_code) return 1;
      if (!b.bus_code) return -1;
      return a.bus_code.localeCompare(b.bus_code);
    });

    const serialized = {
      coordinator: serializeBigInt(coordinator),
      buses: mappedBuses,
    };

    return NextResponse.json(serialized);
  } catch (error) {
    console.error('Error fetching coordinator & buses:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}