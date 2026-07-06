Create a complete README documentation folder in artifacts/revenex/src/docs/
These files are for the developer to read before making any changes.
Each README must be detailed, practical and reference exact file paths.
Do not modify any component files. Only create .md files.
Build must still pass after this.

Create these files:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: artifacts/revenex/src/docs/00_OVERVIEW.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Revenex Website — Developer Overview

## Project Structure
- Monorepo: pnpm workspace
- Frontend: artifacts/revenex/src/
- Backend API: artifacts/api-server/src/
- Shared DB: lib/db/

## How to Run Locally
- Install: pnpm install (from repo root)
- Frontend dev: pnpm --filter @workspace/revenex dev
- API dev: pnpm --filter @workspace/api-server run build
           then pnpm --filter @workspace/api-server run dev
- Build check: pnpm --filter @workspace/revenex build

## How to Deploy
- Push to GitHub → Vercel auto-deploys frontend
- API deployed separately (see api-server README)

## Tech Stack
- Frontend: React + Vite + TypeScript + TailwindCSS + framer-motion
- Icons: lucide-react
- Animations: framer-motion (whileInView, whileHover, AnimatePresence)

## Color Palette (NEVER change these without updating 12_COLORS_THEME.md)
- Background: #F5F0E8
- Text primary: #1A1410
- Text body: #3D3128
- Text muted: #6B5D52
- Accent: #8B4513
- Accent light: #C4722A
- Card bg: #FFFFFF
- Card border: #EDE8E3

## Page Section Order
1. Hero → 2. Partners → 3. Problem → 4. Features →
5. Why Revenex → 6. Products → 7. How It Works →
8. Pricing → 9. Leadership → 10. Testimonials →
11. Contact → 12. Footer

## Rules Before Making Any Change
1. Read the relevant section README below first
2. Run build after every change
3. Never change colors outside the palette above
4. Never install new npm packages without checking existing ones
5. Never edit files outside artifacts/revenex/src/ for frontend changes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: artifacts/revenex/src/docs/01_NAVBAR.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Navbar

## File to Edit
artifacts/revenex/src/components/Navbar.tsx (or wherever navbar lives)

## Current Links
Home | Products (dropdown) | Features | About | Pricing | Contact | Sign In

## How to Add a New Navbar Link
1. Open the navbar component file
2. Find the links array or nav items JSX
3. Add: { label: 'New Page', href: '#section-id' }
4. For smooth scroll links use href="#section-id"
5. For page routes use href="/page-name"

## How to Edit the Products Dropdown
- Find the dropdown JSX inside the navbar component
- School ERP items and Business CRM items are in two arrays
- Each item has: icon, title, description, href
- Add/remove items from either array

## How to Change the Sign In Button
- Find the CTA button at the end of nav links
- Change href to point to your auth page
- Change label text directly

## Scroll Link IDs (these must match section IDs in page)
- Features → #features
- Pricing → #pricing
- Contact → #contact

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: artifacts/revenex/src/docs/02_HERO.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Hero Section

## File to Edit
artifacts/revenex/src/components/Hero.tsx (or sections/Hero.tsx)

## How to Change the Main Headline
- Find the h1 or heading element
- Line 1: "Modern school management"
- Line 2: "Made for India" (colored text — keep className for color)
- Line 3: "Simple with REVENEX"
- Change text directly, do NOT remove className

## How to Change the Subtext
- Find the paragraph below the heading
- Edit text directly

## How to Change CTA Buttons
- Button 1 "Schedule a Demo": change href to your Calendly/demo link
- Button 2 "Sign In": change href to auth page route

## How to Change Trust Badges
- Find the row with "Enterprise Security", "99.9% Uptime", "Indian EdTech"
- Add/remove badges by adding/removing items in the array or JSX rows

## Dashboard Preview
- The mockup card showing 2,847 students etc is hardcoded in JSX
- To update the numbers find the stat values inside the card component

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: artifacts/revenex/src/docs/03_PARTNERS.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Partners / Trusted By Strip

## File to Edit
Find component with "TRUSTED PARTNERS" label in artifacts/revenex/src/

## How to Add a New Partner Logo
1. Add the logo SVG or image to artifacts/revenex/src/assets/
2. Import it at the top of the partners component
3. Add a new entry to the partners array:
   { name: 'Partner Name', logo: importedLogo }
