#!/bin/bash

# Simple script to test prisma.inspection.findMany() directly,
# using similar filters/include as the API route.

node - <<'EOF'
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const testBusId = 17n; // adjust if needed
    const monthDate = new Date('2025-11-30');
    const startOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const endOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

    const inspections = await prisma.inspection.findMany({
      where: {
        bus: testBusId,
        month: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
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
      orderBy: {
        created_at: 'desc',
      },
    });

    console.log('OK, count =', inspections.length);
    console.dir(inspections, { depth: null });
  } catch (e) {
    console.error('Direct findMany error:');
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
})();
EOF


