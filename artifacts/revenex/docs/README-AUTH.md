# Authentication Documentation

## Purpose
Documents the authentication flow, token decoding utilities, and React state contexts wrapping the application.

## Key Files
- Context: [auth-context.tsx](file:///c:/VS%20Code/Revenex/artifacts/revenex/src/lib/auth-context.tsx)
- Login View: [Login.tsx](file:///c:/VS%20Code/Revenex/artifacts/revenex/src/pages/Login.tsx)
- Signup View: [Signup.tsx](file:///c:/VS%20Code/Revenex/artifacts/revenex/src/pages/Signup.tsx)
- Password Reset View: [ResetPassword.tsx](file:///c:/VS%20Code/Revenex/artifacts/revenex/src/pages/ResetPassword.tsx)

---

## Technical Specifications

### Authentication Context (`AuthProvider`)
- Wraps the entire application routing layer.
- **Token Storage**: Uses `localStorage` (key: `revenex_token`) to persist JSON Web Tokens (JWT).
- **Session Verification**: Restores session memory (email, name, role) via local state on initial page load using the `decodeToken` decoder function.
- **Loading State**: The `loading` state flag prevents unauthorized redirects while validating current tokens on startup.

### Token Decoding
- The `decodeToken` function parses JWT parts to check for expiration (`exp`) and extract the user's role (`admin` or `user`) and identity, validating against the current timestamp:
  ```typescript
  if (payload.exp && payload.exp * 1000 < Date.now()) return null
  ```

### Authentication Forms
- Login and Signup page forms integrate validation constraints and submit API calls:
  - Login Endpoint: `POST /api/auth/login`
  - Signup Endpoint: `POST /api/auth/register`
- Successful responses return JWT tokens which are immediately written to local storage via the `login()` callback.

---

## How to Edit

1.  **Modify Role Permissions**:
    - Manage custom admin screens by checking user role levels via the `useAuth()` hook in routing layers (e.g. `user.role === 'admin'`).
2.  **Add Form Validations**:
    - Login and Signup views utilize standard React inputs. If custom email formats or strong password patterns are required, add validation rules inside the submit trigger before calling endpoints.
