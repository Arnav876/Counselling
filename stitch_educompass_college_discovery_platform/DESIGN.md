---
name: Academic Discovery Interface
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002114'
  on-tertiary-container: '#069669'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#85f8c4'
  tertiary-fixed-dim: '#68dba9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: 3.5rem
    letterSpacing: -0.025em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: 1.5rem
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
  body-md:
    fontFamily: Inter
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-sm:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
  label-lg:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 0.875rem
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system embodies an authoritative, modern, and accessible approach to educational discovery, academic benchmarking, and institutional search. Designed for prospective students, parents, and academic counselors, the interface delivers credibility and clarity through every touchpoint.

The aesthetic fuses **Corporate / Modern** precision with modern SaaS hospitality:
- **Clean and Institutional Trust:** Generous whitespace, precise data alignments, and structural balance project credibility without feeling bureaucratic or antiquated.
- **Empowering and Dynamic:** Vibrant blue accents and optimistic green validation markers alleviate the anxiety associated with college selection, admissions, and financial planning.
- **High-Density Legibility:** Complex multi-attribute information—such as entrance exam cutoffs, tuition matrices, campus infrastructure, and placement statistics—is rendered scannable through clean hierarchy and layered surfaces.

## Colors

The palette establishes institutional authority balanced by active navigational clarity and positive outcome cues:

- **Primary (`#0F172A` - Slate Navy):** Represents authority, institutional stability, and grounding. Used for primary headlines, critical brand framing, core navigation bars, and primary CTAs.
- **Secondary (`#2563EB` - Royal Academic Blue):** Drives visual energy and forward momentum. Applied to interactive elements, primary links, focus rings, active filter chips, and progress indicators.
- **Tertiary (`#059669` - Emerald):** Reserved strictly for qualitative positive metrics—NIRF ranks, verified badges, high-yield placement rates, accreditation seals, and positive score differentials.
- **Neutral Palette (`#020617` to `#F8FAFC`):**
  - **Canvas Background:** `#F8FAFC` (Slate 50) offers a soft, glare-free backdrop that frames content.
  - **Surface Container:** `#FFFFFF` creates crisp, defined card blocks.
  - **Muted Text / Metadata:** `#64748B` (Slate 500) ensures accessible, balanced scannability without visual noise.
  - **Borders & Dividers:** `#E2E8F0` (Slate 200) sets crisp, low-contrast structural boundaries.

## Typography

The type system blends the architectural geometric warmth of **Plus Jakarta Sans** for headlines with the functional precision of **Inter** for tabular data, long-form content, and navigational UI.

- **Headlines & Titles:** Set in Plus Jakarta Sans with subtle negative tracking (`-0.01em` to `-0.025em`) to produce a confident, premium editorial feel across university profiles and comparison dashboards.
- **Body & Tabular Readability:** Set in Inter with generous line-heights for comfortable consumption of complex course requirements, fee schedules, and admission guidelines.
- **Labels & Micro-data:** Strict uppercase tracking is applied only to `label-sm` for verification tags, percentile cutoffs, and status indicators.

## Layout & Spacing

The layout is built around a mobile-first, responsive 12-column grid system designed to support dense comparison matrices and expansive editorial listings.

- **Breakpoints & Layout:**
  - **Mobile (< 768px):** 4-column layout with `1rem` outer margins and `1rem` gutters. Search filters, sort controls, and comparative bars condense into sticky mobile sheets and persistent bottom-anchored action bars.
  - **Tablet (768px - 1023px):** 8-column layout with `1.5rem` margins and gutters. Sidebars fold into collapsible off-canvas overlays.
  - **Desktop (1024px+):** 12-column fixed-max layout (max-width `1280px` or `1440px` for wide dashboards) with `2rem` margins and `1.5rem` gutters. Accommodates standard 3-column facet layouts: sticky filter rail (3 cols), primary directory feed (6 cols), and spotlight/lead generation modules (3 cols).
- **Rhythm & Spacing Scale:** Built upon a 4px/8px incremental rhythm (`space-xs` = 4px, `space-sm` = 8px, `space-md` = 16px, `space-lg` = 24px, `space-xl` = 32px) to ensure rigorous structural alignment across forms, card contents, and data tables.

## Elevation & Depth

Depth is established via fine-line separation and ambient, slate-tinted micro-shadows that keep surfaces light and clinical.