4. The marquee will automatically include it

## Logo Size Rules (IMPORTANT)
- All logo images must have: height: 28px, width: auto
- All pill containers must have: height: 56px, min-width: 160px
- Never change individual logo sizes — change the container rule for all

## How to Change Scroll Speed
- Find the marquee animation duration (framer-motion or CSS animation)
- Increase duration value to slow down, decrease to speed up

## How to Remove a Partner
- Remove its entry from the partners array
- Remove its import from the top of the file

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: artifacts/revenex/src/docs/04_PROBLEM_SECTION.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Problem Section (Before / After Revenex)

## File to Edit
Find component with "THE PROBLEM" label in artifacts/revenex/src/

## How to Add a New Problem Item (Before column)
1. Find the beforeItems array
2. Add: { number: 5, icon: IconName, title: 'Title', desc: 'Description' }
3. Import the lucide icon at the top of the file

## How to Add a New Solution Item (After column)
1. Find the afterItems array
2. Add: { icon: IconName, title: 'Title', desc: 'Description' }

## How to Change the Heading
- Find the main h2/h3 element
- Keep both lines — first line plain, second line has colored class

## Design Rules for This Section
- Before card: red/warm tinted background — do NOT make it white
- After card: white with brown border — do NOT make it dark
- The center arrow between cards must stay
- Never remove the numbered circles on Before items

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: artifacts/revenex/src/docs/05_FEATURES.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Features Section

## File to Edit
Find component with id="features" in artifacts/revenex/src/

## How to Add a New Feature Card
1. Find the features array in the component
2. Add:
   {
     icon: IconName,        // lucide-react icon
     title: 'Feature Name',
     description: 'Short description of this feature',
     wide: false            // set true for col-span-2 wide card
   }
3. Import the icon at the top of the file

## How to Change a Feature Card Title or Description
- Find the features array
- Edit title or description string directly

## Layout Rule
- First card and last card are wide (col-span-2)
- Do not make more than 2 cards wide at once

## Icon Rules
- Always use lucide-react icons
- Icon size: 24
- Icon color is set by CSS — do not add inline color to icon

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: artifacts/revenex/src/docs/06_PRODUCTS.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Products Section

## File to Edit
Find component with id="products" or "PRODUCTS" label in artifacts/revenex/src/

## Structure
Two tabs: School ERP | Business CRM
Each tab shows 3 cards.

## How to Edit a Product Card
1. Find the schoolERPCards or businessCRMCards array
2. Each card has: icon, title, subtitle, tag, features[]
3. Edit the fields directly

## How to Add a Feature to a Card
- Find the card in the array
- Add a string to its features[] array
- Max 6 features per card recommended

## How to Add a New Card
1. Add to the relevant array (schoolERPCards or businessCRMCards)
2. Card object structure:
   {
     icon: IconName,
     title: 'Dashboard Name',
     subtitle: 'One line description',
     tag: 'Tag Label',
     features: ['Feature 1', 'Feature 2', ...]
   }

## Tab Switching
- Tab state is managed with useState in the component
- activeTab: 'erp' | 'crm'
- AnimatePresence handles the fade transition between tabs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: artifacts/revenex/src/docs/07_HOW_IT_WORKS.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# How It Works Section

## File to Edit
Find component with "HOW IT WORKS" label in artifacts/revenex/src/

## How to Edit a Step
1. Find the steps array
2. Each step has: number, icon, title, line1, line2, pills[]
3. Edit fields directly

## How to Add a New Step
1. Add to steps array
2. Update step numbers
3. The vertical timeline line auto-extends

## How to Change Step Pills
- Find pills[] array inside the step object
- Add/remove strings
- Each string becomes one pill badge

## Timeline Line Animation
- Uses framer-motion useScroll + useTransform
- The line fills as user scrolls — do not remove this
- If the line breaks, check that the section ref is attached correctly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: artifacts/revenex/src/docs/08_PRICING.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Pricing Section

## File to Edit
Find component with id="pricing" in artifacts/revenex/src/

## How to Change Prices
- Starter price: find "₹0" text — change directly
- Growth price: find "₹20,000" text — change directly
- Also update the "/year" and "₹1,667/month" breakdown text nearby

## How to Add a Feature to a Plan
1. Find starterFeatures[] or growthFeatures[] array
2. Add a string — it becomes a new checklist item

