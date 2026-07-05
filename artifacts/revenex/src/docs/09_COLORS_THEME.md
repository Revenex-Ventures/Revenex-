# Colors & Theme

## Background

Page background is warm beige `#F5F0E8` — set globally in `index.css`. Do not change this.

## Approved text/UI colors

| Purpose            | Color                          |
|---------------------|---------------------------------|
| Headings            | `#1A1410` (near-black warm brown) |
| Body text           | `#3D3128` (warm dark brown)     |
| Muted / labels      | `#6B5D52` (medium warm brown)   |
| Accent / links      | `#7C3D0F` (deep rust brown)     |
| Highlight word      | `#8B4513` (saddlebrown)         |
| Card background     | `#FFFFFF`                       |
| Card border         | `#E8E0D4`                       |
| Card shadow         | `0 4px 24px rgba(139,69,19,0.10)` |
| Primary button      | bg `#1A1410`, text `#FFFFFF`    |
| Secondary button    | border `#1A1410`, text `#1A1410`, transparent bg |
| Icon bg circles     | `#F0E8DC` (warm beige)          |
| Partners strip bg   | `#EDE8DC`                       |

Success/checkmarks may use `green-700` tones (e.g. `text-green-700`, `bg-green-700/10`) — this
is treated as acceptable since it's a universal, non-playful semantic color, not decorative.

## Forbidden colors

- **No golden/yellow** text or icon colors anywhere (`text-yellow-*`, `fill-yellow-*`) — clashes
  with beige. Use `#8B4513` (saddlebrown) instead, including for star ratings.
- **No teal/cyan** (`text-cyan-*`, `text-teal-*`) — use `#7C3D0F` instead.
- **No dark grey/black section backgrounds.**
- Avoid decorative rainbow/multi-color icon sets (e.g. mixing `text-blue-400`, `text-purple-400`,
  `text-orange-400` across a feature grid) — pick from the approved warm palette above instead,
  varying only between `#7C3D0F`, `#8B4513`, and (for success/checkmarks only) `green-700`.

## Where the palette lives in code

- CSS custom properties and utility classes (`.text-aqua`, `.bg-aqua`, `.gradient-bg`, etc.) are
  defined in `artifacts/revenex/src/index.css` — `--aqua: #7C3D0F` is the accent, so
  `text-aqua` / `bg-aqua` / `border-aqua` already resolve to the correct accent color.
- Everywhere else, colors are set with Tailwind arbitrary-value classes, e.g. `text-[#1A1410]`.

## How to verify a color change is safe

1. Confirm the hex/class isn't in the "Forbidden colors" list above.
2. Confirm it has enough contrast on `#F5F0E8`/`#FFFFFF` backgrounds (target: readable for
   senior citizens — err on the side of darker, more saturated tones).
3. Run `pnpm --filter @workspace/revenex build` and confirm zero errors.
