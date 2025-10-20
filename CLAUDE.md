# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a delivery driver mileage tracking application built with Next.js 15 (App Router), React 19, MongoDB (Mongoose), and Tailwind CSS. The app tracks delivery trips, breaks, orders, income, and provides analytics for drivers. It's designed as a mobile-first progressive web application.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

The development server runs at http://localhost:3000

## Architecture

### Database Connection Pattern

The app uses a singleton MongoDB connection pattern via `lib/mongodb.js` with a connection pooling strategy. Always import and call `connectToDb()` at the start of API routes before database operations:

```javascript
import { connectToDb } from '@/lib/mongodb';
await connectToDb();
```

### Data Models

Three main Mongoose models in the `models/` directory:

1. **Trip** (`models/entry.js`) - Core entity with nested subdocuments:
   - Tracks start/end mileage, datetime, zone, and trip status
   - Contains arrays of `breaks` and `orders` (subdocuments)
   - Pre-save hook automatically sets `month` and `dayOfWeek` in America/New_York timezone
   - Only one trip can be `isActive: true` at a time

2. **Income** (`models/income.js`) - Weekly income tracking by month

3. **OilChange** (`models/oilChange.js`) - Tracks mileage for oil change reminders (5000-mile intervals)

### API Structure

API routes in `app/api/` follow RESTful patterns:

- `GET/POST /api/entry` - List all trips or create/end trips
- `PATCH/DELETE /api/entry/[id]` - Update or delete specific trips
- `POST /api/entry/[id]/order` - Add orders to active trips
- `POST /api/break` - Start/end breaks on active trips
- `GET /api/analytics/*` - Various analytics endpoints (daily, hourly, monthly)
- `GET /api/export` - CSV export with date range filtering
- `GET/POST/PATCH /api/oil` - Oil change tracking
- `GET/POST /api/income` - Income tracking
- `POST /api/logs` - Visit logging

### Page Routes

- `/` - Main trip tracking interface (start/end trips, breaks, orders)
- `/mileage` - Trip history with editing, deletion, pagination, and CSV export
- `/analytics` - Dashboard with trip statistics and visualizations
- `/income` - Income tracking interface
- `/ar` and `/image` - OCR/image processing pages (uses Tesseract.js)

### Key Utilities

**`lib/utils.js`** contains critical helper functions:
- `formatDuration()` - Converts seconds to readable time format
- `calculateMileageStats()` - Aggregates trip statistics
- `paginateTrips()` - Handles filtering by period/year and pagination
- `formatDayHeader()`, `getDayTotal()` - Trip grouping and display

**`lib/checkOil.js`** - Checks if vehicle needs oil change based on 5000-mile threshold

**`lib/analyticUtils.js`** - Analytics data processing functions

### Component Organization

- `components/` - Feature components (dialogs, trip cards, stats, filters)
- `components/ui/` - Radix UI-based primitives (shadcn/ui pattern)
- `components/analytics/` - Analytics-specific components
- `components/income/` - Income-specific components
- `components/stats/` - Statistics display components

### State Management

The app uses React hooks (`useState`, `useEffect`) for local state. No global state management library is used. Active trip state is fetched from the database on page load and updated via API calls.

### Styling Approach

- Tailwind CSS with custom color system via CSS variables in `globals.css`
- Dark theme with custom `--background`, `--text`, `--primary`, `--accent` colors
- Mobile-first responsive design (viewport units: `100dvh`)
- Active state animations with `active:scale-[0.98]`

## Important Development Notes

- **Active Trip Logic**: Only one trip can be active at a time. Starting a new trip when one is active should not be possible through the UI.

- **Break Tracking**: Breaks are tracked as time intervals that subtract from total trip duration. Breaking while already on break should not be possible.

- **Order Tracking**: Orders are timestamped and associated with hour blocks. They include type (Food/Grocery), acceptance status, and unassigned status.

- **Timezone Handling**: All trip dates use `America/New_York` timezone for month/day calculations in the database pre-save hook.

- **Environment Variables**: `MONGODB_URI` is required and configured in `.env`. The Next.js config explicitly passes this to the client environment.

- **CSV Export**: Uses date range filtering with query parameters and generates a downloadable blob.

- **OCR Features**: The app includes Tesseract.js for image-based data entry (pages under `/ar` and `/image`).

- **Analytics**: Multiple endpoint variants exist for different time groupings (hourly, daily, monthly). Analytics data is computed from trip records.
