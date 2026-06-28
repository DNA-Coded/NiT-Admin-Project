---
name: Institutional Excellence
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#444650'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#757681'
  outline-variant: '#c5c6d1'
  surface-tint: '#485c97'
  primary: '#263b74'
  on-primary: '#ffffff'
  primary-container: '#3f538d'
  on-primary-container: '#bac9ff'
  inverse-primary: '#b4c5ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#393f45'
  on-tertiary: '#ffffff'
  tertiary-container: '#50565d'
  on-tertiary-container: '#c5cbd3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#30447d'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#dde3eb'
  tertiary-fixed-dim: '#c1c7cf'
  on-tertiary-fixed: '#161c22'
  on-tertiary-fixed-variant: '#41474e'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max-width: 1440px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
  sidebar-width: 280px
---

## Brand & Style

This design system is engineered for high-utility enterprise environments, specifically targeting academic administration. The brand personality is rooted in reliability, authority, and clarity. It avoids decorative flourishes in favor of a "System-as-a-Service" aesthetic that prioritizes information density and task completion.

The visual style follows a **Corporate / Modern** approach with a lean toward **Minimalism**. It utilizes a structured hierarchy, ample white space for cognitive breathing room, and a restricted color palette to ensure that administrative staff can navigate complex attendance data without fatigue. The emotional response should be one of confidence, stability, and professional focus.

## Colors

The palette is anchored by a deep institutional blue (`#3F538D`), signifying trust and departmental authority. This primary color is reserved for high-priority actions, sidebar navigation backgrounds, and active state indicators. 

The neutral scale is carefully tiered to provide clear contrast between content levels. Primary text uses a near-black slate for maximum legibility, while secondary text uses a muted gray-blue to de-emphasize metadata. Semantic colors (Success, Warning, Error) are used sparingly but purposefully to flag attendance discrepancies or system alerts, ensuring they remain highly visible against the clean, light-gray canvas.

## Typography

Typography is optimized for legibility and data scanning. **Plus Jakarta Sans** is used for headlines to provide a modern, clean, and professional character. For all functional text, body copy, and data tables, **Inter** is utilized for its exceptional x-height and neutral, utilitarian clarity.

Large font sizes are prioritized to meet accessibility standards for staff members. We use a 16px base for body text to ensure comfortable long-form reading of reports. Labels for table headers and metadata utilize a slightly smaller, medium-weight Inter font with subtle letter spacing to distinguish structural information from user data.

## Layout & Spacing

The design system employs a **Fixed Grid** model for desktop, centered within a maximum container width of 1440px. The core navigation is anchored by a persistent left-hand sidebar (280px), allowing the main content area to remain focused on data-heavy tables and dashboards.

A strict 8px spacing scale governs all margins and padding, ensuring mathematical harmony across the interface. 
- **Desktop:** 12-column grid with 24px gutters.
- **Tablet:** 8-column grid with 16px gutters; sidebar collapses into a hamburger menu.
- **Mobile:** Single column layout with 16px side margins; data tables should transition to card-based views for readability.

## Elevation & Depth

To maintain a clean, institutional feel, this design system avoids heavy shadows. Depth is primarily established through **Tonal Layers** and **Low-Contrast Outlines**.

The background canvas is set at a subtle off-white (`#F8FAFC`), while interactive components like cards and input fields sit on pure white (`#FFFFFF`) surfaces. These surfaces are defined by a 1px solid border in `#E2E8F0`. Shadows are reserved exclusively for "floating" elements like dropdown menus, modals, and tooltips, using a single, highly-diffused, soft-gray shadow (0px 4px 20px rgba(30, 41, 59, 0.08)) to indicate temporary elevation above the main work surface.

## Shapes

The shape language is **Soft**, utilizing a consistent 0.25rem (4px) base radius. This provides a professional and modern look that is less aggressive than sharp corners, yet remains disciplined and "serious" enough for a college administrative environment. Large containers and cards may use `rounded-lg` (8px) to soften the overall layout of the dashboard.

## Components

### Buttons
- **Primary:** Solid `#3F538D` background with white text. 4px border radius.
- **Secondary:** White background with `#3F538D` border and text.
- **Tertiary/Ghost:** No background or border; text color matches secondary text until hover.

### Data Tables
Tables are the core of the system. Use a clean, row-based layout with 1px horizontal dividers. Header rows should have a subtle gray background (`#F1F5F9`) and use `label-md` typography. Zebra-striping is discouraged to keep the UI clean; use hover states on rows to assist tracking.

### Cards
Cards are used for high-level statistics (e.g., "Total Staff Present"). They feature a white background, a 1px border, and no shadow. Titles within cards should follow `headline-md`.

### Input Fields & Selects
Inputs use a white background with a `#E2E8F0` border. On focus, the border transitions to the primary blue (`#3F538D`) with a 2px outer glow (ring) of the same color at 20% opacity.

### Attendance Chips
Small, rounded-pill indicators for status:
- **Present:** Light green background with dark green text.
- **Absent:** Light red background with dark red text.
- **Late:** Light amber background with dark amber text.

### Sidebar Navigation
The sidebar should be dark-themed using the Primary Color as the base. Navigation links use a semi-transparent white text, becoming fully opaque with a solid left-edge "accent bar" when active.