# Products Section

## What it does

Tabbed section (`id="products"`) letting visitors switch between "School ERP" and "Business CRM"
product lines, each showing 3 animated cards with a tag, feature checklist, and "Explore →" link.

## File to edit

`artifacts/revenex/src/pages/Home.tsx` — search for `function ProductsSection()`.

## Common changes

### Add/edit a product card
Inside `ProductsSection`, find the data arrays for the School ERP tab (Principal / Teacher /
Parent Dashboard cards) and the Business CRM tab (Hotel & Hospitality / Restaurant Operations /
Retail Management cards). Each card object has: `icon`, `title`, `tag`, `desc`, `features`
(string array).

### Change tab labels
The pill tab buttons near the top of `ProductsSection` — "School ERP" / "Business CRM".

### Change card hover animation
Cards use `whileHover` from framer-motion (scale + shadow + top border color change) — adjust
values directly on the `motion.div` for each card.

## Hardcoded values

- Tab labels: "School ERP", "Business CRM"
- Section heading: "Our Products"
- All card titles, tags, and feature bullet text (see arrays inside `ProductsSection`)
