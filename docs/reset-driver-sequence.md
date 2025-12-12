# Resetting the `driver_id_seq` Auto-Increment

When a database dump is imported, Postgres sequences often keep their old values.  
In our case `driver_id_seq` still thinks the next `driver.id` is `4`, while the table already contains much higher IDs.  
Every insert then collides with an existing `id`, producing `PrismaClientKnownRequestError: Unique constraint failed on the fields: (id)`.

There are two ways to fix it:

---

## Option 1 – Run a SQL statement directly

1. Connect to the database (psql, Prisma Studio SQL tab, Supabase SQL editor, etc.).
2. Execute the following statement (adjust the schema name if needed).

```sql
SELECT setval(
  'public.driver_id_seq',
  (SELECT COALESCE(MAX(id), 0) + 1 FROM public.driver),
  false
);
```

Explanation:
- `MAX(id) + 1` finds the next unused ID in `driver`.
- `setval(..., false)` tells Postgres “the sequence currently holds this value; next call to `nextval` will return it unchanged”.

3. Retry driver registration; the ID conflict should be gone.

---

## Option 2 – Add a one-off migration script

If you prefer to keep the fix versioned with the codebase:

1. Create `scripts/fix-driver-sequence.ts`:

```ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`
    SELECT setval(
      'public.driver_id_seq',
      (SELECT COALESCE(MAX(id), 0) + 1 FROM public.driver),
      false
    )
  `);

  console.log('driver_id_seq has been reset');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

2. Run it once:

```bash
npx tsx scripts/fix-driver-sequence.ts
# or: node --loader ts-node/esm scripts/fix-driver-sequence.ts
```

1a. Create `scripts/fix-buses-sequence.ts`:

```ts
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
```

2. Run it once:

```bash
npx tsx scripts/fix-buses-sequence.ts
# or: node --loader ts-node/esm scripts/fix-buses-sequence.ts
```

3. Commit/remove the script as you prefer (it is safe to keep for future imports).

Either approach resets the sequence, allowing new drivers to be inserted without hitting the `id` unique constraint.

