import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`
    SELECT setval(
      'public.buses_id_seq',
      (SELECT COALESCE(MAX(id), 0) + 1 FROM public.buses),
      false
    )
  `);

  console.log('buses_id_seq has been reset');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });