# Project Guide

## Product and stack

- This repository is the 4LIFE accommodation booking frontend.
- Use the existing React 18, TypeScript, Vite, React Router 6, Redux Toolkit, Material UI 5, and SCSS Modules stack.
- Keep UI consistent with the existing MUI theme in `src/assets/theme/`, shared styles in `src/components/GlobalStyles/`, and established page/component patterns.
- Do not introduce a UI framework, icon package, state library, or styling system without a concrete need and explicit approval.
- User-facing copy is currently mostly English. Preserve its meaning and language unless the task asks for copy changes.

## Before changing code

- Read the closest route/component, its styles, callers, and relevant theme definitions first.
- Check `src/App.tsx` for route ownership and `src/store/` for state/API conventions before changing flows.
- Check `package.json` and the lockfile before using a dependency or API. Do not assume a package is installed.
- Keep changes within the requested scope. Do not silently alter route paths, authentication, booking/payment behavior, API contracts, tracking-relevant labels, or user-visible factual claims.

## UI/UX work

- For frontend design, redesign, or UI polish, follow the user's `clean-code`, `impeccable`, and `design-taste-frontend` skill instructions when invoked. Read their relevant project workflow before editing UI.
- For a new visual world or full redesign, audit the incumbent screens, theme, assets, routes, and responsive behavior first. Preserve product truth and working behavior while replacing only the approved visual system.
- If Impeccable reports that `PRODUCT.md` is missing, capture confirmed product context before creating a replacement visual world. Do not invent audiences, differentiators, testimonials, metrics, legal claims, brand commitments, or image provenance.
- Resolve the design direction before implementing it. State the design read and reasoned `DESIGN_VARIANCE`, `MOTION_INTENSITY`, and `VISUAL_DENSITY`; use Impeccable's prescribed direction-selection process for a replacement visual identity.
- Keep the existing MUI 5 and SCSS Modules architecture unless the user explicitly approves a stack change. Check `package.json` before using any additional package; do not add dependencies as a styling shortcut.
- Inspect the finished UI at desktop and mobile sizes, check keyboard/focus, contrast, loading/empty/error states, and reduced motion, and run the Impeccable detector once on changed UI files as its workflow requires.

## Implementation

- Keep TypeScript types explicit at boundaries; avoid `any` and unsafe casts when a real type can be expressed.
- Put page-specific styles in that page's SCSS module. Put reusable behavior in its owning component or existing shared layer; avoid growing generic `utils` or `common` folders.
- Prefer existing MUI components and theme tokens over one-off global styles. Avoid mixing styling systems.
- Keep components focused. Separate presentation, state/API orchestration, and domain decisions when they have distinct responsibilities.
- Preserve existing behavior and accessibility: semantic elements, labels, keyboard operation, visible focus, descriptive image alt text, and clear loading/empty/error states.
- Responsive layouts must be checked at narrow and wide viewports. Do not rely on desktop-only hover behavior.
- Use the existing icon family, `@mui/icons-material`. Do not draw icon SVG paths by hand.
- Do not add animation or visual decoration without a clear usability or communication purpose. Respect reduced-motion preferences for nonessential motion.
- Never commit secrets, credentials, or personal data. Validate untrusted input and retain useful error context.

## Verification and handoff

- Run the narrowest relevant project check when asked to verify or when the change warrants it. Available commands: `npm run build`, `npm run lint`, and `npm test`.
- Do not claim a check passed unless it was run. Report checks not run and relevant remaining risks.
- Review the final diff for scope, unintended behavior changes, accessibility regressions, and unused code.
