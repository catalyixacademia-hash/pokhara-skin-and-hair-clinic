---
name: Clinical Serenity
colors:
  surface: '#f9f9fc'
  surface-dim: '#dadadc'
  surface-bright: '#f9f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f6'
  surface-container: '#eeeef0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e5'
  on-surface: '#1a1c1e'
  on-surface-variant: '#3e4947'
  inverse-surface: '#2f3133'
  inverse-on-surface: '#f0f0f3'
  outline: '#6e7977'
  outline-variant: '#bdc9c6'
  surface-tint: '#006a60'
  primary: '#005f56'
  on-primary: '#ffffff'
  primary-container: '#0d7a6f'
  on-primary-container: '#acfff2'
  inverse-primary: '#7dd6c9'
  secondary: '#765842'
  on-secondary: '#ffffff'
  secondary-container: '#fed5b9'
  on-secondary-container: '#795a45'
  tertiary: '#555553'
  on-tertiary: '#ffffff'
  tertiary-container: '#6d6d6c'
  on-tertiary-container: '#f2f0ee'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#99f3e5'
  primary-fixed-dim: '#7dd6c9'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005048'
  secondary-fixed: '#ffdcc5'
  secondary-fixed-dim: '#e6bfa4'
  on-secondary-fixed: '#2b1606'
  on-secondary-fixed-variant: '#5c412d'
  tertiary-fixed: '#e4e2e0'
  tertiary-fixed-dim: '#c8c6c4'
  on-tertiary-fixed: '#1b1c1b'
  on-tertiary-fixed-variant: '#464746'
  background: '#f9f9fc'
  on-background: '#1a1c1e'
  surface-variant: '#e2e2e5'
typography:
  headline-xl:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  max-width: 1280px
---

## Brand & Style

This design system is built for a premium dermatology and hair restoration environment. The brand personality is **clinical yet welcoming**, prioritizing a sense of hygiene, expertise, and personalized care. It targets a sophisticated audience seeking medical-grade results in a tranquil, spa-like atmosphere.

The visual style is a blend of **Modern Corporate** and **Soft Minimalism**. It utilizes high-quality imagery, generous negative space, and subtle organic textures (like wood and marble) to bridge the gap between clinical precision and human comfort. The emotional response should be one of immediate trust, calm, and the reassurance of being in professional hands.

## Colors

The palette is derived directly from the clinic’s physical environment:
- **Primary (Teal/Green):** A deep, professional teal that signals healthcare reliability and vitality.
- **Secondary (Warm Wood):** A sophisticated timber-inspired brown used for accents, signaling warmth and organic nature.
- **Surface (Soft White/Cream):** A warm-toned white used for backgrounds to avoid the "starkness" of hospital white while maintaining cleanliness.
- **Neutral (Charcoal):** Used for primary text and high-contrast elements to ensure maximum legibility and authority.
- **Status Colors:** Use muted versions of standard status colors (Success: Soft Green, Warning: Muted Gold, Error: Soft Terracotta) to remain consistent with the serene aesthetic.

## Typography

The typography system uses two distinct sans-serifs to balance modernity with readability. 

**Manrope** is used for headlines. Its geometric yet slightly soft curves provide a modern, high-end medical feel. Headlines should use tight letter spacing and bold weights to command attention.

**Work Sans** is used for body text and labels. Its professional, grounded nature ensures that clinical information, treatment descriptions, and appointment details are highly legible across all devices. For labels and small UI elements, use all-caps with increased letter spacing to create a clean, organized hierarchy.

## Layout & Spacing

The design system utilizes a **Fixed Grid** model on desktop to maintain an editorial, high-end feel, while transitioning to a **Fluid Grid** on mobile.

- **Desktop:** 12-column grid with a 1280px maximum container width. Use 24px gutters.
- **Tablet:** 8-column grid with 24px margins.
- **Mobile:** 4-column grid with 16px margins.

Spacing follows an 8px base unit. For sections involving medical services or "before and after" galleries, increase vertical padding (64px to 120px) to allow the content to breathe, emphasizing the "premium" nature of the clinic. Reflow rules should prioritize stacked vertical layouts for treatment cards on mobile.

## Elevation & Depth

To mirror the clean glass and marble surfaces of the clinic, this design system uses **Tonal Layers** combined with **Ambient Shadows**.

1.  **Base Layer:** The soft white background (`#F9F7F5`).
2.  **Surface Layer:** Cards and containers use a pure white background with a very subtle, light-gray stroke (1px, 5% opacity charcoal).
3.  **Elevation:** Use "Atmospheric Shadows"—extra-diffused, low-opacity shadows (e.g., `box-shadow: 0 10px 30px rgba(13, 122, 111, 0.05)`). The shadow color should have a tiny hint of the primary teal to feel integrated.
4.  **Glassmorphism:** Use semi-transparent white backgrounds (80% opacity) with a 12px backdrop blur for navigation bars and floating appointment widgets to maintain a sense of lightness and depth.

## Shapes

The shape language is **Rounded**, reflecting the soft edges of modern clinic furniture and a "human-centric" approach to medicine.

- **Standard Elements:** Buttons, input fields, and small cards use a 0.5rem (8px) radius.
- **Containers:** Large feature sections or treatment cards use a 1rem (16px) radius.
- **Interactive Accents:** Small accent elements, like "New" badges or category chips, can use pill-shaped (full-round) corners to contrast with the more structured containers.

## Components

- **Buttons:** Primary buttons use the Teal background with White text. Secondary buttons should use a Wood-tone stroke or text. Transitions should be soft and slow (250ms).
- **Cards:** Use marble-like subtle textures or clean white backgrounds. Treatment cards should include high-quality imagery with a slight zoom effect on hover.
- **Input Fields:** Minimalist design with a bottom-border focus state in Teal. Error states should be subtle, using a muted red to avoid causing patient anxiety.
- **Chips:** Used for medical categories (e.g., "Dermatology," "Transplant"). Use the secondary wood-tone in a low-opacity tint for the background to keep them distinct from primary actions.
- **Lists:** Clinical details (hours, location) should be presented in clean, well-spaced lists with custom icons in the primary teal color.
- **Appointment Widget:** A sticky or floating component with a glassmorphic background that makes "Book Now" always accessible without being intrusive.