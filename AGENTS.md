# Agent Guide — 4LIFE Client Web Platform

> This guide provides comprehensive operational, architectural, and design instructions for AI coding agents and engineers working in this repository.

---

## 1. Product Overview & Architecture

### 1.1 Project Purpose
This repository (`PBL6_FE_User`) is the client-facing web application for the **4LIFE Accommodation Booking Platform** (Nền tảng đặt phòng lưu trú 4LIFE). It allows travelers to:
- Discover and compare accommodations visually via an interactive map and list split-view ("Atlas khu phố").
- View detailed listings, room types, pricing, amenities, and authentic guest reviews.
- Book stays, review booking details, and request cancellations per host policy.
- Manage accommodation posts for hosting/renting with live preview capabilities (`/manage-posts`).
- Manage user profiles, avatars, favorites, and receive real-time notifications via SignalR.

### 1.2 Tech Stack
- **Framework & Core**: React 18, TypeScript, Vite.
- **Routing**: React Router DOM v6 with route protection (`createBrowserRouter`).
- **State Management**:
  - Global client state: Redux Toolkit (`@reduxjs/toolkit`) + `redux-persist` (persists auth tokens and user data in `localStorage`).
  - Server state caching & mutation: React Query (`react-query` v3).
  - Real-time events: Server-Sent Events (SSE) managed inside `NotifyProvider` (`src/context/notify.tsx`).
- **UI Components & Styling**:
  - Material UI 5 (`@mui/material`, `@mui/icons-material`, `@mui/x-date-pickers`, Emotion).
  - Page & component-level scoped styling: **SCSS Modules** (`*.module.scss`).
  - Global typography and resets: `src/components/GlobalStyles/`.
- **Form Management**: React Hook Form (`react-hook-form`) + Yup (`@hookform/resolvers/yup`).
- **Maps**: Google Maps API via `@react-google-maps/api` and `google-map-react`.
- **API Client**: Axios (`axiosInstance` and `axiosInstanceFormData`).
- **Mocking & Testing**: Mock Service Worker (`msw`), Jest, React Testing Library.

---

## 2. Directory Structure & Conventions

```text
src/
├── api/          # Axios instances and API endpoint definitions
│   ├── instance.ts             # Base Axios instance, Bearer token interceptor, 401 redirect
│   ├── auth.api.ts             # Auth, Google OAuth, OTP verification
│   ├── accommodation.api.ts    # Accommodations query, detail, CRUD
│   ├── booking.api.ts          # Booking creation, cancellation, details
│   └── ...
├── assets/       # Static assets, images, and MUI theme definitions
│   ├── images/                 # Logo, fallback banners, avatars
│   └── theme/                  # MUI theme overrides (palette, typography, components)
├── components/   # Reusable UI components
│   ├── Auth/                   # ProtectedRoute and ProtectedAuthen wrappers
│   ├── Card/                   # Accommodation card, booking cards
│   ├── Map/                    # Google Maps wrappers, price markers
│   ├── Dialog/                 # Modals, confirmation dialogs, post preview dialog
│   └── ...
├── context/      # React contexts (e.g., notify.tsx for SignalR notifications)
├── hooks/        # React Query hooks (use-rooms-by-location, use-booking, etc.)
├── mocks/        # MSW service worker, handlers, and fixture data for offline/mock mode
├── pages/        # Route page components (Home, Rooms, AccommodationDetail, etc.)
├── store/        # Redux store, authSlice, persistor
├── types/        # TypeScript interfaces and domain models (model/, axios/)
├── utils/        # Helper functions (date formatting, currency formatting, auth helpers)
├── App.tsx       # Route definitions & router configuration
└── main.tsx      # Application entrypoint with providers hierarchy
```

---

## 3. Routes & Access Control

All routes are defined in [`src/App.tsx`](./src/App.tsx):

| Route Path | Protection Wrapper | Description |
|---|---|---|
| `/home`, `/` | Public | Home landing page with search bar and featured locations |
| `/about` | Public | About 4LIFE information page |
| `/rooms` | Public | Search results page with dual card list and interactive map |
| `/rooms/:id` | Public | Accommodation details, image gallery, reviews, and booking widget |
| `/login` | `ProtectedAuthen` | User login (redirects authenticated users away) |
| `/signup` | `ProtectedAuthen` | User registration (redirects authenticated users away) |
| `/forgot-password` | `ProtectedAuthen` | Password recovery via email OTP |
| `/profile` | `ProtectedRoute` | Profile details, avatar upload, password update |
| `/manage-posts` | `ProtectedRoute` | Host post management, listing creation/editing with live preview |
| `/my-bookings` | `ProtectedRoute` | User booking history and status management |
| `/my-bookings/:id` | Public / Contextual | Individual booking confirmation and detail view |
| `/my-favorites` | `ProtectedRoute` | Saved favorite accommodations |

