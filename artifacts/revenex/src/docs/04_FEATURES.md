# Features Section

## What it does

A grid of feature cards (`id="features"` — the navbar "Features" link scrolls here). Each card
has an icon, title, and description.

## File to edit

`artifacts/revenex/src/pages/Home.tsx` — the `features` array near the top of the file (search
for `/* ─── Features ─── */`), and the `<section id="features">` further down that renders it.

## Common changes

### Add/remove/edit a feature card
Edit the `features` array. Each entry: `{ icon, title, desc, color, bg, slug }`.
- `icon`: any lucide-react icon (must be imported at the top of the file)
- `color`/`bg`: use only theme-approved colors — see `09_COLORS_THEME.md`. Do NOT use raw
  Tailwind colors like `text-blue-400`, `text-yellow-400`, `text-cyan-400`, etc. — they clash
  with the beige theme.
- `slug`: used for the "Learn more" link to `/features/:slug` (see `FeatureDetail.tsx`)

## Hardcoded values

- All feature titles/descriptions live in the `features` array
- Current features: Student Management, Attendance Tracking, Fee Management, Parent
  Communication, Exam & Results, AI Analytics, Staff Management, Security & Access
