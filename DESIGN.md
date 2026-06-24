# Design

## Visual Theme
The blog uses a clean, modern card-based theme with responsive layout, supporting light and dark modes.

## Color Palette
Colors are dynamic and based on OKLCH values defined dynamically using CSS variables:
* Primary Color: `var(--primary)`
* Card Background: `var(--card-bg)`
* Button Regular Background: `var(--btn-regular-bg)`
* Button Content: `var(--btn-content)`
* Divider: `var(--meta-divider)`
* Text Colors:
  * Primary Text (90%): `text-90` (e.g., `text-black/90` or `text-white/90`)
  * Secondary Text (75%): `text-75` (e.g., `text-black/75` or `text-white/75`)
  * Muted Text (50%): `text-50`
  * Disabled Text (30%): `text-30`

## Typography
* Sans-Serif Font: `Roboto` (used for body, labels, prose)
* Display Font: `Outfit` (used for large headers and titles)
* Font weights: light, normal, medium, bold

## Layout & Border Radius
* Large Rounded Radius: `rounded-[var(--radius-large)]` (generally 12px or 16px)
* Base Card Class: `.card-base`
* Shadows: `.card-shadow`
