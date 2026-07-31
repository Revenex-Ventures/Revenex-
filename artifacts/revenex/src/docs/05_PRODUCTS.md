# Products Section

## What it does

A grid section (`id="products"`) showcasing "School ERP" dashboard cards (Principal, Teacher, and Parent), each showing an animated card with a feature checklist and "Explore →" link.

## File to edit

`artifacts/revenex/src/pages/Home.tsx` — search for `function ProductsSection()`.

## Common changes

### Add/edit a product card
Inside `ProductsSection`, find the `schoolProduct` card list. Each card object has: `icon`, `title`, `desc`, `features` (string array), and `slug`.

### Change card hover animation
Cards use `whileHover` from framer-motion (scale + shadow + top border color change) — adjust values directly on the `motion.div` for each card.

## Hardcoded values

- Section heading: "Empower Your Institution"
- All card titles and feature bullet text (see arrays inside `ProductsSection`)
