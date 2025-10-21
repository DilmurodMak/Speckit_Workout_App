# Research: Workout Timer App

**Phase**: 0 - Technology Research & Best Practices  
**Date**: 2025-10-17  
**Purpose**: Document technology decisions, best practices, and rationale for implementation choices

---

## Decision 1: React + TypeScript

**Context**: Need to build an interactive single-page application with complex state management (timer, workout session, routines).

**Decision**: Use React 18.2+ with TypeScript 5.3+

**Rationale**:
- **React**: Component-based architecture perfect for reusable UI elements (buttons, forms, timer display)
- **TypeScript**: Strong typing prevents runtime errors in timer calculations and state management
- **Hooks**: Modern React hooks API ideal for timer logic (`useEffect`, `useRef` for interval management)
- **Performance**: React 18 concurrent features ensure smooth 60 FPS animations
- **Ecosystem**: Mature tooling (Vite, testing libraries, component libraries)

**Alternatives Considered**:
- **Vanilla JavaScript**: Rejected - too much boilerplate for state management and component reusability
- **Vue.js**: Rejected - less TypeScript support, smaller ecosystem for mobile-first libraries
- **Svelte**: Rejected - smaller community, fewer mobile-optimized component examples

**Best Practices**:
- Use functional components with hooks (no class components)
- Implement custom hooks for timer logic to separate concerns
- Use TypeScript strict mode for maximum type safety
- Component composition over prop drilling (Context API for global state if needed)

---

## Decision 2: Vite Build Tool

**Context**: Need fast development experience and optimized production builds that meet <200KB bundle target.

**Decision**: Use Vite 5.0+ as build tool and development server

**Rationale**:
- **Lightning-fast HMR**: Sub-100ms hot module replacement for instant feedback
- **Optimized builds**: Tree-shaking, code-splitting, CSS optimization out of the box
- **TypeScript native**: Built-in TypeScript support, no additional config needed
- **Small bundles**: Modern ES modules, minimal runtime overhead
- **Plugin ecosystem**: Rich plugins for PWA, compression, bundle analysis

**Alternatives Considered**:
- **Create React App (CRA)**: Rejected - slow build times, bloated config, deprecated
- **Webpack**: Rejected - complex configuration, slower dev server
- **Parcel**: Rejected - less control over optimizations, smaller community

**Best Practices**:
- Enable code splitting with React.lazy() for page routes
- Use dynamic imports for non-critical features (audio service)
- Configure chunk size warnings at 150KB
- Enable CSS Modules for component-scoped styles
- Use Vite's asset optimization (image compression, font subsetting)

---

## Decision 3: CSS Modules + Tailwind CSS

**Context**: Need mobile-first responsive styling that's maintainable and performant.

**Decision**: Hybrid approach - CSS Modules for component styles + Tailwind CSS for utility classes

**Rationale**:
- **CSS Modules**: Component-scoped styles prevent conflicts, better for complex animations
- **Tailwind CSS**: Rapid mobile-first responsive design with utility classes
- **Performance**: PurgeCSS removes unused Tailwind classes, minimal CSS bundle
- **Developer Experience**: Autocomplete in VS Code, consistent spacing/colors
- **Accessibility**: Tailwind includes focus states, screen reader utilities

**Alternatives Considered**:
- **Styled Components**: Rejected - runtime CSS-in-JS overhead affects performance
- **Emotion**: Rejected - similar runtime overhead
- **Pure Tailwind**: Rejected - complex animations harder to manage
- **Pure CSS Modules**: Rejected - slower to write responsive utilities

**Best Practices**:
- Use Tailwind for layout, spacing, responsive breakpoints, colors
- Use CSS Modules for keyframe animations, timer displays, transitions
- Define custom Tailwind colors in config for brand consistency
- Use `@apply` sparingly (only for repeated Tailwind patterns)
- Mobile-first breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px)

---

## Decision 4: LocalStorage for Data Persistence

**Context**: Need to save workout routines across sessions without backend/database.

**Decision**: Use browser LocalStorage API with JSON serialization

**Rationale**:
- **Simplicity**: Built-in browser API, no external dependencies
- **Offline-first**: Works without internet connection (constitution requirement)
- **Sufficient capacity**: 5-10MB limit more than enough for hundreds of routines
- **Synchronous API**: Simpler than IndexedDB for basic CRUD operations
- **Wide support**: Available in all target browsers

**Alternatives Considered**:
- **IndexedDB**: Rejected - overkill for simple key-value storage, complex async API
- **SessionStorage**: Rejected - clears on browser close, doesn't persist
- **Cookies**: Rejected - 4KB limit too small, sent with every request
- **Backend API**: Rejected - requires server, violates static-first architecture

**Best Practices**:
- Wrap LocalStorage in service layer with error handling (quota exceeded, disabled storage)
- Use TypeScript interfaces for stored data structures
- Implement data versioning for schema migrations (v1, v2, etc.)
- Add try-catch for quota errors (show user-friendly message)
- Consider compression for very large routine lists (optional enhancement)
- Store each routine with unique ID (UUID or timestamp-based)

