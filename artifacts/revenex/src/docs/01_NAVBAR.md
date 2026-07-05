# Navbar

## What it does

Sticky top navigation with: Home, Products dropdown, Features (anchor scroll), Pricing (anchor
scroll), About, Security, Contact, language toggle, Sign In / user menu, and a "Get Started" CTA.
Also renders a collapsible mobile menu below `lg` breakpoint.

## File to edit

`artifacts/revenex/src/components/Navbar.tsx`

## Common changes

### Add/remove a nav link
Edit the `navItems` array inside `Navbar()`. Each item is either:
- A route link: `{ label, href: '/some-route', isAnchor: false }`
- A same-page anchor: `{ label, href: '#id', isAnchor: true, onClick: handlerFn }`

For anchor links, write a handler like `handleFeaturesClick`/`handlePricingClick`/
`handleSecurityClick` that scrolls to the section if already on `/`, or navigates to `/` first
then scrolls after a short delay (handles cross-page navigation).

### Edit the Products dropdown
The dropdown content comes from the `productColumns` array near the top of the file — two
columns (`School ERP`, `Business CRM`), each with a `title`, `icon` (lucide-react), and a list of
`items` (`label` + `href`). Add/remove items there; both the desktop dropdown (`ProductsMenu`)
and the mobile expandable list read from the same array.

### Change logo / brand text
The `REVEN` / `EX` split text is inside the `<Link href="/">` at the top of `Navbar()`.

### Change CTA button text/link
"Get Started →" button links to `/book-demo` — search for `Get Started` in the file.

## Hardcoded values

- Nav item labels/hrefs: `navItems` array
- Products dropdown items: `productColumns` array
- CTA button text: `"Get Started →"`, `"Schedule a Demo"` (via `/book-demo` link)
