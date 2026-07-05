# Revenex Website — Overview

This folder documents the Revenex marketing website so future edits are quick and safe.

## What this site is

A marketing site for Revenex, a School ERP SaaS for the Indian K-12/higher-ed market (plus a
Business CRM product line). It has marketing pages, auth, reviews, contact/demo forms, an admin
panel, and a support chatbot.

## Where things live

- Main landing page: `artifacts/revenex/src/pages/Home.tsx` — contains almost all marketing
  sections (Hero, Partners, Problem, Features, Why Revenex, How It Works, Security, Products,
  Pricing, Team, Reviews, Contact/footer CTA) as functions inside this one file.
- Navbar: `artifacts/revenex/src/components/Navbar.tsx`
- Footer: `artifacts/revenex/src/components/Footer.tsx`
- Global styles / color tokens: `artifacts/revenex/src/index.css`
- Other pages: `artifacts/revenex/src/pages/*.tsx` (About, Founders, Security, Contact,
  BookDemo, Login, Signup, Admin, etc.)

## How to run / build

- Dev server: the `artifacts/revenex: web` workflow runs `pnpm --filter @workspace/revenex run dev`
- Production build: `pnpm --filter @workspace/revenex run build` (must pass with zero errors
  before committing any change)

## Color theme

See `09_COLORS_THEME.md` for the full beige theme palette and rules. In short: warm beige
background, near-black/brown text, deep rust/saddlebrown accents. Never use golden/yellow or
teal/cyan colors — they clash with the beige palette.

## File index

- `01_NAVBAR.md` — navbar links, Products dropdown
- `02_HERO.md` — hero section layout and copy
- `03_PROBLEM_SECTION.md` — "Before vs After Revenex" section
- `04_FEATURES.md` — feature cards grid
- `05_PRODUCTS.md` — Products section (School ERP / Business CRM tabs)
- `06_PRICING.md` — Pricing section (Starter / Growth plans)
- `07_ABOUT.md` — About / Team section
- `08_CONTACT.md` — Contact form and footer
- `09_COLORS_THEME.md` — full color palette reference
