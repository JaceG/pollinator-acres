# Signup List Setup Guide

This guide walks you through setting up **Supabase** and **Brevo** for the Pollinator Acres website signup form. No prior experience with either service is assumed.

## What you're setting up (and why)

When someone signs up on the website, two things happen:

| Service | Who uses it | What it does |
|---------|-------------|--------------|
| **Supabase** | You (developer) | Stores subscribers in a database. This is what the future mobile app will use. |
| **Brevo** | Farm operators (non-technical) | Shows contacts in a friendly dashboard. Used to send email and text blasts. |

You only need to do the technical setup **once**. After that, day-to-day list management happens in **Brevo**.

---

## Before you start

- A GitHub copy of this project on your computer (or access to edit files on Render)
- About 30–45 minutes for first-time setup
- A spreadsheet or list of existing contacts (optional, for import later)

---

## Part 1: Supabase (the database)

### 1.1 Create an account and project

1. Go to [https://supabase.com](https://supabase.com) and click **Start your project**.
2. Sign up with GitHub, Google, or email.
3. Click **New project**.
4. Fill in:
   - **Name:** `pollinator-acres` (or anything you like)
   - **Database password:** generate a strong password and **save it somewhere safe** (you rarely need it, but don't lose it)
   - **Region:** pick one close to you (e.g. `East US (Ohio)`)
5. Click **Create new project** and wait 1–2 minutes for it to finish.

### 1.2 Create the subscribers table

1. In the left sidebar, click **SQL Editor**.
2. Click **New query**.
3. Open this file in your project: `supabase/migrations/001_subscribers.sql`
4. Copy the **entire contents** of that file and paste them into the SQL Editor.
5. Click **Run** (or press Cmd+Enter / Ctrl+Enter).
6. You should see **Success. No rows returned** — that means the table was created.

To confirm: click **Table Editor** in the sidebar. You should see a table named `subscribers` (it will be empty for now).

### 1.3 Copy your Supabase credentials

1. Click **Project Settings** (gear icon at the bottom of the sidebar).
2. Click **API** in the settings menu.
3. Copy and save these two values:

| Setting | Where to find it | Goes in `.env` as |
|---------|------------------|-------------------|
| **Project URL** | Under "Project URL" | `SUPABASE_URL` |
| **service_role** key | Under "Project API keys" → `service_role` → Reveal → Copy | `SUPABASE_SERVICE_ROLE_KEY` |

4. Run the database migration (creates the `subscribers` table):

   ```bash
   npm run setup-supabase
   ```

   This needs a one-time credential in `.env` — either:
   - `SUPABASE_ACCESS_TOKEN` from [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens), or
   - `SUPABASE_DB_URL` from **Settings** → **Database** → **Connection string** (URI)

   Your project URL for this setup is: `https://ttbxfxzneiiezntggvis.supabase.co`

   Alternatively, paste the contents of `supabase/migrations/001_subscribers.sql` into the [SQL Editor](https://supabase.com/dashboard/project/ttbxfxzneiiezntggvis/sql/new) and run it manually.

> **Important:** The `service_role` key is secret — like a password. Never put it in the website code, never commit it to GitHub, and never share it publicly. It stays in `.env` and Render environment variables only.

---

## Part 2: Brevo (the contact dashboard)

### 2.1 Create an account

1. Go to [https://www.brevo.com](https://www.brevo.com) and sign up (free tier is fine to start).
2. Complete the onboarding questions (business name, etc.).

### 2.2 Create a contact list

1. In the left menu, go to **Contacts** → **Lists**.
2. Click **Create a list**.
3. Name it something like `Pollinator Acres Subscribers`.
4. Click **Create**.
5. Note the **List ID** — it's the number in the URL when you open the list, or shown in list details. Example: if the URL is `.../lists/2`, your list ID is `2`.

This number goes in `.env` as `BREVO_LIST_ID`.

### 2.3 Create a custom contact field

The website saves each person's notification preference (`email`, `text`, or `both`). Brevo needs a place to store that.

1. Go to **Contacts** → **Settings** (or **Contacts** → gear icon) → **Contact attributes**.
2. Click **Create a new attribute**.
3. Set:
   - **Name:** `PREFERENCES`
   - **Type:** Text (or "Normal" text)
   - **Category:** Contact information (default is fine)
4. Save.

> Brevo already has built-in fields like `FIRSTNAME` and `SMS`. You only need to add `PREFERENCES`.

### 2.4 Create an API key

1. Click your profile name (top right) → **SMTP & API** → **API Keys**  
   (Or go to **Settings** → **SMTP & API** → **API Keys**.)
2. Click **Generate a new API key**.
3. Name it `pollinator-acres-website`.
4. Copy the key immediately — **you won't be able to see it again**.
5. This goes in `.env` as `BREVO_API_KEY`.

---

## Part 3: Connect everything to the website

### 3.1 Add environment variables locally

1. In the project folder, copy the example env file if you haven't already:

   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your four new values (keep any existing Instagram variables):

   ```env
   SUPABASE_URL=https://xxxxxxxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...your-long-key...
   BREVO_API_KEY=xkeysib-...your-key...
   BREVO_LIST_ID=2
   SIGNUP_NOTIFY_EMAIL=camille@pollinatoracres.com
   ```

   Replace with your actual values. `BREVO_LIST_ID` is just the number — no quotes needed.
   `SIGNUP_NOTIFY_EMAIL` is who gets an email each time someone new signs up. Brevo only sends
   from addresses it has verified (**Senders & IP** → **Senders**), so that address must be a
   verified sender, or set `SIGNUP_NOTIFY_FROM` to one that is.

3. Save the file. **Never commit `.env` to Git** — it's already in `.gitignore`.

### 3.2 Test locally

1. Install dependencies (if needed):

   ```bash
   npm install
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173), scroll to **Stay in the Loop**, and submit a test signup with your own email or phone.

4. Verify it worked:
   - **Supabase:** Table Editor → `subscribers` → you should see your test row.
   - **Brevo:** Contacts → you should see your test contact on your list.

If signup fails, see [Troubleshooting](#troubleshooting) below.

---

## Part 4: Import existing contacts

If you already have people on a spreadsheet or in your phone contacts, import them once:

### 4.1 Prepare a CSV file

Create a file named `contacts.csv` with this header row:

```csv
first_name,email,phone,preferences
```

Example rows:

```csv
first_name,email,phone,preferences
Jane,jane@example.com,,email
Bob,,+16145551234,text
Sam,sam@example.com,+16145555678,both
```

Rules:
- `preferences` must be exactly `email`, `text`, or `both`
- Include email and/or phone depending on preference
- Phone numbers can be `(614) 555-1234` or `+16145551234` — both work

### 4.2 Run the import

```bash
npm run import-subscribers -- contacts.csv
```

You should see output like:

```
Imported 3 subscribers (0 skipped).
Synced 3 contacts to Brevo.
```

Check Supabase and Brevo to confirm the contacts appear.

---

## Part 5: Deploy to production (Render)

Your live site runs on Render. It needs the same four environment variables.

1. Log in to [https://dashboard.render.com](https://dashboard.render.com).
2. Open the **pollinator-acres** web service.
3. Go to **Environment** in the left menu.
4. Add these keys and values (same as your local `.env`):

   | Key | Value |
   |-----|-------|
   | `SUPABASE_URL` | Your Supabase project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
   | `BREVO_API_KEY` | Your Brevo API key |
   | `BREVO_LIST_ID` | Your Brevo list ID number |
   | `SIGNUP_NOTIFY_EMAIL` | Who gets a "New signup" email (a verified Brevo sender) |

5. Click **Save Changes**. Render will redeploy automatically.

6. After deploy finishes, test signup on your live website the same way you tested locally.

> If you're merging the `feature/signup-brevo-supabase` branch first, make sure that code is deployed before testing production signup.

---

## Part 6: Day-to-day use (for farm operators)

**Operators should use Brevo only.** They do not need Supabase access.

### Viewing contacts

1. Log in to [https://app.brevo.com](https://app.brevo.com)
2. Go to **Contacts** → **Lists** → **Pollinator Acres Subscribers**
3. Browse, search, or export contacts

### Adding someone manually

1. **Contacts** → **Create a contact**
2. Fill in name, email and/or phone
3. Set `PREFERENCES` to `email`, `text`, or `both`
4. Add them to your subscriber list

> Manually added Brevo contacts won't appear in Supabase until you build a sync back (or add them via the website). For now, prefer the website signup form or the CSV import for bulk adds.

### Sending an email blast

1. Go to **Campaigns** → **Email**
2. Create a campaign (e.g. "Fresh eggs available")
3. Choose your subscriber list as the audience
4. Write the message and send (or schedule)

### Sending a text (SMS)

1. Brevo supports SMS under **Campaigns** or **Transactional** depending on your plan
2. You may need to verify your business and purchase SMS credits first
3. Filter contacts who have a phone number in the `SMS` field

### When someone signs up on the website

It happens automatically — no action needed. They appear in both Supabase and Brevo within seconds,
and `SIGNUP_NOTIFY_EMAIL` gets a short "New signup" email with their name, email, phone and preference.
Updates to an existing contact don't send an email.

---

## Part 7: Keeping it running for free

The signup form depends on two free services, and each has a gotcha that can silently break signups. Here's how to keep both healthy without paying.

### 7.1 Supabase pauses free projects after 7 days of no activity

This is the big one. Supabase's free plan **pauses your database after about a week with no requests**. When that happens the signup form fails for everyone with "Unable to save signup. Please try again." until someone restores the project. A quiet week with no signups is enough to trigger it.

**The fix (already set up in this repo):** the website has a health endpoint at `/api/health` that runs a tiny database query. A GitHub Actions job in `.github/workflows/supabase-keepalive.yml` calls it twice a day, so Supabase never sees the project as idle. GitHub Actions is free for this.

You don't need to do anything for it to work, as long as:

- The code is deployed to Render (the endpoint has to exist on the live site).
- The GitHub repository stays on GitHub. The schedule runs from there.

**How to check it's working:** on GitHub, open the repo, click **Actions**, then **Supabase keep-alive**. You should see a green run roughly every 12 hours. A red run means the health check failed. Open it to see the response.

> GitHub disables scheduled workflows automatically if the repo has **no commits for 60 days**. If you get an email from GitHub saying the workflow was disabled, open the Actions tab and click **Enable workflow**. Pushing any commit also re-enables it.

**If Supabase pauses anyway:** log in to [https://supabase.com/dashboard](https://supabase.com/dashboard), open the **Pollinator Acres** project, and click **Restore project**. It takes 2 to 5 minutes. Then re-run the keep-alive workflow from the Actions tab (**Run workflow**) to confirm everything is green.

**Paid alternative:** Supabase Pro ($25/month) never pauses. Only worth it if the free plan becomes a hassle.

### 7.2 Brevo blocks requests from unknown IP addresses

Brevo has a security setting called **Authorized IPs**. When it's on, Brevo only accepts API calls from addresses on a list. Your first login address gets added automatically, but the website runs on Render, not on your computer, so Render's addresses must be on the list too. Otherwise signups save to Supabase but never appear in Brevo, and `brevo_sync_error` in Supabase says "unrecognised IP address".

**Current setup:** Render's Ohio outbound ranges are authorized: `74.220.50.0/24` and `74.220.58.0/24`.

**If it breaks again** (for example, Render changes its addresses, or the service moves region):

1. In Render, open the **pollinator-acres** service, click **Connect** (top right), then the **Outbound** tab. Copy the IP ranges listed.
2. In Brevo, go to **Settings → Security → Authorized IPs**.
3. Click **Authorize IP addresses**, paste the ranges (comma-separated), and click **Authorize IP addresses**.

Or, simpler: on that same Brevo page, click **Deactivate for API keys** to turn the blocking off entirely. The API key is still secret, so this is a reasonable choice.

> Local development: your laptop's address changes over time, so `npm run dev` may get the same Brevo rejection even though the live site works. That's expected. Signups still save to Supabase locally; only the Brevo sync fails.

### 7.3 Spam signups

Bots do find the form. Signups with gibberish first names like "Nxejvkhq", random Gmail addresses, and fake phone numbers are spam. Two cheap defenses are built in:

- A hidden **honeypot** field. People never see it; bots fill it in.
- A **time-to-fill** check. Submissions under 2.5 seconds after the page loads are ignored.

Bots that trip either check get a fake "success" so they don't learn what to change. Nothing is saved. If spam still gets through, delete it in Brevo (it flows there) and in Supabase, and consider adding Cloudflare Turnstile (free) as a stronger check.

---

## Troubleshooting

### "Unable to save signup. Please try again."

The server could not reach Supabase. Nine times out of ten the project is **paused**. See Part 7.1: restore it from the Supabase dashboard and make sure the keep-alive workflow is running.

### "Signup is not configured yet"

The server can't find `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY`. Check your `.env` locally or Render environment variables.

### Signup works in Supabase but not Brevo

1. Check `BREVO_API_KEY` and `BREVO_LIST_ID` are correct
2. In Supabase, open the subscriber row and look at `brevo_sync_error` for details
3. Confirm the `PREFERENCES` attribute exists in Brevo (exact spelling, all caps)
4. If the error mentions an "unrecognised IP address", Brevo is blocking Render. See Part 7.2.

### "A valid phone number is required"

The form expects a US-style number: 10 digits, or 11 digits starting with 1, or a `+` country code.

### Duplicate contacts

If someone signs up twice with the same email or phone, the system updates their existing record instead of creating a duplicate.

### Local dev signup doesn't work

Make sure you're running `npm run dev` (not just opening the built files). The dev server proxies `/api/signup` to the backend logic. Instagram env vars are separate — signup only needs the four Supabase/Brevo variables.

---

## Quick reference

| Task | Where |
|------|-------|
| See raw subscriber data | Supabase → Table Editor → `subscribers` |
| Manage list & send blasts | Brevo → Contacts / Campaigns |
| Website signup form | pollinatoracres.com → "Stay in the Loop" section |
| Import contacts from CSV | `npm run import-subscribers -- contacts.csv` |
| Environment variables | `.env` (local) / Render Dashboard (production) |

---

## What's next (future mobile app)

Supabase already holds everything the app will need. When you build the app:

- Connect it to the same Supabase project
- Read from the `subscribers` table (and future tables for orders, etc.)
- Operators can keep using Brevo for blasts until you move that into the app

You do **not** need to migrate contacts again if Supabase has been receiving signups from day one.
