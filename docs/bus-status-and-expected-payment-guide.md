# Bus Status History & Expected Payment Tracking Guide

The goals:
1. **Track every status change** (Active → Letter Issued → Repossessed, etc.) for auditing.
2. **Store expected payment per week** so that the payment module can reference the correct target, even when it changes mid-cycle.

Below is an implementation blueprint you can adapt to Prisma + Next.js.

---

## 1. Bus Status History

### Suggested Prisma Model
```prisma
model bus_status_history {
  id          BigInt   @id @default(autoincrement())
  bus         BigInt
  status      String
  note        String?
  changed_by  BigInt?      // optional admin id
  changed_at  DateTime @default(now()) @db.Timestamptz

  bus_rel     buses   @relation(fields: [bus], references: [id])
  @@map("bus_status_history")
}
```

### API Flow
1. **POST `/api/buses/:id/status`**
   - Body: `{ status: "Letter Issued", note?: "...", changed_by?: adminId }`
   - Actions:
     - Insert into `bus_status_history`.
     - Optionally update `buses.letter` or other boolean flags when the new status implies it.

2. **GET `/api/buses/:id/status`**
   - Returns the history ordered by `changed_at desc`.

3. **Link to UI**
   - On `Admin > Buses`, show a “Status History” drawer listing entries with timestamps + author.
   - Provide a form (zod + react-hook-form + shadcn) to append a new status.

### Tips
- Define a union type or enum for valid statuses (`Active`, `Letter Issued`, `Legal`, `Repossessed`, `Completed` …).
- When editing a bus, auto-create a history entry if the status derived from the edit changes.

---

## 2. Weekly Expected Payment Table

Drivers’ targets change after letters or arrears, so store them separately from `buses`.

### Suggested Prisma Model
```prisma
model expected_payment {
  id           BigInt   @id @default(autoincrement())
  bus          BigInt
  week_start   DateTime @db.Date   // Monday of the week
  amount       BigInt
  reason       String?
  created_by   BigInt?
  created_at   DateTime @default(now()) @db.Timestamptz

  bus_rel      buses @relation(fields: [bus], references: [id])
  @@unique([bus, week_start])
  @@map("expected_payment")
}
```

### How to Use It
1. **When updating a bus** and changing the “expected payment” value inside the edit dialog:
   - Also insert (or update) the `expected_payment` record for the relevant week.
   - Keep only the numeric summary (optional) on `buses.e_payment` for quick display, but treat the per-week table as the source of truth.

2. **Payment module (`/api/payments`)**:
   - When rendering a payment card or validating receipt input, fetch the expected amount via:
     ```sql
     SELECT amount
     FROM expected_payment
     WHERE bus = $1 AND week_start = $2
     ```
   - If not found for that week, fall back to the previous week or the bus default.

3. **Admin UI**:
   - Add a tab “Expected Payment History” on the bus edit dialog.
   - Show rows: Week (2025-02-10), Amount, Reason, Edited by, Timestamp.
   - Provide a button “Adjust next week target” that writes a new row using the API.

### API Outline
- `POST /api/buses/:id/expected-payment`
  ```json
  {
    "week_start": "2025-02-10",
    "amount": 65000,
    "reason": "Letter served, double payment requested",
    "created_by": 12
  }
  ```
- `GET /api/buses/:id/expected-payment?limit=10`

### Helpful Utilities
- `getWeekStart(date = new Date())` → returns Monday as ISO string.
- Shared Zod schema: `z.object({ week_start: z.string(), amount: z.string().regex(/^\d+$/) })`.

---

## Implementation Checklist

1. **Prisma**
   - Add the two models + run `prisma migrate`.
   - Generate the client (`npx prisma generate`).

2. **API Routes**
   - `/api/buses/[id]/status` (GET/POST)
   - `/api/buses/[id]/expected-payment` (GET/POST)

3. **Admin UI**
   - Extend the bus edit dialog with:
     - Status history table (list + add form).
     - Expected payment history table with weekly entries.
   - Re-use `Dialog`, `Form`, `Table` components for consistency.

4. **Payments Module**
   - Update the logic that renders weekly cards to fetch the current expected payment via the new table.
   - When calculating “Paid vs Expected”, pick the record for that week.

5. **Automation (optional but recommended)**
   - Cron job that automatically copies each bus’s `default` expected payment into a new `expected_payment` row on Monday, so only exceptions (letters, arrears) need manual edits.

This structure keeps the weekly targets auditable and gives admins a full trail of bus status changes. Use it as a template and adjust names/fields to your workflow.***

