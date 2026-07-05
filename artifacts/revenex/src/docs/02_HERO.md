# Hero Section

## What it does

The first section on the homepage — two columns: left has the badge pill, headline, subtext, two
CTA buttons and trust badges; right has an animated dashboard preview mockup (floating animation,
slide-in on load).

## File to edit

`artifacts/revenex/src/pages/Home.tsx` — inside `export default function Home()`, look for the
comment `{/* ── HERO ── */}`.

## Common changes

### Change headline text
The three headline lines are hardcoded JSX inside the hero `<section>`:
- Line 1: "Modern school management"
- Line 2 (accent color `#8B4513`): "Made for India"
- Line 3: "Simple with REVENEX"

### Change subtext
The paragraph directly below the headline (`text-[#3D3128] max-w-lg`).

### Change CTA buttons
- Primary: "Schedule a Demo →" — links to `/book-demo`
- Secondary: "Sign In →" — links to `/login`

### Change trust badges
Look for the row with "Enterprise Security", "99.9% Uptime", "Indian EdTech" icons/text.

### Change dashboard preview KPI numbers
The mock dashboard card contains a KPI grid (`grid grid-cols-2 gap-3`) with 4 items: Total
Students, Attendance Today, Fees Collected, Staff Active. Edit the inline array right above that
grid to change label/value/icon/color.

## Hardcoded values

- Badge pill text: "SCHOOL ERP PLATFORM"
- Headline lines (see above)
- Subtext paragraph
- CTA button labels and links
- KPI grid values: `2,847`, `94.2%`, `₹12.4L`, `142`
- Bar chart heights: `barHeights` constant near the bottom of the file (before `Home()`)