## How to Change CTA Button Links
- Starter "Get Started Free": change href to signup route
- Growth "Schedule a Demo": change href to demo/contact route

## Design Rules
- Growth card MUST stay elevated (translateY -16px) above Starter
- Growth card MUST stay dark (#1A1410 background) — never make it white
- "MOST POPULAR" badge must stay on Growth card
- Never swap the card positions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: artifacts/revenex/src/docs/09_LEADERSHIP.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Leadership / About Team Section

## File to Edit
Find component with "OUR TEAM" label in artifacts/revenex/src/

## How to Edit a Team Member
1. Find the teamMembers array
2. Each member has: initials, name, title, bio
3. Edit fields directly

## How to Add a Team Member
Add to teamMembers array:
{
  initials: 'AB',
  name: 'Full Name',
  title: 'Job Title',
  bio: 'One line bio'
}

## How to Add a Photo
- Replace the initials circle with an <img> tag
- Add photo to artifacts/revenex/src/assets/team/
- Import and use as src

## Section Placement
This section must always come AFTER Pricing and BEFORE Testimonials.
Do not move it.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: artifacts/revenex/src/docs/10_CONTACT.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Contact Section

## File to Edit
Find component with id="contact" in artifacts/revenex/src/

## How to Change Contact Details
- Email: find the email string and update
- Phone: find the mobile/phone string and update
- Location: find the location/city string and update

## How to Change Form Fields
- Fields are: Name, Email, School Name, Message, Send button
- Each field is a controlled input with useState
- Add a new field by adding useState + input JSX

## Form Submission
- Find the handleSubmit function
- Currently may be a placeholder — connect to your backend API endpoint
- API endpoint should be: POST /contact or your email service

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: artifacts/revenex/src/docs/11_FOOTER.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Footer

## File to Edit
Find Footer component in artifacts/revenex/src/

## How to Update Social Links
- Find the social links array
- Update href for LinkedIn, Twitter, Instagram etc

## How to Update Footer Navigation Links
- Find the footer nav columns (Product, Company, Legal etc)
- Add/remove link objects: { label: 'Link Name', href: '/route' }

## How to Change Copyright Text
- Find "© 2025 Revenex" text at the bottom
- Update year and company name directly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FILE: artifacts/revenex/src/docs/12_COLORS_THEME.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Color Theme — Master Reference

## NEVER change these without a deliberate decision

## Background Colors
- Page bg:          #F5F0E8  (warm beige)
- Section alt bg:   #EDE8DC  (slightly deeper beige)
- Card bg:          #FFFFFF  (white)
- Card hover bg:    #FAFAF8

## Text Colors
- Heading:          #1A1410  (near-black warm brown)
- Body text:        #3D3128  (readable warm dark brown)
- Muted text:       #6B5D52  (medium warm brown)
- Accent text:      #8B4513  (saddlebrown — links, highlights)
- Accent light:     #C4722A  (warm orange-brown — gradients)

## Border Colors
- Default:          #EDE8E3
- Medium:           #E8E0D4
- Strong:           #D4B896
- Accent:           #8B4513

## Button Colors
- Primary bg:       #1A1410  text: #FFFFFF
- Primary hover:    #3D2810
- Secondary:        border #1A1410  text: #1A1410  bg: transparent
- Secondary hover:  bg #1A1410  text: #FFFFFF
- Accent:           bg linear-gradient(90deg, #8B4513, #C4722A)  text: white

## Special Card Colors
- Problem Before:   bg gradient red tint, border #FECACA
- Problem After:    bg white, border #8B4513
- Pricing Growth:   bg #1A1410 (DARK — intentional)

## Shadows
- Card default:     0 2px 16px rgba(139,69,19,0.07)
- Card hover:       0 16px 48px rgba(139,69,19,0.14)
- Button:           0 8px 24px rgba(26,20,16,0.2)
- Growth card:      0 32px 80px rgba(26,20,16,0.4)

## What NOT to Do
- Never use teal, cyan, green, blue, or purple anywhere
- Never use pure black (#000000) — use #1A1410 instead
- Never use pure white text on beige background — use #1A1410
- Never add new colors without updating this file

After creating all files:
pnpm --filter @workspace/revenex build must pass.
Commit: "docs: add complete section readme documentation"
Push to GitHub