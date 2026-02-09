# PropVista - Real Estate Web Platform (MVP)

A responsive, production-grade property listing web application built with React JS, TypeScript, Redux Toolkit, and shadcn/ui.

## Live Demo

Start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Test Accounts

| Role   | Email            | Description                    |
|--------|------------------|--------------------------------|
| Buyer  | buyer@test.com   | Can browse, save, schedule     |
| Seller | seller@test.com  | Can list properties, manage    |
| Admin  | admin@test.com   | Full admin access              |

## Tech Stack

| Technology       | Purpose                        |
|------------------|--------------------------------|
| React 18         | UI library (Functional Components) |
| TypeScript       | Type safety                    |
| Vite             | Build tool & dev server        |
| React Router v6  | Client-side routing            |
| Redux Toolkit    | State management               |
| shadcn/ui        | Component library (Radix UI + Tailwind) |
| Tailwind CSS v4  | Utility-first styling          |
| Framer Motion    | Animations & transitions       |
| Recharts         | Admin analytics charts         |
| Swiper           | Image carousel                 |
| Sonner           | Toast notifications            |
| Lucide React     | Icon library                   |

## Features

### Core (MVP)

- **Search & Navigation**: Location search by city/locality/state, debounced search, config/budget/possession filters
- **Property Listings**: Responsive card grid with image, price, specs, ratings; List/Map view toggle
- **Property Details**: Image carousel with thumbnails, amenities, videos (placeholder), possession info
- **User Profiles**:
  - **Buyer**: Browse without login, save favorites, schedule video calls & site visits, dashboard with saved properties & appointments
  - **Seller**: Registration with mock payment, add property form, premium listing toggle, view inquiries & appointments
- **Admin Panel**: View/approve/reject listings, manage users, view all appointments
- **Communication Tools**: Phone call (tel: link), video call scheduling with date/time picker, site visit scheduling
- **Notifications**: Toast messages on key actions, notification center in header, email/SMS toggle UI
- **Authentication**: Mocked Google OAuth, protected routes per role
- **Monetization UI**: Seller registration fee checkbox, premium listing toggle with gold badge

### Bonus Features

- **Dark Mode**: System-aware theme with manual toggle, persisted to localStorage
- **Property Comparison**: Compare up to 3 properties side-by-side (price, specs, amenities)
- **Analytics Dashboard**: Bar chart (properties by city), pie chart (status distribution), line chart (appointments over time)
- **Image Carousel**: Swiper-based carousel with thumbnail navigation on property detail
- **Reviews & Ratings**: Star rating on cards, review list, write review form (login required)

## Project Architecture

```
src/
├── types/          # TypeScript interfaces and types
├── components/
│   ├── ui/         # shadcn/ui components (Button, Card, Dialog, etc.)
│   ├── layout/     # Header, Footer, Layout wrapper
│   └── common/     # PropertyCard, FilterPanel, MapPlaceholder, CompareBar
├── features/
│   ├── auth/       # Login, Register pages + authSlice
│   ├── properties/ # Home, PropertyDetail, Compare pages + propertySlice
│   ├── buyer/      # Buyer dashboard
│   ├── seller/     # Seller dashboard
│   ├── admin/      # Admin panel with analytics
│   ├── reviews/    # Review system + reviewSlice
│   ├── compare/    # Compare feature + compareSlice
│   └── notifications/ # Notification system + slice
├── services/       # Async API service layer (mock)
├── store/          # Redux store configuration
├── hooks/          # Custom hooks (useAppDispatch, useDebounce, etc.)
├── context/        # Theme context (dark mode)
├── data/           # Mock data (18 properties, users, reviews, appointments)
└── routes/         # Route definitions with lazy loading
```

## Design Decisions

- **Feature-based architecture**: Each feature is self-contained with its own slice, components, and pages
- **Service layer pattern**: All data access goes through async service functions that simulate API calls with delays, making it trivial to swap in a real backend
- **Redux Toolkit with createAsyncThunk**: Proper loading/error states, normalized patterns
- **Typed everything**: All props, state, actions, and selectors are fully typed
- **Code splitting**: React.lazy + Suspense for route-based code splitting
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation, proper color contrast
- **Responsive**: Mobile-first design tested across 320px to 1536px breakpoints

## Security Notes

- SSL/HTTPS: Assumed for production deployment (enforced at infrastructure level)
- Protected routes: Role-based access control for Buyer/Seller/Admin dashboards
- Input validation: Client-side validation on all forms
- No sensitive data: All data is mock/local, no real credentials stored

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # TypeScript type checking
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

---

Built with React JS for PropVista Machine Test.
