---
name: 4LIFE
description: A clear, map-led accommodation discovery experience.
colors:
  primary: "#2f7668"
  primary-deep: "#245f54"
  ink: "#172b3a"
  muted-ink: "#586970"
  paper: "#f7f8f5"
  surface: "#ffffff"
  field: "#fcfdfa"
  border: "#dce3dd"
  map-surface: "#e9f0e8"
  terracotta: "#d36b4a"
typography:
  display:
    fontFamily: "K2D, sans-serif"
    fontSize: "clamp(34px, 4.2vw, 58px)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.045em"
  body:
    fontFamily: "K2D, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  control: "10px"
  card: "14px"
  panel: "15px"
  media: "16px"
  pill: "999px"
spacing:
  compact: "10px"
  section: "48px"
components:
  primary-action:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
---

# Design System: 4LIFE

## Overview

**Creative North Star: “Atlas khu phố”**

4LIFE presents accommodation discovery like a legible neighborhood atlas: practical information stays in the foreground, while the map gives each place a useful geographic context. The surface is calm and light, with deep blue-green text, leaf-green actions, and restrained terracotta reserved for focus details. The existing 4LIFE name and logo remain recognizable anchors.

The interface favors quick scanning and direct manipulation over decorative effects. Maps, prices, dates, and place cards should feel connected and navigable. On a listing detail page, photography leads into the property facts, description, pricing action, amenities, reviews, and location in that order. Keep motion short and purposeful, primarily to confirm hover, focus, or selection.

**Key Characteristics:**
- Light paper-like canvas with clear white work surfaces.
- Deep teal-green actions and dark blue-green text.
- Search and results are organized around location and map context.
- Moderate information density with clear spacing between tasks.

## Colors

The palette pairs botanical green with cool, readable ink and softly tinted map surfaces.

### Primary
- **Neighborhood Green** (#2f7668): Primary actions, selected map markers, and active navigation.
- **Deep Canopy** (#245f54): Hover and pressed states for primary actions.

### Neutral
- **Harbor Ink** (#172b3a): Main headings and high-priority text.
- **Slate Current** (#586970): Supporting text and secondary labels.
- **Paper Ground** (#f7f8f5): Main discovery page background.
- **White Surface** (#ffffff): Cards and search panel.
- **Soft Field** (#fcfdfa): Input backgrounds.
- **Map Sage** (#e9f0e8): Map panel surface.
- **Mist Border** (#dce3dd): Panel, input, and card boundaries.

### Tertiary
- **Terracotta Signal** (#d36b4a): Focus ring and selected-state contrast detail; use sparingly.

### Named Rules
**The Map-First Context Rule.** Location and spatial context should clarify results, never obscure their names, prices, or actions.

**The Action Green Rule.** Reserve Neighborhood Green for actions and active states so affordances remain easy to spot.

## Typography

**Display Font:** K2D (with sans-serif fallback)
**Body Font:** K2D (with sans-serif fallback)

**Character:** Friendly geometric sans-serif with heavier, compact headings and readable supporting copy. Existing MUI theme tokens also define Roboto; prefer the actual surface font where its SCSS explicitly sets K2D.

### Hierarchy
- **Display** (700, `clamp(34px, 4.2vw, 58px)`, 1.05): Main page title.
- **Headline** (700, `clamp(22px, 2.3vw, 30px)`): Results and section headings.
- **Body** (400, 15px, 1.65): Introductory and explanatory copy.
- **Label** (500–700, 10–14px): Form labels, map metadata, and compact status text.

## Layout

Use a centered content region up to 1440px wide. Search controls form a four-column row on wide screens. Results use a two-column split: accommodation cards and a sticky map panel. At narrower widths, collapse search fields and results to a single column; the map becomes an explicit mobile view. Keep the map hidden until requested on small screens. Use generous section separation (48px) and compact 10–14px group spacing.

## Elevation & Depth

Depth stays restrained. Borders establish surface boundaries; subtle offset shadows lift the search panel and show card hover. Avoid persistent heavy elevation. Selection and focus should remain legible without relying on shadow alone.

### Shadow Vocabulary
- **Search panel** (`0 7px 20px rgb(23 43 58 / 5%)`): Quiet separation from the page ground.
- **Card hover** (`0 8px 20px rgb(23 43 58 / 7%)`): Feedback that a listing is interactive.

**The Quiet Rest Rule.** Cards sit nearly flat until interaction; keep strong shadows for transient feedback.

## Shapes

Use gently rounded rectangles for search panels and listing cards (14–15px), slightly tighter corners for inputs (10px), and full pills for compact actions. Borders are thin and cool green-gray. Circular shapes belong to small icon holders and favorite controls.

## Components

### Buttons
- **Primary:** Neighborhood Green fill, white text, pill shape in the shared header; hover shifts to Deep Canopy.
- **Secondary:** Green text and a light outline; hover gains a soft green surface.
- **Focus:** Visible high-contrast outline in Terracotta Signal on map markers and keyboard-focused controls.

### Cards / Containers
- **Accommodation card:** White surface, 14px corners, Mist Border at rest; subtle shadow on hover.
- **Search panel:** White surface, thin border, 15px corners, low ambient shadow.
- **Map panel:** Soft green surface with an inset map canvas and price markers.
- **Booking summary:** Compact white bordered panel aligned to the right on wider screens and expanded to full width on mobile.

### Inputs / Fields
- Outlined MUI fields with a near-white fill, 10px corners, and 54px minimum height. Focus strengthens the Neighborhood Green border.

### Navigation
- Shared header uses a pale paper surface, fine bottom border, and green active state. Keep links on one line at desktop and preserve touchable spacing on mobile.

### Map Price Markers
- White price markers use dark ink, thin border, and soft lift. Selected markers switch to Neighborhood Green with white text. Marker labels include the accommodation and nightly price for assistive technology.

### Detail Gallery
- The primary image receives the largest area; supporting images form a smaller adjacent grid. On narrow screens, the gallery stacks and reduces image height without cropping the page into a two-column layout.

## Do's and Don'ts

### Do:
- **Do** preserve the 4LIFE name and logo.
- **Do** keep location, dates, stay type, results, and map context easy to scan together.
- **Do** show loading, error, empty, focus, and selected states with useful text and contrast.
- **Do** keep the mobile map behind an explicit, labeled toggle.

### Don't:
- **Don't** invent reviews, availability, amenities, prices, policies, or performance claims.
- **Don't** use color alone to communicate focus, errors, or selection.
- **Don't** let the map crowd out the accommodation cards or booking information.
- **Don't** add new dependencies or replace MUI/SCSS Modules for styling convenience.
