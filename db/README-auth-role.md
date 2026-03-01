# Where is the "role" column?

Supabase **Authentication → Users** does **not** show a role column. You cannot add custom columns there.

## Where to see and edit role

| Place | What you see |
|--------|----------------|
| **Table Editor → public → `users`** | Full table with **role** column (client / admin). This is the main place to view and change role. |
| **Authentication → Users → click one user** | Under **App metadata**, you may see `{ "role": "client" }` or `{ "role": "admin" }` if you ran the sync script or the app set it. |

## Summary

- **Role lives in** the app table **`public.users`** (Table Editor → public → users).
- **Authentication → Users** only shows built-in auth fields; role is not a column there.
- To change someone to admin: run `db/set-admin.sql` in SQL Editor (it updates `public.users`), then optionally run `node scripts/sync-roles-to-auth.js` so that role also appears in Auth app metadata.