**Rule**: Never silently alter route paths, access guards, or route ownership without explicit user approval.

---

## 4. Data Flow & Networking Rules

### 4.1 Axios Client
- Use `axiosInstance` from `src/api/instance.ts` for standard JSON REST requests.
- Use `axiosInstanceFormData` for multipart file uploads (e.g., accommodation photos, avatar uploads).
- **Authentication**: `axiosInstance` automatically injects `Bearer <token>` from `localStorage.getItem("accessToken")`.
- **401 Response**: The interceptor dispatches `auth/logoutSuccess` to Redux and redirects the user to `/login`.

### 4.2 State Separation
- **Authentication & User Session**: Managed through Redux Toolkit (`src/store/authSlice.ts`).
- **Server Data**: Always use custom hooks in `src/hooks/` wrapping `react-query` queries and mutations. Do not duplicate server data in Redux unless explicitly required.
- **Real-time Notifications**: Subscribed via Server-Sent Events (SSE) in `NotifyProvider` (`src/context/notify.tsx`).

### 4.3 Mock Service Worker (MSW)
- Support offline development and isolated feature testing using `npm run dev:mock`.
- Mock handlers reside in `src/mocks/handlers.ts` using fixture data from `src/mocks/data.ts`.
- When adding or modifying API contracts, update both `src/api/` and `src/mocks/handlers.ts` to keep the mock mode functional.

---

## 5. UI/UX & Design System Guidelines

Follow the specifications defined in [`DESIGN.md`](./DESIGN.md) and [`PRODUCT.md`](./PRODUCT.md):

### 5.1 Design Philosophy: "Atlas khu phố" (Neighborhood Atlas)
- **Primary Color**: Neighborhood Green (`#2f7668`) with hover Deep Canopy (`#245f54`).
- **Typography**: Primary font family is `K2D`, with clean geometric sans-serif fallbacks.
- **Palette Tokens**:
  - Main text: Harbor Ink (`#172b3a`).
  - Muted/Secondary: Slate Current (`#586970`).
  - Page Background: Paper Ground (`#f7f8f5`).
  - Surface: White (`#ffffff`).
  - Focus Ring & Accent: Terracotta Signal (`#d36b4a`).
- **Desktop Split Layout**: For `/rooms`, the results list and sticky map panel sit side-by-side. On mobile viewports, the map must be toggleable or collapsible behind an explicit action.

### 5.2 Styling Architecture
- Use **MUI 5 components** for foundation elements, form inputs, dialogs, and icons.
- Use **SCSS Modules** (`[Component].module.scss`) for custom styling and responsive layouts.
- **DO NOT** introduce Tailwind CSS, Bootstrap, alternative icon libraries, or styling engines.
- Use existing `@mui/icons-material` for icons; never embed raw hand-coded SVG paths.

### 5.3 Accessibility & Responsive Design
- Support responsive viewports: narrow mobile (375px+), tablet (768px+), and desktop (1024px to 1440px max content width).
- Always ensure visible keyboard focus indicators (`Terracotta Signal` or primary outline).
- Provide descriptive `aria-label`s on icon-only buttons (such as favorite buttons, map marker buttons, and dialog close icons).
- Every asynchronous action must have explicit **loading**, **error**, and **empty** states.

---

## 6. Implementation Standards for AI Agents

1. **TypeScript Rigor**:
   - Ensure strict typing at component boundaries, hook return values, and API interfaces.
   - Avoid `any` or unsafe casts. Use or extend types in `src/types/model/` and `src/types/axios/`.
2. **Component Structure**:
   - Keep components focused on presentation or composition.
   - Extract complex data fetching or mutations into dedicated hooks (`src/hooks/use-*.ts`).
   - Keep page-specific styles isolated inside that page's SCSS module.
3. **Preserve Documentation & Copy**:
   - Preserve comments, docstrings, and existing behavior unless specifically asked to refactor them.
   - Maintain consistency in language across English and Vietnamese labels.
4. **No Secret Leaks**:
   - Never commit sensitive API keys or credentials. Use `.env` variables (`GOOGLE_MAPS_API_KEY`).

---

## 7. Verification & Commands

Always verify changes before concluding tasks:

```bash
# Build & Typecheck (checks TypeScript compile errors and Vite bundle validity)
npm run build

# Code style & Lint check
npm run lint

# Unit tests
npm test
```

> **Note on Execution**: If running in an environment where `node` or `npm` is located in non-standard paths, prefix with:  
> `PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"`
