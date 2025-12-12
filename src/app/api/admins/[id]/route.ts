import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function serializeBigInt<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_key, value) => (typeof value === 'bigint' ? Number(value) : value))
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const adminId = BigInt(id);
  const body = await request.json();

  const { role } = body;

  try {
    // Update admin role
    const admin = await prisma.admins.update({
      where: { id: adminId },
      data: {
        role: role || undefined,
      },
    });

    return NextResponse.json({ 
      message: 'Admin role updated successfully',
      admin: serializeBigInt({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      })
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to update admin role' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

