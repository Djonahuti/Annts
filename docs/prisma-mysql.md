# Prisma + MySQL migration notes

If you prefer to keep Prisma but switch to MySQL as your database, follow these high-level steps:

1. Update `prisma/schema.prisma` datasource provider to `mysql` (or create a copy `schema.mysql.prisma`). Example:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

2. Replace PostgreSQL-specific column attributes like `@db.Timestamptz` with `@db.DateTime(6)` or remove them in a compatible manner.
3. Adjust any `@db.Uuid`/other Postgres-specific types to MySQL equivalents (use `String` and `@db.Char(36)` for UUIDs if needed).
4. Test local introspection: If you have an existing MySQL database, run `prisma db pull` to introspect the schema.
5. Migrate: When developing locally, use `prisma migrate dev` to generate migrations adapted for MySQL.

Warning: Some Postgres-specific behaviors (arrays, `String[]` usage, `@db.Date` etc.) need careful mapping in MySQL. Consider normalizing or using separate tables instead of arrays where necessary.
