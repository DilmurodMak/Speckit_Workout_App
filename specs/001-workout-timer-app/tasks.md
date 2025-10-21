# Tasks: Workout Timer App

**Input**: Design documents from `/specs/001-workout-timer-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/components.md

**Tests**: Tests are NOT requested in the feature specification, so test tasks are NOT included in this breakdown.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions
Based on plan.md structure: Single-page web application with `src/` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure per implementation plan (workout-timer-app/ with src/, public/, tests/)
- [X] T002 Initialize React TypeScript project with Vite 5.0+ and configure tsconfig.json
- [X] T003 [P] Install dependencies: react@18.2+, react-dom@18.2+, react-router-dom@6+, typescript@5.3+
- [X] T004 [P] Install dev dependencies: vitest, @testing-library/react, @testing-library/user-event, playwright
- [X] T005 [P] Install Tailwind CSS 3.4+ and configure tailwind.config.js with mobile-first breakpoints
- [X] T006 [P] Configure ESLint and Prettier for TypeScript/React with .eslintrc.json and .prettierrc
- [X] T007 [P] Setup Vite configuration in vite.config.ts with code splitting and CSS Modules
- [X] T008 Create global styles in src/styles/global.css, src/styles/variables.css, src/styles/breakpoints.css
- [X] T009 [P] Add audio files to public/sounds/beep.mp3 and public/sounds/complete.mp3
- [X] T010 Create README.md with project setup instructions and constitution compliance notes

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T011 Create TypeScript type definitions in src/types/workout.types.ts (Exercise, WorkoutRoutine interfaces)
- [X] T012 [P] Create TypeScript type definitions in src/types/timer.types.ts (TimerState, SessionStatus, PhaseType)
- [X] T013 [P] Create TypeScript type definitions in src/types/storage.types.ts (StorageData interface)
- [X] T014 Create utility functions in src/utils/formatTime.ts (convert seconds to MM:SS format)
- [X] T015 [P] Create utility functions in src/utils/generateId.ts (UUID or timestamp-based ID generation)
- [X] T016 [P] Create utility functions in src/utils/constants.ts (STORAGE_KEY, validation limits, app constants)
- [X] T017 Create validation service in src/services/validationService.ts (validateExercise, validateRoutine functions)
- [X] T018 [P] Create storage service in src/services/storageService.ts (LocalStorage CRUD with error handling, versioning)
- [X] T019 [P] Create timer service in src/services/timerService.ts (calculateCycleDuration, calculateTotalDuration utilities)
- [X] T020 Create audio service in src/services/audioService.ts (Web Audio API initialization, playback management)
- [X] T021 Create React Router configuration in src/App.tsx with routes (/, /create, /edit/:id, /workout/:id)
- [X] T022 [P] Create MainLayout component in src/components/templates/MainLayout/MainLayout.tsx with navigation
- [X] T023 [P] Create Navigation component in src/components/organisms/Navigation/Navigation.tsx with app header

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create Custom Workout Routine (Priority: P1) 🎯 MVP

**Goal**: Enable users to create workout routines with exercises, durations, rest times, and cycles

**Independent Test**: Create a routine named "Morning Cardio" with 3 exercises (Push-ups 30s, Sit-ups 45s, Pull-ups 20s), 10s rest, 3 cycles. Save and verify it persists in LocalStorage and appears in routine list.

### Atomic Components for User Story 1

- [ ] T024 [P] [US1] Create Button component in src/components/atoms/Button/Button.tsx with variants (primary, secondary, danger, ghost)
- [ ] T025 [P] [US1] Create Button styles in src/components/atoms/Button/Button.module.css (44x44px touch targets, hover states)
- [ ] T026 [P] [US1] Create Input component in src/components/atoms/Input/Input.tsx with validation and error display
- [ ] T027 [P] [US1] Create Input styles in src/components/atoms/Input/Input.module.css (mobile-friendly sizing)

### Molecule Components for User Story 1

- [ ] T028 [P] [US1] Create ExerciseForm component in src/components/molecules/ExerciseForm/ExerciseForm.tsx
- [ ] T029 [P] [US1] Create ExerciseForm styles in src/components/molecules/ExerciseForm/ExerciseForm.module.css
- [ ] T030 [P] [US1] Create ExerciseCard component in src/components/molecules/ExerciseCard/ExerciseCard.tsx (list variant)
- [ ] T031 [P] [US1] Create ExerciseCard styles in src/components/molecules/ExerciseCard/ExerciseCard.module.css

### Organism Components for User Story 1

- [ ] T032 [US1] Create WorkoutBuilder component in src/components/organisms/WorkoutBuilder/WorkoutBuilder.tsx
- [ ] T033 [US1] Create WorkoutBuilder styles in src/components/organisms/WorkoutBuilder/WorkoutBuilder.module.css
- [ ] T034 [US1] Implement WorkoutBuilder state management (routine name, exercises array, rest time, cycles)
- [ ] T035 [US1] Implement add/remove/reorder exercise functionality in WorkoutBuilder
- [ ] T036 [US1] Integrate validation service with WorkoutBuilder form (real-time validation)

### Custom Hooks for User Story 1

- [ ] T037 [P] [US1] Create useRoutineStorage hook in src/hooks/useRoutineStorage.ts (createRoutine, getRoutine methods)
- [ ] T038 [US1] Implement createRoutine with LocalStorage persistence and error handling in useRoutineStorage

### Pages for User Story 1

- [ ] T039 [US1] Create CreateRoutine page in src/pages/CreateRoutine.tsx
- [ ] T040 [US1] Wire up CreateRoutine page with WorkoutBuilder and useRoutineStorage hook
- [ ] T041 [US1] Implement save routine functionality with validation and success/error feedback
- [ ] T042 [US1] Add navigation after successful save (redirect to Home page)

**Checkpoint**: At this point, User Story 1 should be fully functional - users can create and save workout routines

---

## Phase 4: User Story 4 - Manage Saved Routines (Priority: P4)

**Goal**: Display saved routines, enable view/edit/delete/duplicate operations

**Independent Test**: Create multiple routines, verify they appear in list. Edit one routine's name and exercises. Duplicate a routine. Delete a routine. All changes should persist across page refresh.

**Note**: Implementing US4 before US2/US3 provides the home screen UI foundation needed for navigating to workout execution.

### Organism Components for User Story 4

- [ ] T043 [P] [US4] Create RoutineCard component in src/components/organisms/RoutineCard/RoutineCard.tsx
- [ ] T044 [P] [US4] Create RoutineCard styles in src/components/organisms/RoutineCard/RoutineCard.module.css
- [ ] T045 [US4] Create RoutineList component in src/components/organisms/RoutineList/RoutineList.tsx
- [ ] T046 [US4] Create RoutineList styles in src/components/organisms/RoutineList/RoutineList.module.css
- [ ] T047 [US4] Implement empty state display in RoutineList ("No routines yet" message with create button)

### Custom Hooks for User Story 4

- [ ] T048 [US4] Extend useRoutineStorage hook with updateRoutine, deleteRoutine, duplicateRoutine methods
- [ ] T049 [US4] Implement routine loading on mount in useRoutineStorage (sync from LocalStorage)

### Pages for User Story 4

- [ ] T050 [US4] Create Home page in src/pages/Home.tsx
- [ ] T051 [US4] Wire up Home page with RoutineList and useRoutineStorage hook
- [ ] T052 [US4] Implement routine selection handlers (start workout, edit, delete, duplicate)
- [ ] T053 [US4] Add confirmation dialog for delete action (prevent accidental deletion)
- [ ] T054 [US4] Create EditRoutine page in src/pages/EditRoutine.tsx
- [ ] T055 [US4] Wire up EditRoutine page with WorkoutBuilder (pre-populated with existing routine)
- [ ] T056 [US4] Implement update routine functionality with save confirmation

**Checkpoint**: At this point, User Stories 1 AND 4 work together - users can create, view, edit, delete, and duplicate routines

---

## Phase 5: User Story 2 - Execute Workout with Timer (Priority: P2)

**Goal**: Start workout, countdown timer for each exercise/rest, automatic phase transitions, pause/resume/stop controls

**Independent Test**: Select "Morning Cardio" routine from home. Start workout. Timer counts down from 30s for Push-ups, automatically transitions to 10s rest, then 45s Sit-ups, etc. Complete 3 full cycles. Verify timer accuracy with stopwatch (±0.5s).

### Atomic Components for User Story 2

- [ ] T057 [P] [US2] Create Timer component in src/components/atoms/Timer/Timer.tsx (large countdown display)
- [ ] T058 [P] [US2] Create Timer styles in src/components/atoms/Timer/Timer.module.css (circular progress ring, phase colors)

### Molecule Components for User Story 2

- [ ] T059 [P] [US2] Create TimerControls component in src/components/molecules/TimerControls/TimerControls.tsx
- [ ] T060 [P] [US2] Create TimerControls styles in src/components/molecules/TimerControls/TimerControls.module.css
- [ ] T061 [P] [US2] Update ExerciseCard component to support "current" and "upcoming" variants for workout display

### Organism Components for User Story 2

- [ ] T062 [US2] Create WorkoutExecutor component in src/components/organisms/WorkoutExecutor/WorkoutExecutor.tsx
- [ ] T063 [US2] Create WorkoutExecutor styles in src/components/organisms/WorkoutExecutor/WorkoutExecutor.module.css
- [ ] T064 [US2] Create CompletionScreen component in src/components/organisms/CompletionScreen/CompletionScreen.tsx
- [ ] T065 [US2] Create CompletionScreen styles in src/components/organisms/CompletionScreen/CompletionScreen.module.css

### Custom Hooks for User Story 2

- [ ] T066 [P] [US2] Create useTimer hook in src/hooks/useTimer.ts (countdown logic with setInterval)
- [ ] T067 [US2] Implement timer accuracy with drift correction in useTimer (prevent accumulating delay)
- [ ] T068 [US2] Implement start, pause, resume, reset, stop methods in useTimer
- [ ] T069 [US2] Add onComplete callback trigger when timer reaches 0 in useTimer
- [ ] T070 [P] [US2] Create useAudioFeedback hook in src/hooks/useAudioFeedback.ts (Web Audio API wrapper)
- [ ] T071 [US2] Implement playTransition and playComplete methods in useAudioFeedback
- [ ] T072 [US2] Add mute toggle and volume control in useAudioFeedback
- [ ] T073 [P] [US2] Create useWakeLock hook in src/hooks/useWakeLock.ts (Screen Wake Lock API)
- [ ] T074 [US2] Implement requestLock and releaseLock with graceful degradation in useWakeLock
- [ ] T075 [US2] Create useWorkoutSession hook in src/hooks/useWorkoutSession.ts
- [ ] T076 [US2] Implement WorkoutSession state management in useWorkoutSession (cycle, exercise index, phase)
- [ ] T077 [US2] Implement automatic phase transitions (exercise → rest → next exercise) in useWorkoutSession
- [ ] T078 [US2] Implement cycle progression logic (increment cycle after last exercise) in useWorkoutSession
- [ ] T079 [US2] Integrate useTimer within useWorkoutSession for countdown control
- [ ] T080 [US2] Integrate useAudioFeedback within useWorkoutSession for phase transition sounds
- [ ] T081 [US2] Calculate and expose progress metrics (current/total exercises, cycles, percent complete)

### Pages for User Story 2

- [ ] T082 [US2] Create ExecuteWorkout page in src/pages/ExecuteWorkout.tsx
- [ ] T083 [US2] Wire up ExecuteWorkout page with WorkoutExecutor and useWorkoutSession hook
- [ ] T084 [US2] Implement workout start with 5-second countdown ("Get Ready!")
- [ ] T085 [US2] Implement pause/resume functionality with state preservation
- [ ] T086 [US2] Implement stop functionality with confirmation dialog
- [ ] T087 [US2] Implement workout completion flow (show CompletionScreen)
- [ ] T088 [US2] Add navigation from Home to ExecuteWorkout on routine selection

**Checkpoint**: At this point, User Stories 1, 2, AND 4 work together - users can create routines, execute workouts with accurate timing, and manage saved routines

---

## Phase 6: User Story 3 - Visual Progress Tracking (Priority: P3)

**Goal**: Display clear visual indicators for current exercise, progress, cycle number, and phase (work/rest)

**Independent Test**: During workout execution, verify screen shows: exercise name, time remaining, "WORK" or "REST" indicator, "Exercise 2 of 3", "Round 2 of 3", overall progress bar. User should never be confused about workout position.

### Molecule Components for User Story 3

- [ ] T089 [P] [US3] Create ProgressBar component in src/components/molecules/ProgressBar/ProgressBar.tsx
- [ ] T090 [P] [US3] Create ProgressBar styles in src/components/molecules/ProgressBar/ProgressBar.module.css
- [ ] T091 [US3] Implement linear and circular variants in ProgressBar component

### Organism Components for User Story 3

- [ ] T092 [US3] Create WorkoutStats component in src/components/organisms/WorkoutStats/WorkoutStats.tsx
- [ ] T093 [US3] Create WorkoutStats styles in src/components/organisms/WorkoutStats/WorkoutStats.module.css
- [ ] T094 [US3] Implement live workout stats display (current cycle, exercise, elapsed time)

### Integration for User Story 3

- [ ] T095 [US3] Integrate ProgressBar into WorkoutExecutor for exercise progress (linear)
- [ ] T096 [US3] Integrate ProgressBar into WorkoutExecutor for overall progress (circular or linear)
- [ ] T097 [US3] Integrate WorkoutStats into WorkoutExecutor above timer display
- [ ] T098 [US3] Add phase indicator badge ("WORK" green / "REST" yellow-orange) in WorkoutExecutor
- [ ] T099 [US3] Add upcoming exercise preview ("Next: Sit-ups") during rest periods
- [ ] T100 [US3] Add cycle completion message ("Cycle 1 Complete!") between cycles
- [ ] T101 [US3] Ensure all progress indicators update within 100ms of phase transitions

**Checkpoint**: All user stories (US1, US2, US3, US4) are now complete and independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and finalize the app

### Accessibility Enhancements

- [ ] T102 [P] Add ARIA labels to all interactive elements (buttons, inputs, progress bars)
- [ ] T103 [P] Implement aria-live regions for timer announcements in Timer component
- [ ] T104 [P] Add keyboard navigation support (Tab, Enter, Escape) across all components
- [ ] T105 [P] Verify all touch targets meet 44x44px minimum size requirement
- [ ] T106 [P] Test and fix color contrast ratios (WCAG 2.1 AA compliance)
- [ ] T107 Add focus indicators for keyboard navigation (visible outlines/rings)

### Performance Optimization

- [ ] T108 [P] Implement React.lazy() for page components (CreateRoutine, EditRoutine, ExecuteWorkout)
- [ ] T109 [P] Add React.memo() to pure components (ExerciseCard, Timer, ProgressBar)
- [ ] T110 [P] Optimize re-renders with useMemo for expensive calculations (total duration)
- [ ] T111 [P] Optimize re-renders with useCallback for stable function references
- [ ] T112 [P] Configure Vite build optimizations (minification, tree-shaking, code splitting)
- [ ] T113 Verify production bundle size <150KB JavaScript (gzipped)
- [ ] T114 [P] Verify production bundle size <20KB CSS (gzipped with PurgeCSS)
- [ ] T115 Run Lighthouse audit and achieve 90+ scores (Performance, Accessibility, Best Practices)

### Error Handling & Edge Cases

- [ ] T116 [P] Add error boundary component in src/components/ErrorBoundary.tsx
- [ ] T117 [P] Implement graceful LocalStorage quota exceeded handling in storageService
- [ ] T118 [P] Add error states to useRoutineStorage (display error messages in UI)
- [ ] T119 [P] Handle audio playback failures in useAudioFeedback (fallback to visual-only)
- [ ] T120 [P] Add loading states to all async operations (routine loading, saving, deleting)
- [ ] T121 Test and handle edge cases: 0 rest time, 1 exercise, 1 cycle, 999-second duration
- [ ] T122 Test and handle screen lock during workout (timer continues in background)
- [ ] T123 Test and handle browser tab backgrounding (timer accuracy preserved)

### Documentation & Final Touches

- [ ] T124 [P] Add JSDoc comments to all custom hooks with usage examples
- [ ] T125 [P] Add JSDoc comments to all service functions
- [ ] T126 Update README.md with build instructions, deployment guide, and feature list
- [ ] T127 [P] Create CONTRIBUTING.md with development setup and coding standards
- [ ] T128 [P] Add screenshots to README.md (home screen, workout builder, timer execution)
- [ ] T129 Run quickstart.md validation flows (create, execute, edit, delete, duplicate)
- [ ] T130 Verify all constitution principles compliance (static-first, mobile-first, performance, accessibility, browser compatibility)

### Optional PWA Enhancement (if time permits)

- [ ] T131 [P] Create manifest.json in public/ for PWA support
- [ ] T132 [P] Add service worker for offline caching (optional)
- [ ] T133 [P] Add install prompt for "Add to Home Screen" functionality

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) completion
- **User Story 4 (Phase 4)**: Depends on Foundational (Phase 2) completion - provides UI for US2
- **User Story 2 (Phase 5)**: Depends on Foundational (Phase 2) and ideally User Story 4 (for navigation)
- **User Story 3 (Phase 6)**: Depends on User Story 2 (Phase 5) - enhances workout execution UI
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Independent - can start immediately after Foundational phase
- **User Story 4 (P4)**: Independent - can start after Foundational phase, provides home screen
- **User Story 2 (P2)**: Soft dependency on US4 for navigation, but core timer logic is independent
- **User Story 3 (P3)**: Hard dependency on US2 - enhances existing workout execution UI

### Recommended Implementation Order

1. **Phase 1 (Setup)** → **Phase 2 (Foundational)** - MUST complete before user stories
2. **Phase 3 (User Story 1)** - Create routines functionality
3. **Phase 4 (User Story 4)** - Routine list and management (home screen)
4. **Phase 5 (User Story 2)** - Workout execution with timer
5. **Phase 6 (User Story 3)** - Visual progress enhancements
6. **Phase 7 (Polish)** - Final improvements and validation

### Parallel Opportunities Per Phase

**Phase 1 (Setup)**:
- T003, T004, T005, T006, T007, T009 can all run in parallel (different config files)

**Phase 2 (Foundational)**:
- T012, T013, T015, T016, T018, T019, T022, T023 can all run in parallel (different files)

**Phase 3 (User Story 1)**:
- T024+T025, T026+T027 can run in parallel (different atomic components)
- T028+T029, T030+T031 can run in parallel (different molecule components)
- T037 can run in parallel with component work

**Phase 4 (User Story 4)**:
- T043+T044 can run in parallel with T045+T046

**Phase 5 (User Story 2)**:
- T057+T058, T059+T060 can run in parallel
- T066, T070, T073 can run in parallel (different hook files)

**Phase 6 (User Story 3)**:
- T089+T090, T092+T093 can run in parallel

**Phase 7 (Polish)**:
- Most tasks in this phase are parallelizable (marked with [P])

---

## Parallel Example: User Story 1

```bash
# Launch all atomic components for User Story 1 together:
Task: "Create Button component in src/components/atoms/Button/Button.tsx"
Task: "Create Button styles in src/components/atoms/Button/Button.module.css"
Task: "Create Input component in src/components/atoms/Input/Input.tsx"
Task: "Create Input styles in src/components/atoms/Input/Input.module.css"

