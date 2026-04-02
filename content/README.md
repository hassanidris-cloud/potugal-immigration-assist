# Website content — editing guide

This folder holds **all website text in one place** so a copywriter or editor can change it without touching code.

## For editors and copywriters

You can edit the text in either of these ways:

### Option 1: Markdown (easiest)

1. Open **`COPY_FOR_EDITING.md`** in Word, Google Docs, or any text editor.
2. Find the line you want to change using the **Location:** lines (they describe where the text appears on the site).
3. Edit **only the line(s) under “Text:”** (or the line that is the actual copy).
4. Save the file and send it to your developer. They will apply your changes to the live site.

**Tips:**
- Do not change **Location:** lines—they are for reference.
- Keep line breaks and punctuation as you want them to appear on the site.
- If a line says “{something}”, that is a placeholder (e.g. `{year}` or `{email}`); the site will replace it automatically. You can leave it as-is or ask your developer.

### Option 2: JSON (for structured edits)

1. Open **`site-copy.json`** in a text editor (e.g. Notepad, VS Code, or an online JSON editor).
2. Each **key** (in quotes on the left) is a label for where the text is used—**do not change the keys**.
3. Change only the **value** (the text in quotes on the right). Keep the quotes and use `\"` if you need a quote inside the text.
4. Save the file (must stay valid JSON: no missing commas, no trailing comma on the last item in an object).
5. Send the file to your developer so they can apply the changes.

**Example:** To change the main homepage headline:
- Find the line: `"hero_title": "Portugal Immigration & Residency",`
- Change it to: `"hero_title": "Your New Life in Portugal Starts Here",`
- Save.

## For developers

- **`site-copy.json`** is the single source of truth. Keys match logical locations (e.g. `home.hero_title`, `contact.form_heading`). To use it in the app you would import this JSON and replace hardcoded strings with lookups (e.g. `copy.home.hero_title`). Placeholders like `{year}` or `{email}` can be replaced at render time.
- **`COPY_FOR_EDITING.md`** is a human-friendly view of the same content. After an editor returns it, you can either re-export to JSON or apply edits manually from the Markdown into the codebase or into `site-copy.json`.

## Files in this folder

| File | Purpose |
|------|--------|
| **site-copy.json** | All copy in one JSON file. Edit values only; use for tooling or future CMS integration. |
| **COPY_FOR_EDITING.md** | Same copy with “Location” + “Text” blocks. Best for non-technical editors. |
| **README.md** | This guide. |

## After editing

1. Editor saves either `COPY_FOR_EDITING.md` or `site-copy.json` (or both).
2. Developer receives the updated file(s).
3. Developer updates the website code to use the new text (or, if the app is already wired to `site-copy.json`, redeploy with the new file).

If you want the site to **automatically** use `site-copy.json` so that future edits don’t require code changes, the developer can add a step that loads this file at build or runtime and replaces hardcoded strings with the values from the JSON.