**Data Structure**:
```typescript
interface StoredData {
  version: string; // "1.0.0"
  routines: WorkoutRoutine[];
  lastModified: number; // timestamp
}
```

---

## Decision 5: Web Audio API for Sound Feedback

**Context**: Need beep sounds for timer transitions (exercise → rest → exercise).

**Decision**: Use Web Audio API with preloaded audio buffers

**Rationale**:
- **Low latency**: <10ms playback start time for precise timer transitions
- **Reliable**: Better than HTML5 `<audio>` element on mobile browsers
- **Control**: Volume control, fade in/out, multiple simultaneous sounds
- **Performance**: Audio buffers loaded once at app start, minimal memory

**Alternatives Considered**:
- **HTML5 Audio**: Rejected - mobile Safari has playback delays, requires user interaction
- **Howler.js**: Rejected - 20KB library overhead for simple beeps
- **Audio sprites**: Rejected - single beep sufficient, no need for sprite complexity

**Best Practices**:
- Load audio files in background after initial render (lazy loading)
- Require user interaction before first audio playback (browser policy)
- Provide mute toggle in UI (accessibility + user preference)
- Use short audio files (<100ms beep, <2s completion sound)
- Fallback to visual-only feedback if audio fails/disabled
- Test on iOS Safari specifically (strict audio policies)

---

## Decision 6: Custom Hooks for State Management

**Context**: Complex timer state, workout session state, and routine management need clean abstraction.

**Decision**: Create custom React hooks for each domain concern

**Key Hooks**:

### `useTimer`
- Manages countdown state (time remaining, running/paused)
- Uses `setInterval` with `useRef` to prevent closure stale state
- Returns: `{ timeRemaining, isRunning, start, pause, resume, reset }`
- **Best Practice**: Cleanup interval in `useEffect` return function

### `useWorkoutSession`
- Orchestrates full workout execution (exercises, rest, cycles)
- Calls `useTimer` internally for countdown
- Handles automatic transitions (exercise → rest → next exercise)
- Returns: `{ currentPhase, currentExercise, currentCycle, progress, start, pause, stop }`

### `useRoutineStorage`
- Encapsulates LocalStorage CRUD operations
- Returns: `{ routines, createRoutine, updateRoutine, deleteRoutine, getRoutine }`
- Handles serialization/deserialization and error handling

### `useAudioFeedback`
- Manages audio playback with Web Audio API
- Preloads audio buffers on mount
- Returns: `{ playBeep, playComplete, isMuted, toggleMute }`

### `useWakeLock`
- Prevents screen sleep during workouts (Screen Wake Lock API)
- Returns: `{ isLocked, requestLock, releaseLock }`
- Graceful degradation if API not supported

**Rationale**:
- **Separation of concerns**: Business logic separate from UI components
- **Testability**: Hooks can be tested independently with React Testing Library
- **Reusability**: Multiple components can use same hook
- **Readability**: Components focus on rendering, hooks handle state/effects

---

## Decision 7: Vitest + React Testing Library

**Context**: Need fast, reliable unit tests for components and hooks.

**Decision**: Use Vitest for test runner + React Testing Library for component testing

**Rationale**:
- **Vitest**: Vite-native, instant test startup, same config as dev server
- **Fast**: Parallel test execution, smart caching, <1s test suite runs
- **RTL**: Tests user behavior (not implementation details), accessibility-focused
- **TypeScript**: Full TypeScript support without additional config

**Alternatives Considered**:
- **Jest**: Rejected - slower startup, separate config from Vite
- **Enzyme**: Rejected - implementation-focused, not maintained

**Best Practices**:
- Test user interactions (clicking buttons, typing input)
- Query by accessible roles (`getByRole('button')`)
- Test timer accuracy with fake timers (`vi.useFakeTimers()`)
- Mock LocalStorage with `vi.mock()`
- Aim for 80%+ code coverage on hooks and services

---

## Decision 8: Playwright for E2E Testing

**Context**: Need to verify complete user workflows across browsers.

**Decision**: Use Playwright for end-to-end testing

**Rationale**:
- **Cross-browser**: Tests Chrome, Firefox, Safari with single codebase
- **Mobile emulation**: Test responsive layouts, touch interactions
- **Reliable**: Auto-wait for elements, retries on flakiness
- **Fast**: Parallel execution across browsers

**Test Scenarios**:
1. Create routine with 3 exercises, save, verify in list
2. Execute workout, verify timer countdown accuracy
3. Pause/resume workout, verify state preservation
4. Complete full workout cycle, verify completion message
5. Edit routine, verify changes persist

---

## Decision 9: Responsive Design Strategy

**Context**: Must work on mobile, tablet, desktop per constitution.

**Decision**: Mobile-first responsive design with Tailwind breakpoints

