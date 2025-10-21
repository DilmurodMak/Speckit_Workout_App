# Workout Timer App

A sleek, mobile-first workout timer app built with React and TypeScript that allows users to create custom workout routines with multiple exercises, configurable durations, rest periods, and repetition cycles.

## Features

- ✅ **Create Custom Routines**: Build workout routines with multiple exercises, durations, and cycles
- ✅ **Accurate Timer**: 60 FPS countdown with ±0.5s accuracy over 10-minute workouts  
- ✅ **Automatic Transitions**: Seamless progression between exercises and rest periods
- ✅ **Visual & Audio Feedback**: Clear progress indicators and sound notifications
- ✅ **Offline-First**: All data stored locally, works without internet
- ✅ **Mobile-Optimized**: Responsive design with 44x44px touch targets
- ✅ **Accessible**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support

## Tech Stack

- **React 18.2+** - Component-based UI library
- **TypeScript 5.3+** - Type-safe development
- **Vite 5.0+** - Lightning-fast build tool and dev server
- **Tailwind CSS 3.4+** - Utility-first CSS framework
- **React Router 6** - Client-side routing
- **Vitest** - Unit testing framework
- **Playwright** - End-to-end testing

## Project Structure

```
src/
├── components/          # React components (atomic design)
│   ├── atoms/          # Basic building blocks (Button, Input, Timer)
│   ├── molecules/      # Composite components (ExerciseForm, TimerControls)
│   ├── organisms/      # Complex features (WorkoutBuilder, WorkoutExecutor)
│   └── templates/      # Page layouts
├── pages/              # Top-level views
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── services/           # Business logic and utilities
├── utils/              # Helper functions
└── styles/             # Global styles and variables
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Modern web browser (Chrome, Firefox, Safari, or Edge - latest 2 versions)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

### Development Commands

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run test         # Run unit tests with Vitest
npm run test:ui      # Run tests with UI
npm run e2e          # Run end-to-end tests with Playwright
```

## Constitution Compliance

This project adheres to the following principles:

### ✅ Static-First Architecture
- Pre-rendered at build time
- Served as static files from CDN
- No server-side rendering required

### ✅ Mobile-First Responsive Design
- Mobile-first CSS breakpoints
- Touch targets ≥44x44px (iOS HIG/WCAG)
- Responsive layouts for all screen sizes

### ✅ Performance Standards
- Initial bundle <150KB (gzipped JavaScript)
- CSS <20KB (gzipped with PurgeCSS)
- First Contentful Paint <1.5s on 3G
- 60 FPS animations
- Timer accuracy ±0.5s

### ✅ Accessibility Requirements (WCAG 2.1 AA)
- Semantic HTML5 elements
- ARIA labels and live regions
- Keyboard navigation support
- Color contrast ratios ≥4.5:1
- Screen reader compatible

### ✅ Browser Compatibility
- Chrome 110+ (January 2023)
- Firefox 109+ (January 2023)
- Safari 16+ (September 2022)
- Edge 110+ (January 2023)

## User Guide

### Creating a Workout Routine

1. Click "Create Workout" on the home screen
2. Enter a routine name (e.g., "Morning Cardio")
3. Add exercises with duration in seconds
4. Set rest time between exercises
5. Set total repetition cycles
6. Save your routine

### Executing a Workout

1. Select a routine from the home screen
2. Tap "Start Workout"
3. Follow the timer countdown for each exercise
4. Rest periods transition automatically
5. Pause/resume anytime with controls
6. Complete all cycles to finish

### Managing Routines

- **Edit**: Modify exercise names, durations, or settings
- **Duplicate**: Create a copy to use as a template
- **Delete**: Remove routines you no longer need

## Development Notes

### Audio Files

Replace placeholder audio files in `public/sounds/` with actual MP3 files:
- `beep.mp3` - Short beep for phase transitions (<100ms)
- `complete.mp3` - Celebratory sound for workout completion (<2s)

### LocalStorage Schema

The app stores data in LocalStorage with the following structure:

```typescript
{
  version: "1.0.0",
  routines: WorkoutRoutine[],
  preferences: {
    audioEnabled: boolean,
    lastUsedRoutineId: string | null
  },
  lastModified: number
}
```

### Testing

Run the complete test suite:

```bash
# Unit tests
npm run test

# E2E tests (ensure dev server is running)
npm run e2e
```

## Performance Targets

- **Bundle Size**: <200KB total (150KB JS + 20KB CSS)
- **Load Time**: <1s initial load on cable connection
- **UI Response**: <100ms for all interactions
- **Timer Accuracy**: ±0.5s over 10-minute workouts
- **Frame Rate**: 60 FPS during animations

## Accessibility Features

- Full keyboard navigation (Tab, Enter, Escape)
- Screen reader announcements for timer updates
- High contrast color combinations
- Focus indicators on all interactive elements
- Minimum 44x44px touch targets
- ARIA labels and landmarks

## License

Private project - All rights reserved

## Support

For issues or questions, please refer to the project specification in `/specs/001-workout-timer-app/`
