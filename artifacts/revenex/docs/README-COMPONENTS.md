# Shared Components Documentation

## Purpose
Documents the shared UI components that provide the interactive layout shell, assistant overlays, and visual effects across the Revenex marketing site.

---

## 1. Navbar
- **File**: [Navbar.tsx](file:///c:/VS%20Code/Revenex/artifacts/revenex/src/components/Navbar.tsx)
- **Features**: Responsive layout, products menu, language translation toggler, auth dashboard actions, and expandable mobile drawer.
- **Scroll Tracking**: Transitions header background from transparent to glassmorphic shadow overlay when page scroll crosses `y > 20`.

## 2. Footer
- **File**: [Footer.tsx](file:///c:/VS%20Code/Revenex/artifacts/revenex/src/components/Footer.tsx)
- **Features**: Includes navigation blocks, legal links, technology partner logos, and official company registry information.

## 3. CursorGlow (Aesthetic Backdrop Effect)
- **File**: [CursorGlow.tsx](file:///c:/VS%20Code/Revenex/artifacts/revenex/src/components/CursorGlow.tsx)
- **Features**: Adds a 3-layer gradient pointer tracker (`outer`, `mid`, `tight`) using Framer Motion springs for low-latency elastic drag trailing.
- **Uptake constraints**: Listens to mouse movements globally. Automatically toggles visibility on page enter/exit triggers.

## 4. Testimonials Section
- **File**: [Testimonials.tsx](file:///c:/VS%20Code/Revenex/artifacts/revenex/src/components/Testimonials.tsx)
- **Features**: Horizontal sliding carousel displaying feedback from school administrators.

## 5. Conversational Chatbot
- **File**: [Chatbot.tsx](file:///c:/VS%20Code/Revenex/artifacts/revenex/src/components/Chatbot.tsx)
- **Features**: Floating AI assistant panel.
- **Persistence Model**: Stores message strings in `sessionStorage` (key: `revenex_chat_messages`) so conversations are retained on page transitions.
- **API Flow**:
  1. Attempts connection to API endpoint (`POST /api/chat`).
  2. If connection fails or returns server status exceptions, falls back to direct client-side fetch targeting OpenRouter API keys.
  3. Uses model `"openrouter/free"` for sub-second, low-latency conversational responses.
