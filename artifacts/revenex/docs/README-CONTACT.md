# Contact & Feedback Form Documentation

## Purpose
Documents the feedback collection systems, database connection endpoints, state validation rules, and input handlers.

## Component File
- [Home.tsx](file:///c:/VS%20Code/Revenex/artifacts/revenex/src/pages/Home.tsx) -> `LetsTalkSection` component.
- [Contact.tsx](file:///c:/VS%20Code/Revenex/artifacts/revenex/src/pages/Contact.tsx) -> Dedicated contact page.

---

## Technical Specifications

### Form Submissions
Both contact interfaces execute actions using React Query hooks from the workspace API client:
- **Let's Talk Form**: Submits general enquiries to the backend.
  - API Hook: `useSubmitContact()`
  - Route: `POST /api/contact`
  - Body payload: `{ name, email, phone, message }`
- **Reviews Form**: Allows users to write reviews directly to the site.
  - API Hook: `useSubmitReview()`
  - Route: `POST /api/reviews`
  - Body payload: `{ name, title, text, rating }`

---

## How to Edit

1.  **Form Input Addition**:
    - Update state declarations inside `LetsTalkSection` or `Contact.tsx`.
    - Map input elements in JSX with matching bindings (`value` and `onChange`).
    - Update the payload parameters passed to the mutate triggers (`submitContact.mutateAsync(...)`).
2.  **Adjusting Notification Alerts**:
    - Submission confirmations utilize custom alerts styled within the beige theme.
    - Error handling prints error payloads dynamically to alert banners.
