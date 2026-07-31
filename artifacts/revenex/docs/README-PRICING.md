# Pricing Section Documentation

## Purpose
Documents the presentation, plans models, checkout routes, and numbers animation of the Pricing section.

## File Reference
- [Home.tsx](file:///c:/VS%20Code/Revenex/artifacts/revenex/src/pages/Home.tsx) -> `PricingSection` component.

---

## Plan Structures & Configuration

Pricing consists of two distinct plans:

### 1. Starter Plan (₹0 / forever)
- **Eligibility**: Schools under 500 students.
- **Copy Details**: Defined inside the `starter` object inside `PricingSection`.
- **Card Design**: Minimalist clean white card with custom saddle-brown checks.

### 2. Growth Plan (₹20,000 / year)
- **Eligibility**: Unlimited students and records.
- **Copy Details**: Defined inside the `growth` object.
- **Price Animation**: Price value is animated on scroll-in using the `useCountUp` hook and Framer Motion's `useInView` to tick values from `0` to `20000` over a `1500ms` window.
- **Card Design**: Premium dark gradient card with an active breathing border glow to emphasize value.

---

## How to Edit

1.  **Add/Remove Plan Features**:
    - Edit the `features` arrays in the `starter` and `growth` objects.
2.  **Adjust Prices or Periods**:
    - Edit the price string or year/month values.
    - If changing the target price for the Growth plan, update the threshold value in the count-up call:
      ```typescript
      const growthPrice = useCountUp(newPrice, duration, growthInView)
      ```
3.  **Preserve Layout Hierarchy**:
    - The Growth card must remain elevated (`translate-y-[-20px]` on hover or design) to indicate it is the recommended tier. Do not change its dark background, as it creates a premium contrast.
