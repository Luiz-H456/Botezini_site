# Design System Document

## 1. Overview & Creative North Star

### The Creative North Star: "The Architectural Atelier"
This design system is not merely a collection of components; it is a digital manifestation of craftsmanship. Inspired by high-end tailoring and architectural precision, the system moves away from the "boxed-in" nature of the standard web. We favor expansive layouts, intentional asymmetry, and a tonal depth that mimics a physical, darkened gallery space.

The goal is to evoke a sense of **Utilitarian Elegance**. The interface must feel as precise as a technical drawing but as luxurious as a bespoke suit. We achieve this by breaking the grid with oversized editorial typography and replacing rigid structural lines with sophisticated tonal layering.

---

## 2. Colors

The palette is rooted in deep obsidian tones, punctuated by the warmth of architectural gold. 

### Surface Hierarchy & Nesting
To create a premium "layered" feel, we abandon flat backgrounds. We use a "Dark Room" approach where depth is defined by how light interacts with surfaces.
- **Surface (#131313):** The base floor.
- **Surface-Container-Lowest (#0E0E0E):** Used for "sunken" areas or background sections that should feel further away.
- **Surface-Container-High (#2A2A2A):** Used for active cards or interactive elements to bring them "forward" toward the user.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to separate sections. Boundary definition must be achieved through:
1.  **Background Shifts:** Transitioning from `surface` to `surface-container-low`.
2.  **Radial Gradients:** Using subtle, large-scale radial gradients (Primary to Transparent) in the background to highlight specific content clusters.
3.  **Whitespace:** Leveraging the spacing scale to create "breathing rooms" that naturally group items.

### The "Glass & Gradient" Rule
For floating menus or high-end overlays, utilize a **Glassmorphism** effect:
- **Background:** `surface` at 60% opacity.
- **Backdrop-filter:** `blur(20px)`.
- **Inner Glow:** A 1px top-stroke using `outline-variant` at 15% opacity to catch the "light."

---

## 3. Typography

The typographic system is a dialogue between the classicism of the serif and the technical precision of the sans-serif.

| Level | Token | Font Family | Character |
| :--- | :--- | :--- | :--- |
| **Display** | `display-lg/md` | Playfair Display | High-contrast, monumental, used for hero statements. |
| **Headline** | `headline-lg/md` | Newsreader* | Sophisticated, editorial, for section starts. |
| **Title** | `title-lg/md` | Montserrat | Technical, uppercase, wide tracking (0.1em) for labels. |
| **Body** | `body-lg/md` | Cormorant Garamond | The "Human" voice. Used for storytelling and descriptions. |
| **Label** | `label-sm` | Montserrat | Pure utility. High readability for technical specs. |

*\*Note: While the brand manual suggests Newsreader/WorkSans, for the digital execution of this system, we prioritize Playfair for prestige and Montserrat for UI durability.*

---

## 4. Elevation & Depth

### The Layering Principle
Hierarchy is communicated through **Tonal Layering** rather than drop shadows.
- **Level 0 (Base):** `surface`
- **Level 1 (Section):** `surface-container-low`
- **Level 2 (Card):** `surface-container-high`

### Ambient Shadows
When an element must float (e.g., a primary modal), use "Architectural Light":
- **Shadow:** `0px 24px 48px rgba(0, 0, 0, 0.5)`
- **Tint:** The shadow should not be neutral grey; it should feel like a deep obsidian void.

### The "Ghost Border" Fallback
If an element requires a container but a background shift is too heavy, use a **Ghost Border**:
- **Value:** `1px solid`
- **Color:** `outline-variant` at 15% opacity.
- **Role:** This is purely for accessibility in dense data environments.

---

## 5. Components

### Buttons: The "Gold Standard"
- **Primary:** Background `primary-container` (#C9A84C), Text `on-primary` (#3D2E00). **Shape:** Strict 0px radius (Sharp edges).
- **Secondary:** Transparent background, `primary` text, 1px "Ghost Border" (`primary` at 30%).
- **Interaction:** On hover, primary buttons should utilize a subtle radial flare from the cursor position.

### Input Fields: The "Underlined" Aesthetic
- To maintain the architectural feel, use "Minimalist Inputs." 
- **Style:** No background fill. Only a bottom border using `outline`. 
- **Focus State:** Bottom border transitions to `primary` (Gold) with a subtle 4px blur glow beneath the line.

### Cards & Lists: The Spatial Rule
- **Forbidden:** Horizontal divider lines between list items.
- **Solution:** Increase the `vertical-padding` using the `spacing-6` (2rem) token. Use a `surface-container-highest` background on hover to indicate interactivity.

### Signature Component: The "Editorial Stat"
- Used for high-level data (e.g., "100% Personalização"). 
- **Style:** Large `display-md` serif number in `primary` gold, paired with a small `label-md` Montserrat caption in `secondary`. No container.

---

## 6. Do's and Don'ts

### Do
- **DO** use intentional asymmetry. Align text to the left but place imagery offset to the right to create visual tension.
- **DO** use monochromatic photography with high contrast. Gold accents should only appear in the UI, not within the raw photography unless it is the product itself.
- **DO** use sharp corners (0px radius) for everything. Roundedness is the enemy of this system's architectural rigor.

### Don't
- **DON'T** use standard "drop shadows" that look like blurry clouds. Use tonal shifts.
- **DON'T** use 100% white for body text. Use `off-white` (#F5F0E8) or `on-surface-variant` to reduce eye strain against the deep black background.
- **DON'T** crowd the layout. If a section feels "full," increase the spacing scale by one increment. Luxury is defined by wasted space.

### Accessibility Note
While the system is high-contrast and dark, ensure that all `primary` gold text on `surface` backgrounds maintains a 4.5:1 ratio for readability. Use `primary-fixed-dim` for smaller gold text to ensure legibility.