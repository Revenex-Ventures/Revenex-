# Revenex Frontend Website — Developer Documentation

Welcome to the developer documentation for the Revenex web application. This directory acts as the central reference manual for updating the marketing site, styling components, and managing deployment configurations.

## Frontend Folder Structure

The frontend application code lives under `artifacts/revenex/`:

```
artifacts/revenex/
├── docs/                  # Markdown guides (this directory)
├── public/                # Static assets (favicons, icons)
├── src/
│   ├── assets/            # Static assets and local images
│   ├── components/        # Shared UI components (Navbar, Footer, Chatbot, Testimonials)
│   ├── hooks/             # Custom React Hooks
│   ├── lib/               # App contexts (auth, language translations, utils)
│   ├── pages/             # Page views (Home.tsx, About.tsx, Contact.tsx, FeatureDetail.tsx)
│   ├── App.tsx            # Main shell, React Query Setup, Wouter router
│   ├── index.css          # Tailwind CSS global styles, variables, beige theme
│   └── main.tsx           # React virtual DOM entry point
├── package.json           # Frontend dependencies and npm script config
├── vercel.json            # Deployment routing overrides for Vercel
└── vite.config.ts         # Vite build configuration (outDir setup, proxies)
```

---

## Architectural & Library Setup

The web application is built on modern, lightweight libraries:

1.  **Routing (Wouter)**: The app uses `wouter` for lightweight client-side routing.
    - Router configurations are located in [App.tsx](file:///c:/VS%20Code/Revenex/artifacts/revenex/src/App.tsx).
    - It uses the standard HTML5 history API, supported in production on Vercel via fallback rewrites to `index.html`.
2.  **API Client & State (@tanstack/react-query)**:
    - Shared API actions (fetching reviews, submitting feedback/contact forms) are managed through `@workspace/api-client-react`.
    - `QueryClientProvider` is configured at the root in [App.tsx](file:///c:/VS%20Code/Revenex/artifacts/revenex/src/App.tsx).
3.  **Bilingual Support**:
    - Manage Hindi and English translations in [language-context.tsx](file:///c:/VS%20Code/Revenex/artifacts/revenex/src/lib/language-context.tsx).
    - Keep translations structured using simple key-value lookups (`t('nav.home')`).
4.  **Animations (framer-motion)**:
    - Utilizes spring-based interactions for premium scroll timelines, hover expansions, and fade exits (`AnimatePresence`).

## Documentation Index

The following documentation guides are available in this directory:
- [Overview / Project Structure](README.md) (this guide)
- [Authentication Architecture](README-AUTH.md)
- [Color Palette & Theme Reference](README-COLORS.md)
- [Shared Component Frameworks](README-COMPONENTS.md)
- [Chatbot Prompts & Flow Manual](README-CHATBOT.md)
- [Contact Forms & Submissions](README-CONTACT.md)
- [Build & Deployment Workflows](README-DEPLOYMENT.md)
- [Homepage Marketing Sections](README-HOME.md)
- [Pricing Model Configuration](README-PRICING.md)
- [School ERP Products Details](README-PRODUCTS.md)

---

## General Rules for Developers

1.  **Compile & Run Build**: Always run `pnpm --filter @workspace/revenex build` before committing. If bundling fails, Vercel deployment will break.
2.  **Preserve Core Theme**: All styling modifications must adhere strictly to the warm-beige color system defined in [README-COLORS.md](file:///c:/VS%20Code/Revenex/artifacts/revenex/docs/README-COLORS.md). Never introduce default Tailwind colors like bright blues, greens, or pure blacks.
3.  **Update Corresponding Docs**: When modifying a section (e.g. Products or Pricing), update its corresponding Markdown file in this directory.
