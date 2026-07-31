# Homepage Documentation

## Purpose
Documents the structure, section layout, copy arrays, and animations of the main landing page.

## File Reference
- [Home.tsx](file:///c:/VS%20Code/Revenex/artifacts/revenex/src/pages/Home.tsx)

---

## Marketing Section Structure

The landing page consists of 12 sequential sections, styled in accordance with the warm-beige palette:

1.  **Navbar**: Sticky glass navigation container.
2.  **Hero**: Displays the key pitch, CTA buttons, trust badges, and an interactive **Dashboard Mockup** summarizing mock metrics (fees, attendance, AI actions).
3.  **Partners Strip**: A marquee loop showcasing official technology partner logos (Google Cloud, Gemini AI, Razorpay, Firebase, Twilio).
4.  **Problem Section**: Before/After presentation comparing legacy paper/Excel friction with automated workflows.
5.  **Features Section**: A responsive bento-grid showcasing features (student records, online fees, parent alerts).
6.  **Why Revenex Section**: Details infrastructure benefits (cloud-first, enterprise security, fast support SLA).
7.  **Products Section** (`schoolProduct`): Directly displays the three School ERP dashboard cards (Principal, Teacher, Parent) with their capabilities.
8.  **How It Works**: Vertical animated scroll timeline indicating the onboarding stages.
9.  **Pricing Section**: Starter (free under 500 records) vs Growth (20,000/yr) comparison cards.
10. **Testimonials**: Administrator feedback sliders.
11. **Let's Talk Section**: Form fields for contacting support.
12. **Footer**: Navigation columns and copyright info.

---

## How to Edit

1.  **Edit Copy and Text Lists**:
    - Avoid changing layout tags directly. Most items, timeline steps, and bento cards are mapped from arrays defined at the top of the file (e.g. `features`, `howItWorks`, `partners`).
    - Modify the values inside those arrays to update the text.
2.  **Spring Animations**:
    - Animations use Framer Motion hooks (`useScroll`, `useTransform`, `useSpring`).
    - Alter dampening or stiffness variables globally to change scroll-timeline transition feels.