# Launch all molecule components for User Story 1 together:
Task: "Create ExerciseForm component in src/components/molecules/ExerciseForm/ExerciseForm.tsx"
Task: "Create ExerciseForm styles in src/components/molecules/ExerciseForm/ExerciseForm.module.css"
Task: "Create ExerciseCard component in src/components/molecules/ExerciseCard/ExerciseCard.tsx"
Task: "Create ExerciseCard styles in src/components/molecules/ExerciseCard/ExerciseCard.module.css"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 4 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Create routines)
4. Complete Phase 4: User Story 4 (Manage routines)
5. **STOP and VALIDATE**: Test routine creation and management independently
6. Deploy/demo if ready - users can create and organize workout routines

### Full Feature Set (All User Stories)

1. Complete MVP (US1 + US4)
2. Add Phase 5: User Story 2 (Execute workouts) → Test timer accuracy independently
3. Add Phase 6: User Story 3 (Visual progress) → Test enhanced workout UI
4. Complete Phase 7: Polish → Final validation
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Phase 1 (Setup) and Phase 2 (Foundational) together
2. Once Foundational is done:
   - **Developer A**: Phase 3 (User Story 1 - Create routines)
   - **Developer B**: Phase 4 (User Story 4 - Manage routines)
   - After US1+US4 complete:
     - **Developer A**: Phase 5 (User Story 2 - Execute workouts)
     - **Developer B**: Can start Phase 7 (Polish) for completed stories
   - After US2 complete:
     - **Developer A** or **B**: Phase 6 (User Story 3 - Visual progress)
3. Stories integrate naturally without conflicts

---

## Summary

**Total Tasks**: 133 tasks  
**Tasks per User Story**:
- Setup (Phase 1): 10 tasks
- Foundational (Phase 2): 13 tasks
- User Story 1 (P1): 19 tasks
- User Story 4 (P4): 14 tasks
- User Story 2 (P2): 32 tasks
- User Story 3 (P3): 13 tasks
- Polish (Phase 7): 32 tasks

**Parallel Opportunities**: 60+ tasks marked [P] for parallel execution  
**Independent Test Criteria**: Each user story has clear validation scenario in phase header  
**Suggested MVP Scope**: User Stories 1 + 4 (create and manage routines) = 42 tasks after foundational work

**Constitution Compliance**: All tasks align with static-first architecture, mobile-first design, performance standards (60 FPS, <200KB bundle), accessibility (WCAG 2.1 AA), and browser compatibility requirements.

Ready for implementation with `/speckit.implement` command!
