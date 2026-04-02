# Debugging Reference — Important Code & Touchpoints

Use this when debugging auth, checklist, documents, or API issues.

---

## 1. Environment variables (must be set)

```env
# Required for app + API
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # Server/API only; never expose to client

# Optional
RESEND_API_KEY=...                # Contact form emails
STRIPE_SECRET_KEY=...             # Payments
STRIPE_WEBHOOK_SECRET=...         # Webhooks
```

- **Health check:** `GET /api/health` returns `contactFormConfigured` and confirms API is up.

---

## 2. Supabase clients (who uses which)

| Context | File | Usage |
|--------|------|--------|
| Browser (pages/components) | `lib/supabaseClient.ts` | `import { supabase } from '...'` — uses anon key + cookies |
| Browser client creation | `lib/supabase/browser.ts` | `createClient()` used by supabaseClient |
| API routes (server) | `lib/supabaseClient.ts` | `getServiceSupabase()` — service role, bypasses RLS |
| Middleware (session refresh) | `middleware.ts` | `createServerClient` with cookies |

**lib/supabaseClient.ts**
```ts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
export const supabase = createBrowserClient()  // from ./supabase/browser
export function getServiceSupabase(): SupabaseClient {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createSupabaseClient(supabaseUrl, serviceRoleKey)
}
```

---

## 3. Auth & access control

**Middleware** (`middleware.ts`) — runs on every request; only refreshes session and syncs cookies. It does **not** redirect unauthenticated users.

**Admin API** (`lib/apiAuth.ts`) — use for any route that must be admin-only:
```ts
import { requireAdminApi } from '../../lib/apiAuth'
export default async function handler(req, res) {
  const ctx = await requireAdminApi(req, res)
  if (!ctx) return  // 401/403 already sent
  const supabase = getServiceSupabase()
  // ...
}
```

**“Accepted” user (paid / admin)** — `hooks/useAcceptedUser.ts`:
- `isAccepted === true` only when `profile.paid_at != null` or `profile.role === 'admin'`.
- Dashboard / onboarding often redirect to `/account-pending` when `!paid_at` for clients.

---

## 4. Signup → profile creation

**Flow:** Sign up (Supabase Auth) → callback/page calls **`/api/auth/complete-signup`** with `userId`, `email`, `fullName`, `phone`, `visaType`.

**pages/api/auth/complete-signup.ts** (important logic):
- Verifies user in `auth.users` via `supabaseAdmin.auth.admin.getUserById(userId)`.
- If profile exists in `public.users`, returns 200 "User already exists".
- Otherwise inserts into `public.users` (id, email, full_name, phone, role: 'client', visa_type).
- If insert fails with schema/cache error mentioning `visa_type`, retries **without** `visa_type` (handles missing column).
- Sets `app_metadata.role = 'client'` on the auth user.

**Typical failures:** Missing `users.id` FK to `auth.users`, or missing `users.visa_type` column (retry logic should mitigate the latter).

---

## 5. Case creation & checklist generation

**Where cases are created:**
- **Onboarding (first case):** `pages/onboarding.tsx` — inserts into `cases` then calls `generateChecklistForCase(supabase, caseData.id, visaType)`.
- **API (optional):** `pages/api/cases.ts` — POST inserts into `cases` only; **does not** create checklist.

**Checklist generation** (`lib/checklistGeneration.ts`):
- **Visa type alias:** D8 in UI is stored in DB as `D7 Digital Nomad` for templates. Alias map:
  ```ts
  const checklistVisaTypeAliases: Record<string, string[]> = {
    'D8 Visa': ['D7 Digital Nomad'],
    'D7 Digital Nomad': ['D8 Visa'],
  }
  ```
- `fetchChecklistTemplatesForVisa(supabase, visaType)` tries `visaType` then any aliases; returns first non-empty set from `checklist_templates`.
- `generateChecklistForCase(supabase, caseId, visaType, replaceExisting)` deletes existing `case_checklist` rows when `replaceExisting === true`, then inserts new rows from templates.

**Used by:**
- `pages/onboarding.tsx` — after case insert (no replace).
- `pages/case/[id]/edit.tsx` — when admin changes visa type (replace existing).
- `pages/case/[id]/checklist.tsx` — “Generate checklist” button and **auto-generate on load** when case has `visa_type` but zero checklist items.

**RLS:** Users can insert/delete `case_checklist` only for cases where `cases.user_id = auth.uid()`. See `db/rls.sql` and `db/rls-case-checklist-insert-delete.sql`.

---

## 6. Document upload with validation

**Endpoint:** `POST /api/documents/upload-with-validation`  
**Body:** multipart form with `file`, `case_id`, `case_checklist_id` (optional), `title`, `description`.