**Breakpoints**:
- **Mobile**: 320px - 639px (default, no prefix)
- **Tablet**: 640px - 1023px (`sm:`, `md:`)
- **Desktop**: 1024px+ (`lg:`, `xl:`)

**Layout Strategy**:
- **Mobile**: Single column, stacked cards, full-width buttons
- **Tablet**: Two-column routine list, side-by-side controls
- **Desktop**: Three-column layout, larger timer display

**Touch Targets**:
- All buttons minimum 44x44px (iOS HIG, WCAG requirement)
- Increased padding on mobile for fat-finger-friendly taps
- Swipe gestures for deleting routines (optional enhancement)

---

## Decision 10: Accessibility Implementation

**Context**: Must meet WCAG 2.1 AA per constitution.

**Implementation Plan**:

### Semantic HTML
- Use `<button>` for all clickable actions (not `<div>`)
- Use `<form>` for workout builder with proper labels
- Use `<main>`, `<nav>`, `<section>` for landmarks

### ARIA Labels
- Timer display: `aria-live="polite"` announces time changes to screen readers
- Exercise name: `aria-label` for current exercise
- Progress: `aria-valuenow`, `aria-valuemin`, `aria-valuemax` for progress bars

### Keyboard Navigation
- All interactive elements focusable with `Tab`
- Space/Enter triggers button actions
- Escape closes modals/dialogs
- Visual focus indicators (outline, ring)

### Color Contrast
- Timer display: #FFFFFF on #1F2937 (21:1 ratio - AAA)
- Buttons: #10B981 on #FFFFFF (3.0:1 minimum - pass AA for large text)
- Rest indicator: #F59E0B (yellow/orange with sufficient contrast)

### Testing
- Lighthouse accessibility audit (target 100 score)
- Keyboard-only navigation testing
- Screen reader testing (VoiceOver on iOS, TalkBack on Android)

---

## Performance Optimization Strategy

### Bundle Size Targets
- **Initial load**: <150KB JavaScript (gzipped)
- **CSS**: <20KB (PurgeCSS removes unused Tailwind)
- **Total assets**: <200KB (constitution requirement)

### Code Splitting
- Lazy load pages with `React.lazy()`:
  ```typescript
  const CreateRoutine = lazy(() => import('./pages/CreateRoutine'))
  ```
- Lazy load audio service (not needed until workout starts)

### Render Optimization
- `React.memo()` for pure components (ExerciseCard, Timer display)
- `useMemo()` for expensive calculations (total workout duration)
- `useCallback()` for stable function references in child components

### Timer Accuracy
- Use `setInterval` with drift correction:
  ```typescript
  const drift = Date.now() - expectedTime;
  const nextTick = Math.max(0, interval - drift);
  ```
- Prevents accumulating delay over long workouts

### Asset Optimization
- Compress audio files to <50KB each
- Use SVG icons (inline in components, no HTTP requests)
- Preload critical assets with `<link rel="preload">`

---

## Browser Compatibility Notes

### Target Browsers
- Chrome 110+ (January 2023)
- Firefox 109+ (January 2023)
- Safari 16+ (September 2022)
- Edge 110+ (January 2023)

### Polyfills Needed
- None required for core features (all APIs widely supported)
- Optional: Screen Wake Lock API polyfill (for older browsers)

### Progressive Enhancement
- App works without audio (visual-only feedback fallback)
- App works without Wake Lock (user manually keeps screen on)
- LocalStorage disabled: Show warning, allow single-session use

---

## Security Considerations

### LocalStorage Security
- No sensitive data stored (only workout configurations)
- No authentication tokens or personal information
- XSS protection via React's built-in sanitization

### Content Security Policy
- Restrict script sources to same-origin
- No inline scripts (except Vite's dev server)
- No eval() or Function() constructors

---

## Deployment Strategy

### Build Process
1. Run `npm run build` (Vite production build)
2. Output to `/dist` folder (static HTML/CSS/JS)
3. Deploy to static hosting (Netlify, Vercel, GitHub Pages, Cloudflare Pages)

### Hosting Recommendations
- **Netlify**: Free tier, automatic HTTPS, CDN
- **Vercel**: Similar to Netlify, excellent DX
- **GitHub Pages**: Free, good for open-source projects
- **Cloudflare Pages**: Fast global CDN

### CDN Configuration
- Set cache headers for assets (1 year for hashed files)
- Enable Brotli compression (better than gzip)
- Serve over HTTP/2 or HTTP/3

---

## Summary

All technical decisions align with the project constitution and requirements. React + TypeScript provides strong foundation for complex state management. Vite ensures fast development and optimized builds. LocalStorage meets offline-first requirement. Custom hooks promote testability and maintainability. Comprehensive accessibility and performance strategies ensure WCAG 2.1 AA compliance and 90+ Lighthouse scores.

**Ready to proceed to Phase 1: Data Model & Contracts**
