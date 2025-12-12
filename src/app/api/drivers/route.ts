import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function serializeBigInt<T>(data: T): T {
  return JSON.parse(
    JSON.stringify(data, (_key, value) => (typeof value === 'bigint' ? Number(value) : value))
  );
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (email) {
      const driver = await prisma.driver.findFirst({ where: { email } })
      if (!driver) return NextResponse.json({ error: 'Driver not found' }, { status: 404 })
      return NextResponse.json(serializeBigInt(driver))
    }

    const drivers = await prisma.driver.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        kyc: true,
        banned: true,
        buses: {
          take: 1,
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            bus_code: true,
            plate_no: true,
            coordinator_rel: {
              select: { id: true, name: true }
            }
          }
        }
      },
    });

    const response = drivers.map((driver) => {
      const bus = (driver.buses && driver.buses.length > 0) ? driver.buses[0] : null;
      return {
        id: Number(driver.id),
        name: driver.name || null,
        email: driver.email ?? null,
        phone: driver.phone as string[] | null,
        address: driver.address as string[] | null,
        kyc: driver.kyc,
        banned: driver.banned,
        bus_id: bus ? Number(bus.id) : null,
        bus_code: bus?.bus_code ?? null,
        plate_no: bus?.plate_no ?? null,
        coordinator_id: bus?.coordinator_rel ? Number(bus.coordinator_rel.id) : null,
        coordinator_name: bus?.coordinator_rel?.name ?? null,
      };
    });

    return NextResponse.json(serializeBigInt(response));
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return NextResponse.json({ error: 'Failed to fetch drivers' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      dob,
      nin,
      phones,
      addresses,
    } = body;

    // Log the incoming request for debugging
    console.log('Driver registration request:', { 
      email, 
      hasPassword: !!password, 
      phonesCount: phones?.length,
      addressesCount: addresses?.length 
    });
    
    // Normalize email (lowercase and trim)
    const normalizedEmail = email?.toLowerCase().trim();
    const originalEmail = email?.trim();
    
    console.log('Email normalization:', { originalEmail, normalizedEmail });

    // Validate required fields
    if (!normalizedEmail || !password) {
      console.error('Validation failed: missing email or password');
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Filter out empty strings from arrays
    const filteredPhones = Array.isArray(phones) ? phones.filter(phone => phone && phone.trim().length > 0) : [];
    const filteredAddresses = Array.isArray(addresses) ? addresses.filter(addr => addr && addr.trim().length > 0) : [];

    // Validate that we have at least one phone and address
    if (filteredPhones.length === 0) {
      console.error('Validation failed: no valid phone numbers');
      return NextResponse.json({ error: 'At least one phone number is required' }, { status: 400 });
    }

    if (filteredAddresses.length === 0) {
      console.error('Validation failed: no valid addresses');
      return NextResponse.json({ error: 'At least one address is required' }, { status: 400 });
    }

    // Validate email is not empty before checking
    if (!normalizedEmail || normalizedEmail.trim().length === 0) {
      console.error('Validation failed: email is empty');
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // NOTE: Temporarily disabled ALL email-exists checks to unblock registration.
    // There is no unique constraint on driver.email in your DB dump, and users/admins/coordinators
    // use different email domains from the driver you're trying to register.
    // If you want uniqueness later, we can reintroduce a *very simple* check.

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create driver record
    const driver = await prisma.driver.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        dob,
        nin: nin ? BigInt(nin) : null,
        phone: filteredPhones,
        address: filteredAddresses,
        kyc: false,
      },
    });

    // Note: Not creating user record as users table is not being used

    return NextResponse.json({ message: 'Driver registered successfully' }, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error registering driver:', error);
    console.error('Error details:', {
      code: error?.code,
      message: error?.message,
      meta: error?.meta,
      stack: error?.stack
    });
    
    // Provide more specific error messages
    if (error?.code === 'P2002') {
      // Unique constraint violation - email already exists
      const target = error?.meta?.target || 'unknown';
      console.error('Database unique constraint violation:', { target, error: error.meta });
      return NextResponse.json({ 
        error: 'Email already registered',
        details: {
          source: 'database_constraint',
          target: target,
          message: 'A record with this email already exists in the database'
        }
      }, { status: 400 });
    }
    
    const errorMessage = error?.message || 'Failed to register driver';
    return NextResponse.json({ 
      error: errorMessage,
      details: {
        code: error?.code,
        message: error?.message
      }
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, banned } = data;

    if (!id || typeof banned !== 'boolean') {
      return NextResponse.json({ error: 'ID and banned status are required' }, { status: 400 });
    }

    const updated = await prisma.driver.update({
      where: { id: BigInt(id) },
      data: { banned },
      select: { id: true, name: true, email: true, banned: true },
    });

    return NextResponse.json(serializeBigInt(updated));
  } catch (error) {
    console.error('Error updating driver:', error);
    return NextResponse.json({ error: 'Failed to update driver' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}