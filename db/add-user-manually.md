# How to add a user manually in Supabase

You need the user in **two** places: **Authentication** (so they can log in) and **public.users** (so the app knows their role and profile).

---

## Option A: Supabase Dashboard (good for one-off users)

### Step 1: Create the auth user

1. In Supabase go to **Authentication** → **Users**.
2. Click **Add user** → **Create new user**.
3. Enter **Email** and **Password** (and optionally name).
4. Click **Create user**.
5. Copy the user’s **UUID** from the list (click the user if needed).

### Step 2: Add them to `public.users`

1. Go to **Table Editor** → **public** → **users**.
2. Click **Insert row**.
3. Fill in:
   - **id**: paste the **same UUID** from Step 1 (required).
   - **email**: same email as in Auth.
   - **full_name**: optional.
   - **phone**: optional.
   - **role**: `client` or `admin`.
4. Save.

The user can now log in and the app will see their role.

---

## Option B: SQL (after you created the auth user in the dashboard)

If you already created the user under **Authentication → Users**, you only need the row in **public.users**. In **SQL Editor** run (replace the values):

```sql
-- Replace with the real UUID from Authentication → Users, and the same email
INSERT INTO public.users (id, email, full_name, role)
VALUES (
  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',  -- UUID from Auth user
  'newuser@example.com',
  'Full Name',
  'client'
);
```

To get the UUID: **Authentication** → **Users** → click the user → copy **User UID**.

---

## Option C: Script (create auth user + public.users in one go)

From the project root (with `.env.local` set):

```bash
node scripts/add-user-manually.js
```

The script will ask for email, password, full name and role, then create the user in Auth and insert into **public.users** (see `scripts/add-user-manually.js`).
