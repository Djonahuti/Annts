// src/app/api/buses/[id]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

/* -------------------------------------------------
   GET /api/buses/123
   → returns { bus_code: "ABC123" }
   ------------------------------------------------- */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const busId = parseInt(id, 10);
    if (isNaN(busId)) {
      return NextResponse.json({ error: 'Invalid bus ID' }, { status: 400 });
    }

    const bus = await prisma.buses.findUnique({
      where: { id: BigInt(busId) },
      select: { bus_code: true },
    });

    if (!bus) {
      return NextResponse.json({ error: 'Bus not found' }, { status: 404 });
    }

    return NextResponse.json({ bus_code: bus.bus_code });
  } catch (error) {
    console.error('Error fetching bus:', error);
    return NextResponse.json({ error: 'Failed to fetch bus' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

/* -------------------------------------------------
   PATCH /api/buses/123
   → { e_payment: 60000 } → updates e_payment
   ------------------------------------------------- */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const busId = parseInt(id, 10);
    if (isNaN(busId)) {
      return NextResponse.json({ error: 'Invalid bus ID' }, { status: 400 });
    }

    const payload = await request.json();
    const data: Prisma.busesUpdateInput = {
      ...(Object.prototype.hasOwnProperty.call(payload, 'bus_code')
        ? { bus_code: payload.bus_code ?? null }
        : {}),
      ...(Object.prototype.hasOwnProperty.call(payload, 'plate_no')
        ? { plate_no: payload.plate_no ?? null }
        : {}),
      ...(Object.prototype.hasOwnProperty.call(payload, 'driver')
        ? { driver: payload.driver ? BigInt(payload.driver) : null }
        : {}),
      ...(Object.prototype.hasOwnProperty.call(payload, 'coordinator')
        ? { coordinator: payload.coordinator ? BigInt(payload.coordinator) : null }
        : {}),
      ...(Object.prototype.hasOwnProperty.call(payload, 'letter')
        ? { letter: payload.letter }
        : {}),
      ...(Object.prototype.hasOwnProperty.call(payload, 'e_payment')
        ? { e_payment: payload.e_payment ? BigInt(payload.e_payment) : null }
        : {}),
      ...(Object.prototype.hasOwnProperty.call(payload, 'initial_owe')
        ? { initial_owe: payload.initial_owe ? BigInt(payload.initial_owe) : null }
        : {}),
      ...(Object.prototype.hasOwnProperty.call(payload, 'deposited')
        ? { deposited: payload.deposited ? BigInt(payload.deposited) : null }
        : {}),
      ...(Object.prototype.hasOwnProperty.call(payload, 't_income')
        ? { t_income: payload.t_income ? BigInt(payload.t_income) : null }
        : {}),
      ...(Object.prototype.hasOwnProperty.call(payload, 'contract_date')
        ? { contract_date: payload.contract_date ? new Date(payload.contract_date) : null }
        : {}),
      ...(Object.prototype.hasOwnProperty.call(payload, 'agreed_date')
        ? { agreed_date: payload.agreed_date ? new Date(payload.agreed_date) : null }
        : {}),
      ...(Object.prototype.hasOwnProperty.call(payload, 'date_collected')
        ? { date_collected: payload.date_collected ? new Date(payload.date_collected) : null }
        : {}),
      ...(Object.prototype.hasOwnProperty.call(payload, 'start_date')
        ? { start_date: payload.start_date ? new Date(payload.start_date) : null }
        : {}),
      ...(Object.prototype.hasOwnProperty.call(payload, 'first_pay')
        ? { first_pay: payload.first_pay ? new Date(payload.first_pay) : null }
        : {}),
    };

    const updated = await prisma.buses.update({
      where: { id: BigInt(busId) },
      data,
    });

    return NextResponse.json({
      message: 'Bus updated',
      bus: {
        id: Number(updated.id),
        bus_code: updated.bus_code,
        plate_no: updated.plate_no,
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Bus not found' }, { status: 404 });
    }
    console.error('Error updating bus:', error);
    return NextResponse.json({ error: 'Failed to update bus' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}