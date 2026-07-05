# Problem Section — "Before vs After Revenex"

## What it does

A two-column comparison ("BEFORE REVENEX" vs "WITH REVENEX") under the heading "Running a school
is hard. Revenex makes it effortless." Sits between the Partners strip and the Features section.

## File to edit

`artifacts/revenex/src/pages/Home.tsx` — search for `SectionBadge label="The Problem"`.

## Common changes

### Edit the section heading/subtext
Directly below the `SectionBadge`, two `<h2>` lines and a subtext paragraph.

### Edit "Before" column items
Look for the array/list feeding the left column (numbered items: Paper Registers, Manual
Billing, Long Queues, No Visibility, Late Payroll, Parent Disconnect). Each item has a title and
a one-line description.

### Edit "After" column items
The right column ("WITH REVENEX") list (Digital Attendance, Automated Fee Collection,
AI-Generated Reports, Real-Time Revenue Tracking, Parent Mobile Access, Go Live in 4 Weeks).

## Hardcoded values

- Section label: "The Problem"
- Heading: "Running a school is hard." / "Revenex makes it effortless."
- Subtext: "Most Indian schools are stuck in the 1990s. We built the solution."
- Before/After column badges and item copy (see above)