**pages/api/documents/upload-with-validation.ts** flow:
1. Parse session via `createServerClient` (cookies); require authenticated user.
2. Parse form (formidable), get `case_id`, `title`, optional `case_checklist_id`.
3. If `case_checklist_id` set, load checklist item title from `case_checklist` for validation.
4. Extract text: PDF → `pdf-parse`; images/other → Tesseract OCR.
5. **Validate:** `validateDocumentText(ocrText, checklistItemTitle)` (see below).
6. Upload file to Supabase Storage `documents` bucket, path `{caseId}/{timestamp}-{random}.{ext}`.
7. Insert row into `documents` (case_id, case_checklist_id, title, file_path, uploaded_by, status: 'pending', etc.).

**lib/documentValidation.ts** — keyword-based validation:
- `validateDocumentText(ocrText, checklistItemTitle)` returns `{ valid, reason?, matchedKeyword? }`.
- `DOCUMENT_KEYWORDS` maps normalized checklist titles to arrays of keywords; at least one keyword must appear in OCR text (case-insensitive).
- If no keyword set for that title, validation passes (e.g. “other”).
- New document types: add an entry to `DOCUMENT_KEYWORDS` or ensure the checklist title (or a substring) matches an existing key.

**Common failures:** File too large (25 MB), validation failure (wrong document type or unreadable file), Storage or DB insert error.

---

## 7. Database schema (main tables)

| Table | Purpose |
|-------|---------|
| `users` | id (FK auth.users), email, full_name, role, phone, visa_type, paid_at |
| `cases` | id, user_id, case_type, status, visa_type, country_of_origin, target_visa_date |
| `case_checklist` | id, case_id, template_id, phase, title, description, required, completed, order_index |
| `checklist_templates` | id, visa_type, phase, title, description, required, order_index |
| `documents` | id, case_id, case_checklist_id, title, file_path, status, uploaded_by |

Full schema: `db/schema.sql`. RLS: `db/rls.sql`, `db/rls-case-checklist-insert-delete.sql`.

---

## 8. Important file map

| Area | Files |
|------|--------|
| Supabase | `lib/supabaseClient.ts`, `lib/supabase/browser.ts` |
| Auth (API) | `lib/apiAuth.ts`, `middleware.ts` |
| Signup | `pages/api/auth/complete-signup.ts` |
| Cases | `pages/api/cases.ts` |
| Checklist | `lib/checklistGeneration.ts`, `pages/onboarding.tsx`, `pages/case/[id]/edit.tsx`, `pages/case/[id]/checklist.tsx` |
| Documents | `pages/api/documents/upload-with-validation.ts`, `lib/documentValidation.ts` |
| Access | `hooks/useAcceptedUser.ts` |
| Health | `pages/api/health.ts` |

---

## 9. Quick checks when something breaks

- **“Checklist not generated”**  
  - Case has `visa_type`?  
  - Templates exist for that visa (or alias, e.g. D8 → D7 Digital Nomad)?  
  - RLS: can this user insert into `case_checklist` for this `case_id`?  
  - Check `lib/checklistGeneration.ts` and that onboarding/checklist page call `generateChecklistForCase` with correct `visaType`.

- **“Upload failed” / “Document validation failed”**  
  - Check `lib/documentValidation.ts` — is the checklist item title (or a substring) in `DOCUMENT_KEYWORDS`?  
  - OCR empty? (unreadable or non-document file.)  
  - Size & type: 25 MB limit, form fields `case_id`, `title` required.

- **“Unauthorized” / “Admin only”**  
  - Session present? (cookies / Bearer token.)  
  - `users.role === 'admin'` for admin routes using `requireAdminApi`.

- **“User not found” / signup completion fails**  
  - Auth user exists (`auth.users`) before inserting into `public.users`.  
  - If error mentions `visa_type` or schema cache, complete-signup retries without `visa_type`; ensure `users` table has expected columns (see `db/users-add-visa-type.sql` if needed).

- **Vercel / server**  
  - Ensure `SUPABASE_SERVICE_ROLE_KEY` and both `NEXT_PUBLIC_*` vars are set in Vercel env.  
  - Use `GET /api/health` to confirm API and env.

Use this doc to locate the code that handles the failing path and add logs or breakpoints as needed.

---

## 10. Improvements / tech debt

- **Done:** Shared `SiteNav` component; site copy used on home, contact, FAQ, services, how-we-work, why-portugal, and visa D2/D7/D8 (meta + hero). Logo `alt` uses `nav.brand`. ESLint (`.eslintrc.json`), security headers (next.config.js), default meta from `home` in `_app.tsx`, `.env.local.example` with Supabase/Stripe/Resend/CONTACT_TO_EMAIL, middleware guard when Supabase env is missing.
- **Optional:** Wire remaining visa page sections (overview, benefits, FAQs, CTA, etc.) to `content/site-copy.json` keys. Wrap client-side `console.error` in `pages/` and `components/` with `process.env.NODE_ENV === 'development'` to reduce production console output.
