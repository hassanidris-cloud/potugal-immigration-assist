# Improvements & Roadmap

## Implemented (this pass)

### API security: admin routes
- **`lib/apiAuth.ts`** – `requireAdminApi(req, res)` verifies the **caller** is authenticated and has `users.role === 'admin'` (via `Authorization: Bearer` or session cookies). Returns `{ user }` or sends 401/403.
- **Admin routes** now:
  - Use **`getServiceSupabase()`** only (no inline `createClient(..., serviceRoleKey)`).
  - Call **`requireAdminApi(req, res)`** first; no admin logic runs without a verified admin caller.
- **Updated routes:** `admin/mark-paid.ts`, `admin/generate-test-data.ts`, `admin/sync-user-role.ts`, `documents/[id].ts` (PATCH), `documents/upload.ts` (auth: caller must be the uploader or admin).

### OCR: criminal record pre-validation
- **`lib/documentValidation.ts`** – Extended keyword sets for criminal-record–type documents: e.g. `apostille`, `certificate of good conduct`, `certificate of no criminal record`, `fbi`, `background check`, `police clearance`, so uploads are checked for these terms.

### Realtime case chat
- **CaseChat** already uses Supabase Realtime: `postgres_changes` on `case_messages` (INSERT) so new messages appear without refresh. No change made.

---

## Suggested next steps (from review)

### UI/UX: Tailwind instead of inline styles
- **Issue:** Heavy inline styles in e.g. `onboarding.tsx`, `dashboard.tsx` hurt maintainability and dark mode.
- **Direction:** Move to Tailwind (already in the stack). Start with one flow (e.g. dashboard or onboarding) and reuse patterns.

### New features
1. **Appointment scheduler** – Use existing `appointments` table; UI for clients to book consultations; optional Calendly/Google Calendar integration for specialist availability.
2. **WhatsApp / Telegram notifications** – Webhook on `case_messages` or document approval; notify users when admin approves a document or sends a message.
3. **Dynamic checklist by country** – Extend `checklist_templates` (e.g. `country_code` or similar) so requirements vary by country of origin (e.g. US vs UK vs India).

### Architecture
1. **App Router** – Consider migrating from `pages/` to `app/` for Server Components and smaller client JS.
2. **Calendar in dashboard** – Let users book a “Specialist Review” call from the dashboard, backed by admin availability (e.g. Google Calendar).

---

## Admin API usage

Frontend calls to admin endpoints must send the user’s session:

- **Cookie:** Same-origin requests send cookies automatically (`credentials: 'include'`).
- **Header:** For server-side or cross-origin calls, send `Authorization: Bearer <access_token>` (from `supabase.auth.getSession()`).

Example:

```ts
const { data: { session } } = await supabase.auth.getSession()
await fetch('/api/admin/mark-paid', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
  body: JSON.stringify({ userId: targetUserId }),
  credentials: 'include',
})
```
