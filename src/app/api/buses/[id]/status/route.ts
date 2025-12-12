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
    const { status, note } = body;

    if (!status || typeof status !== 'string') {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // Verify bus exists
    const bus = await prisma.buses.findUnique({
      where: { id: busId },
    });

    if (!bus) {
      return NextResponse.json({ error: 'Bus not found' }, { status: 404 });
    }

    // Create status history entry
    const statusHistory = await prisma.bus_status_history.create({
      data: {
        bus: busId,
        status,
        note: note || null,
        changed_by: BigInt(admin.id),
      },
    });

    return NextResponse.json(serializeBigInt(statusHistory), { status: 201 });
  } catch (error) {
    console.error('Error creating status history:', error);
    return NextResponse.json({ error: 'Failed to create status history' }, { status: 500 });
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

    const statusHistory = await prisma.bus_status_history.findMany({
      where: { bus: busId },
      orderBy: { changed_at: 'desc' },
      take: 100,
    });

    return NextResponse.json(serializeBigInt(statusHistory));
  } catch (error) {
    console.error('Error fetching status history:', error);
    return NextResponse.json({ error: 'Failed to fetch status history' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