- **Surface Tiers:**
  - **Base Canvas:** `#F8FAFC` provides the foundational layer.
  - **Resting Cards:** Pure white (`#FFFFFF`) framed by a subtle hairline border (`1px solid #E2E8F0`).
  - **Micro-Shadow Base (`elevation-low`):** `0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)`. Used for passive directory cards and search inputs.
  - **Interactive Hover (`elevation-mid`):** `0 10px 15px -3px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.04)` combined with a 1px border shift to `#CBD5E1`. Used when hovering college profile cards and course comparison rows.
  - **Overlays & Floating Modals (`elevation-high`):** `0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`. Used for filter drawers, lead capture modals, and sticky discovery headers.
- **Glass Accents:** Sticky category selectors and header bars use frosted transparency (`rgba(255, 255, 255, 0.85)` with `backdrop-filter: blur(12px)`) to maintain orientation while scrolling through large directory lists.

## Shapes

The interface balances welcoming accessibility with functional precision:

- **Cards & Major Containers:** `rounded-2xl` (1rem to 1.5rem) softens large visual blocks, college media banners, and comparative panels.
- **Inputs & Interactive Controls:** Standardized to `0.5rem` (`rounded-lg`) to maintain crisp, tactile boundaries for high-density forms and filters.
- **Badges, Tags, & Status Pills:** Configured as fully rounded pills (`9999px`) to distinguish categorical metadata and accreditation stamps from actionable rectangular buttons.

## Components

### Buttons
- **Primary:** Background `#0F172A`, text `#FFFFFF`, rounded to `0.5rem`. States: hover `#1E293B`, active `#020617`, focus ring `2px solid #2563EB` with `2px` offset.
- **Secondary (Action Accent):** Background `#2563EB`, text `#FFFFFF`. Used for high-intent conversion hooks ("Apply Now", "Download Brochure"). Hover `#1D4ED8`.
- **Outline / Ghost:** Border `1px solid #E2E8F0`, background transparent, text `#0F172A`. Hover background `#F1F5F9`.
- **Sizes:** Large (48px height, `label-lg`), Medium (40px height, `label-md`), Small (32px height, `label-sm`).

### Input Fields & Search Bars
- **Global Search:** Prominent 52px height container, `#FFFFFF` fill, 1px border `#E2E8F0`, subtle shadow. Houses nested location/stream filter chips, search icon in `#64748B`, and a secondary action button.
- **Form Fields:** 42px height, 1px border `#CBD5E1`, border-radius `0.5rem`. On focus: border shifts to `#2563EB` with a `0 0 0 3px rgba(37, 99, 235, 0.12)` halo. Floating or pinned `label-md` in `#334155`.

### Chips & Filter Pills
- **Filter Chips:** 32px height, background `#F8FAFC`, border `1px solid #E2E8F0`, text `#475569`. 
- **Selected State:** Background `rgba(37, 99, 235, 0.08)`, border `1px solid #2563EB`, text `#2563EB`, accompanied by a clearable trailing "x" icon.

### Cards (Institutional Discovery)
- **Structure:** Encased in `rounded-2xl` containers, `#FFFFFF` background, 1px `#E2E8F0` border.
- **Header:** 16:9 or 21:9 image container with a subtle bottom gradient overlay housing accreditation pills and NIRF rank pins.
- **Body:** Institution title (`headline-md`), location pin with `#64748B` typography, structured metric bar (Tuition, Highest Package, Exam Accepted) delineated by vertical hairline dividers.
- **Footer:** Two-action zone: "Compare" checkbox on the left, "View Details" and "Apply" buttons on the right.

### Checkboxes & Radio Controls
- **Checkboxes:** 18px box, `rounded` (4px), 1.5px border `#CBD5E1`. Checked: `#2563EB` background with white check icon.
- **Radio Buttons:** 18px circle, 1.5px border `#CBD5E1`. Selected: `#2563EB` outer boundary with a 6px solid `#2563EB` concentric dot centered on white.

### Metric Badges & Score Cards
- **Rating / Rank Pill:** `#059669` background with white text or subtle green wash (`#ECFDF5`) with `#047857` text. Displays verified reviews and ranking stats.
- **Key-Value Data Grids:** Compact two-line stacks with `label-sm` in `#64748B` on top and `title-sm` in `#0F172A` underneath.

### Comparison Bar (Floating)
- Fixed bottom dock (`rounded-xl` or full-bleed mobile bar), elevated via `elevation-high`, displaying up to 4 selected college avatars, comparison progress, and a prominent "Compare Institutions" CTA.