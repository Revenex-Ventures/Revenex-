# Revenex Website — Developer Overview

## Key File
ALL marketing sections live in ONE file:
artifacts/revenex/src/pages/Home.tsx

Section components inside Home.tsx:
- HeroSection
- PartnersMarquee
- ProblemSection
- FeaturesSection
- WhyRevenexSection
- ProductsSection
- HowItWorksSection
- PricingSection
- LeadershipSection
- TestimonialsSection

Other important files:
- Navbar: artifacts/revenex/src/components/Navbar.tsx
- Footer: artifacts/revenex/src/components/Footer.tsx
- Routes: artifacts/revenex/src/App.tsx

## Commands
- Install: pnpm install (from repo root)
- Dev: pnpm --filter @workspace/revenex dev
- Build: pnpm --filter @workspace/revenex build
- Deploy: push to GitHub, Vercel auto-deploys

## Color Palette (never change without updating 12_COLORS.md)
- Page bg:     #F5F0E8
- Heading:     #1A1410
- Body text:   #3D3128
- Muted:       #6B5D52
- Accent:      #8B4513
- Card bg:     #FFFFFF
- Card border: #EDE8E3

## Rules Before Editing
1. Read the relevant section README first
2. Run build after every change
3. Only edit inside artifacts/revenex/src/
4. Never install new packages without checking existing ones
