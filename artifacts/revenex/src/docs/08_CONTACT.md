# Contact / Footer

## What it does

- `Footer.tsx`: site footer with links, contact info, social icons.
- `pages/Contact.tsx`: standalone contact form page (posts to `/api/contacts`).
- `pages/BookDemo.tsx`: demo request form (posts to `/api/demo-requests`).
- Home.tsx also has an inline contact CTA/reviews-adjacent block near the bottom of the page.

## Files to edit

- `artifacts/revenex/src/components/Footer.tsx`
- `artifacts/revenex/src/pages/Contact.tsx`
- `artifacts/revenex/src/pages/BookDemo.tsx`

## Common changes

### Change footer links/columns
Edit the link arrays inside `Footer.tsx` — grouped into columns (e.g. Product, Company, Legal).

### Change contact details (email/phone/address)
Search `Footer.tsx` and `Contact.tsx` for the hardcoded contact info block (icon + label +
value, e.g. email/phone/address rows).

### Change form fields
`Contact.tsx` and `BookDemo.tsx` each define their own form state (`useState`) and field list —
add a new field by adding to the state object and rendering a new input, then wire it into the
submit payload sent to the API.

## Hardcoded values

- Footer column headings and links
- Contact email/phone/address text
- Form field labels and validation messages
