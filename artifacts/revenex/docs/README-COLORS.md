# Colors & Design Theme Documentation

## Purpose
Establishes the design guidelines and color palette for the premium, restrained warm-beige design language of the website.

## Source of Truth
- Global Styles: [index.css](file:///c:/VS%20Code/Revenex/artifacts/revenex/src/index.css)
- Theme colors are implemented as global custom variables or Tailwind utilities.

---

## Color Palette Configuration

| Element | HSL / Hex Code | CSS Class / Context |
| :--- | :--- | :--- |
| **Page Background** | `#F5F0E8` (warm beige) | Root page body, background |
| **Section Alt Background**| `#EDE8DC` (deeper beige) | Alternating section sections |
| **Card Background** | `#FFFFFF` (pure white) | Content cards, grid items |
| **Text - Heading** | `#1A1410` (warm near-black brown) | Titles, headings, strong text |
| **Text - Body** | `#3D3128` (readable dark brown) | Paragraphs, lists, standard copy |
| **Text - Muted** | `#6B5D52` (medium warm brown) | Subtitles, labels, helpers |
| **Accent Primary** | `#8B4513` (saddle brown) | Links, bullets, active status |
| **Accent Light** | `#C4722A` (orange-brown) | Gradients, hovered elements |
| **Glass border** | `#E8E0D4` (medium light brown) | Card borders, dropdown boundaries |

---

## Styling Constraints & Rules

1.  **Restraint**: Do not introduce vibrant default colors. Avoid plain blue, green, red, or teal unless specified in custom states (e.g. green for positive metrics, red for error alerts).
2.  **No Pure Blacks**: Never use `#000000` or class `text-black`. Use the warm near-black `#1A1410` instead to preserve the luxury print aesthetic.
3.  **Accent Gradients**: Accents use a premium linear gradient:
    - CSS Class: `.gradient-bg`
    - Value: `linear-gradient(135deg, #1A1410 0%, #3D2810 100%)`
    - Highlight variant: `linear-gradient(90deg, #8B4513, #C4722A)`
4.  **Shadows**: Use custom subtle brown shadows rather than default cool gray shadows:
    - Card: `0 4px 20px rgba(139,69,19,0.06)`
    - Hover: `0 16px 48px rgba(139,69,19,0.12)`
    - Elevated: `0 32px 80px rgba(26,20,16,0.4)`
