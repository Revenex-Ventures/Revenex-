# Pricing Section

## What it does

Two pricing cards (`id="pricing"` — the navbar "Pricing" link scrolls here): "Starter" (free,
most popular) and "Growth Plan" (₹20,000/year, enterprise).

## File to edit

`artifacts/revenex/src/pages/Home.tsx` — search for `function PricingSection()`.

## Common changes

### Change a price
Inside `PricingSection`, find the `plans` array (or inline plan objects). Each plan has:
`name`, `price`, `period`, `desc`, `features` (array of strings), `cta`, `highlighted` (boolean —
controls the "Most Popular" badge and highlighted border/shadow style).

### Add/remove a feature bullet
Edit the `features` array on the relevant plan object — each string becomes one checklist line
with a checkmark icon.

### Change CTA button text/link
Each plan's `cta` field is the button label; the `<Link href="/book-demo">` wrapping it controls
where it goes.

## Hardcoded values

- Section heading: "Start Free. Scale When You Grow."
- Subtext: "Transparent pricing — no hidden fees, no surprises."
- Plan names, prices, periods, feature lists (Starter = ₹0/forever, Growth = ₹20,000/year)
- Footer note: "No credit card required. Free forever for single-campus schools under 500
  students."
