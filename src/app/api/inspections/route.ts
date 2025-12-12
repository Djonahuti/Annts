import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// eslint-disable-next-line @typescript-eslint/no-explicit-any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeBigInt(obj: any): any {
  return JSON.parse(
    JSON.stringify(obj, (_key, value) => (typeof value === 'bigint' ? Number(value) : value))
  );
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const coordinatorId = searchParams.get('coordinatorId');
    const busId = searchParams.get('busId');
    const month = searchParams.get('month');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    // If admin, can see all. If coordinator, only their own (by name stored in inspection.coordinator)
    if (session.user.role === 'coordinator') {
      const coordinator = await prisma.coordinators.findFirst({
        where: { email: session.user.email },
      });
      if (coordinator?.name) {
        where.coordinator = coordinator.name;
      }
    } else if (coordinatorId) {
      // For admin filters, coordinatorId will be the coordinator name string
      where.coordinator = coordinatorId;
    }

    if (busId) {
      where.bus = BigInt(busId);
    }

    if (month) {
      const monthDate = new Date(month);
      const startOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const endOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
      where.month = {
        gte: startOfMonth,
        lte: endOfMonth,
      };
    }

    let inspections: unknown[];
    try {
      inspections = await prisma.inspection.findMany({
        where,
        include: {
          bus_rel: {
            select: {
              id: true,
              bus_code: true,
              plate_no: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    } catch (queryError) {
      // If the Prisma engine crashes for some reason, log it and fall back to an empty list
      console.error('Primary inspection query failed, returning empty list:', queryError);
      inspections = [];
    }

    return NextResponse.json(serializeBigInt(inspections));
  } catch (error) {
    console.error('Error fetching inspections (outer):', error);
    // As a safety net, never break the dashboard – just return empty list
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'coordinator') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const coordinator = await prisma.coordinators.findFirst({
      where: { email: session.user.email },
    });

    if (!coordinator) {
      return NextResponse.json({ error: 'Coordinator not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      month,
      bus,
      pdf,
      video,
      code,
      video_gp,
      plate_number,
      bus_uploaded,
      issue,
      both_vid_pdf,
      inspection_completed_by,
      issues,
    } = body;

    if (!bus || !month) {
      return NextResponse.json(
        { error: 'Bus and month are required' },
        { status: 400 }
      );
    }

    // Ensure month is stored as first day of the month
    const monthDate = new Date(month);
    const firstDayOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);

    const busIdNumber = Number(bus);
    if (!Number.isFinite(busIdNumber)) {
      return NextResponse.json(
        { error: 'Invalid bus id provided' },
        { status: 400 }
      );
    }

    const inspection = await prisma.inspection.create({
      data: {
        month: firstDayOfMonth,
        coordinator: coordinator.name || null,
        bus: BigInt(busIdNumber),
        pdf: pdf || null,
        video: video || null,
        code: code || null,
        d_uploaded: new Date(),
        video_gp: video_gp || null,
        plate_number: plate_number || null,
        bus_uploaded: bus_uploaded || null,
        issue: issue || null,
        both_vid_pdf: both_vid_pdf || null,
        inspection_completed_by: inspection_completed_by || null,
        issues: issues || null,
      },
      include: {
        bus_rel: {
          select: {
            id: true,
            bus_code: true,
            plate_no: true,
          },
        },
      },
    });

    return NextResponse.json(serializeBigInt(inspection), { status: 201 });
  } catch (error) {
    console.error('Error creating inspection:', error);
    return NextResponse.json(
      {
        error: 'Failed to create inspection',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

