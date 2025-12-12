import { NextResponse } from 'next/server';
import { PrismaClient, buses, coordinators } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to serialize BigInt values
function serializeBigInt<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_key, value) => (typeof value === 'bigint' ? Number(value) : value))
  );
}

// Define the type for bus with coordinator relation
type BusWithCoordinator = buses & {
  coordinator_rel: Pick<coordinators, 'id' | 'name' | 'email' | 'phone'> | null;
  driver_rel: { id: bigint; name: string | null; email: string | null } | null;
};

export async function GET(request: Request) {
  try {
    // If driverId is provided, return buses for that driver; otherwise return all buses
    const { searchParams } = new URL(request.url);
    const driverIdParam = searchParams.get('driverId');
    const unassigned = searchParams.get('unassigned');

    const parsedDriverId = driverIdParam ? parseInt(driverIdParam) : undefined;
    if (driverIdParam && isNaN(parsedDriverId!)) {
      return NextResponse.json({ error: 'Invalid driver ID' }, { status: 400 });
    }

    const buses = await prisma.buses.findMany({
      where: parsedDriverId !== undefined
        ? { driver: BigInt(parsedDriverId) }
        : (unassigned === 'true' ? { driver: null } : undefined),
      include: {
        coordinator_rel: {
          select: { id: true, name: true, email: true, phone: true },
        },
        driver_rel: {
          select: { id: true, name: true, email: true },
        },
        status_history: {
          select: { status: true },
          orderBy: { changed_at: 'desc' },
          take: 1,
        },
      },
      orderBy: { created_at: 'desc' },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedBuses = buses.map((bus: any) => {
      // Get most recent status from bus_status_history, default to "Active" if none exists
      const mostRecentStatus = bus.status_history && bus.status_history.length > 0
        ? bus.status_history[0].status
        : 'Active';

      return {
        id: Number(bus.id),
        bus_code: bus.bus_code,
        plate_no: bus.plate_no,
        driver_id: bus.driver ? Number(bus.driver) : null,
        driver_name: bus.driver_rel?.name || null,
        driver_email: bus.driver_rel?.email || null,
        contract_date: bus.contract_date ? bus.contract_date.toISOString().split('T')[0] : null,
        start_date: bus.start_date ? bus.start_date.toISOString().split('T')[0] : null,
        date_collected: bus.date_collected ? bus.date_collected.toISOString().split('T')[0] : null,
        agreed_date: bus.agreed_date ? bus.agreed_date.toISOString().split('T')[0] : null,
        t_income: bus.t_income ? Number(bus.t_income).toString() : null,
        initial_owe: bus.initial_owe ? Number(bus.initial_owe).toString() : null,
        e_payment: bus.e_payment ? Number(bus.e_payment).toString() : null,
        deposited: bus.deposited ? Number(bus.deposited).toString() : null,
        letter: bus.letter,
        first_pay: bus.first_pay ? bus.first_pay.toISOString().split('T')[0] : null,
        coordinator_name: bus.coordinator_rel?.name || 'N/A',
        coordinator_email: bus.coordinator_rel?.email || 'N/A',
        coordinator_phone: bus.coordinator_rel?.phone || [],
        coordinator_id: bus.coordinator_rel ? Number(bus.coordinator_rel.id) : null,
        status: mostRecentStatus,
      };
    });

    // Sort by bus_code alphabetically (nulls last)
    formattedBuses.sort((a, b) => {
      if (!a.bus_code && !b.bus_code) return 0;
      if (!a.bus_code) return 1;
      if (!b.bus_code) return -1;
      return a.bus_code.localeCompare(b.bus_code);
    });

    return NextResponse.json(serializeBigInt(formattedBuses));
  } catch (error) {
    console.error('Error fetching buses:', error);
    return NextResponse.json({ error: 'Failed to fetch buses' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      bus_code,
      plate_no,
      driver,
      coordinator,
      letter,
      e_payment,
      contract_date,
      agreed_date,
      date_collected,
      start_date,
      first_pay,
      initial_owe,
      deposited,
      t_income,
    } = body;

    await prisma.buses.create({
      data: {
        bus_code: bus_code || null,
        plate_no: plate_no || null,
        driver: driver ? BigInt(driver) : null,
        coordinator: coordinator ? BigInt(coordinator) : null,
        letter: letter !== null ? letter : null,
        e_payment: e_payment ? BigInt(e_payment) : null,
        contract_date: contract_date ? new Date(contract_date) : null,
        agreed_date: agreed_date ? new Date(agreed_date) : null,
        date_collected: date_collected ? new Date(date_collected) : null,
        start_date: start_date ? new Date(start_date) : null,
        first_pay: first_pay ? new Date(first_pay) : null,
        initial_owe: initial_owe ? BigInt(initial_owe) : null,
        deposited: deposited ? BigInt(deposited) : null,
        t_income: t_income ? BigInt(t_income) : null,
      },
    });

    return NextResponse.json({ message: 'Bus added successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error adding bus:', error);
    return NextResponse.json({ error: 'Failed to add bus' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}