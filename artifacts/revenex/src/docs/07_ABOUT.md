# About / Team Section

## What it does

Merged About + Leadership section on the homepage (`MeetFoundersSection`), showing a mission
statement and a 3-person team grid: Rounak (CEO), Rohan (Co-Founder), Prasanna (CTO). No tech
stack / framework mentions here per design rules.

There is also a separate standalone `/about` page (`pages/About.tsx`) and an `/our-team` page
(`pages/OurTeam.tsx`) with more detail — edit those separately if needed.

## File to edit

- Homepage team section: `artifacts/revenex/src/pages/Home.tsx` — search for
  `function MeetFoundersSection` (or `Meet the`/`Founders`).
- Standalone About page: `artifacts/revenex/src/pages/About.tsx`
- Standalone Our Team page: `artifacts/revenex/src/pages/OurTeam.tsx`

## Common changes

### Edit a team member's bio/title
Find the team members array/objects (name, title, bio, initials) inside
`MeetFoundersSection` and edit directly.

### Add a new team member
Add a new object to the team array with the same shape (name, title, bio) — the grid layout
adapts automatically (`grid` with responsive columns).

## Hardcoded values

- Mission statement copy (2-line intro above the team grid)
- Team member names, titles, and bios: Rounak (CEO), Rohan (Co-Founder), Prasanna (CTO)
