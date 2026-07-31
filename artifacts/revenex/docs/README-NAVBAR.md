# Navbar Documentation

## Purpose
Defines the top navigation bar, the interactive "Products" dropdown menu, language toggle switches (Hindi/English), and mobile menu responsiveness.

## Component
- [Navbar.tsx](file:///c:/VS%20Code/Revenex/artifacts/revenex/src/components/Navbar.tsx)

---

## Technical Specifications

### Navigation Links
The navbar structure is driven by the `navItems` array inside the `Navbar` component:
- `label`: Display text (looks up translation via `t('nav.home')` etc., or maps statically).
- `href`: Section anchor IDs (`#features`, `#pricing`) or path strings (`/contact`).
- `isAnchor`: Set to `true` to enable smooth scroll behavior via the `scrollToSection` helper function.
- `onClick`: Optional click handler (triggers redirection to home and scroll transition if clicked from secondary pages).

### Products Dropdown Menu
- Managed by the `ProductsMenu` helper component.
- Uses `productColumns` containing ONLY the `School ERP` category.
- **Visual Design**: Uses a custom Glassmorphic popover container (`w-[240px]` width, flex vertical layout) positioned absolutely under the button.
- Smooth scale-in/scale-out transition is handled using Framer Motion's `AnimatePresence`.
- Listens for outside clicks to auto-close the dropdown.

### Language Toggle
- Uses the `useLanguage` hook from `@/lib/language-context` to switch active locales between `'en'` and `'hi'`.
- Leverages local storage (`revenex-language` key) to remember user preferences across sessions.

---

## How to Edit

1.  **Add a New Navbar Link**:
    - Modify the `navItems` array in `Navbar.tsx`.
    - If linking to a homepage section, ensure the target component contains a matching `id` tag (e.g. `<section id="features">`).
2.  **Add/Remove Dropdown Items**:
    - Edit the `items` array under the `School ERP` column in `productColumns` at the top of the file:
      ```typescript
      { label: 'New Dashboard', href: '/#products' }
      ```
3.  **Adjust Layout or Dimensions**:
    - The dropdown popover uses Tailwind utilities combined with custom `glass` styling.
    - If you add many links and want to adjust spacing, edit padding (`p-5`) or gaps (`gap-4`) directly in the `motion.div` element.
