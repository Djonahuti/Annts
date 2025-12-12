# PHP API Mapping and Conversion Notes

This document lists the new PHP API endpoints and which Next.js API routes they replace. The PHP backend lives in `backend-php/api` and is designed to be deployed to standard PHP hosting via FTP.

Core routes:
- `GET /api/contacts` -> `backend-php/api/contacts.php` (filters via query string). Also supports `POST` & `PUT`.
- `GET /api/contact` -> `backend-php/api/contact.php` (contact_us messages). Supports `POST`.
- `GET /api/buses` -> `backend-php/api/buses.php` (list & filters). Supports `POST` and `PATCH` (update when `id` param is present).
- `GET /api/buses/{id}/status` -> `backend-php/api/buses/status.php` (GET/POST status history)
- `GET /api/buses/{id}/expected-payment` -> `backend-php/api/buses/expected-payment.php` (GET/POST expected payments)
- `GET /api/payments` & `GET /api/payments?busId=123` -> `backend-php/api/payments.php` (supports `POST`, `PATCH`, and `DELETE` via `id`)
- `GET /api/drivers` -> `backend-php/api/drivers.php` (list & by email). Supports `POST` (register) & `PUT` (banned)
- `GET /api/inspections` -> `backend-php/api/inspections.php` (filters) supports `POST` (coordinator only)
- `GET /api/pages` -> `backend-php/api/pages.php` supports `GET` by `id`, `POST` to create, `PATCH` and `DELETE` by id. Also static slugs at `api/pages/home`, `api/pages/contact`, `api/pages/about`, `api/pages/services`.
- `GET /api/settings` & `PUT/PATCH /api/settings` -> `backend-php/api/settings.php`
- `GET /api/subjects` -> `backend-php/api/subjects.php` (list & create)
- `POST /api/upload` -> `backend-php/api/upload.php` and alias `upload-inspection.php`, `upload-receipt.php`, `upload/image.php` for convenience
- `GET /api/files` -> `backend-php/api/files.php` (admin-only file listing)
- `POST /api/auth/login` -> `backend-php/api/auth/login.php` (returns JWT token)
- `GET /api/admin/stats` -> `backend-php/api/admin/stats.php`
- `GET /api/coordinator/buses` -> `backend-php/api/coordinator/buses.php` (list coordinator's buses by email)
 
Notes:
- Authentication uses a basic HMAC JWT for now. Add `JWT_SECRET` environment variable to the server and set to a secure value.
- Admin/Coordinator/Driver login is supported via `auth/login`. The token contains `role` and `id` and expires in 7 days.
- All endpoints use prepared statements and PDO; update sanitized fields as needed.
- File uploads are placed in `public/uploads` and served statically from `/uploads`.
- For admin-specific checks (e.g., `files.php` and bus status creation), the API checks the `role` in the token and verifies admin role with the `admins` table where applicable.

Next steps:
- Finish converting the remaining smaller routes to PHP using the patterns above.
- Update the Next.js frontend code to call the PHP API endpoints instead of the Prisma routes.
- Harden authentication visibility, improve tokens or switch to server-side sessions.
- Add tests or a Postman collection for every API endpoint.
