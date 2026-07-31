# Products Section Documentation

## Purpose
Documents the Products section, which showcases the core dashboards of the School ERP system.

## File Reference
- [Home.tsx](file:///c:/VS%20Code/Revenex/artifacts/revenex/src/pages/Home.tsx) -> `ProductsSection` component.
- Detailed features routing targets [FeatureDetail.tsx](file:///c:/VS%20Code/Revenex/artifacts/revenex/src/pages/FeatureDetail.tsx).

---

## Technical Specifications

### Product Layout
- Replaced the legacy tab switcher with a clean, single-row grid showcasing the school management capabilities directly.
- Renders three interactive dashboard cards:
  1.  **Principal Dashboard** (slug: `ai-analytics`): Analytics, staff oversight, and approval workflows.
  2.  **Teacher Dashboard** (slug: `exam-results`): Lesson plans, digital gradebooks, and parent messages.
  3.  **Parent Dashboard** (slug: `parent-communication`): Attendance alerts, Razorpay fee payments, and bus tracking.

### Card Components & Animations
- Uses `schoolProduct.cards` mapping.
- Each card has: `title`, `desc`, `icon` (Lucide), `color`, `features` (bullet array), and `slug`.
- **Animations**:
  - Uses Framer Motion's `whileHover` to elevate cards (`y: -8`) and trigger border light gradients.
  - Entrance spring paths animate cards inward from the left, bottom, and right depending on index position.
- **Action Buttons**:
  - Each card links to `/features/:slug`, routing to specific detail pages.

---

## How to Edit

1.  **Modify Dashboard Capabilities**:
    - Locate the `schoolProduct` object inside `ProductsSection` in `Home.tsx`.
    - Edit the text values inside the `features` array of any card.
2.  **Add a New Dashboard Card**:
    - Add a card object to the `cards` array in `schoolProduct` with appropriate Lucide icon and slug configurations.
    - Ensure your layout remains visually balanced (adjust columns to `sm:grid-cols-4` if adding a 4th card).
