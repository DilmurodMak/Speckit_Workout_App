# Quickstart: Workout Timer App

**Phase**: 1 - User Flows & Test Scenarios  
**Date**: 2025-10-17  
**Purpose**: Document complete user journeys with step-by-step interactions and test validation

---

## User Flow 1: Create First Workout Routine

**Goal**: New user creates their first custom workout routine

**Prerequisites**: 
- App loaded successfully
- No existing routines (first-time user)

**Steps**:

1. **Landing on Home Screen**
   - **Action**: User opens app
   - **Expected**: See empty state with "No routines yet" message
   - **Expected**: See prominent "Create Your First Workout" button
   - **Test**: Verify button has minimum 44x44px touch target

2. **Navigate to Workout Builder**
   - **Action**: User taps "Create Your First Workout" button
   - **Expected**: Navigate to `/create` route
   - **Expected**: See workout builder form with empty fields
   - **Expected**: See "Add Exercise" button enabled
   - **Expected**: See "Save Routine" button disabled (no exercises yet)
   - **Test**: Verify form inputs are accessible and focusable

3. **Enter Routine Name**
   - **Action**: User taps "Routine Name" input
   - **Action**: User types "Morning Cardio"
   - **Expected**: Input displays typed text
   - **Expected**: Character counter shows "14/50" below input
   - **Test**: Verify max length of 50 characters enforced

4. **Add First Exercise (Push-ups)**
   - **Action**: User taps "Add Exercise" button
   - **Expected**: New exercise form appears
   - **Expected**: Focus automatically moves to exercise name input
   - **Action**: User types "Push-ups"
   - **Action**: User taps duration input
   - **Action**: User enters "30"
   - **Expected**: Duration shows "30 seconds"
   - **Test**: Verify numeric keyboard appears on mobile
   - **Test**: Verify values 1-999 accepted, outside range rejected

5. **Add Second Exercise (Sit-ups)**
   - **Action**: User taps "Add Exercise" button again
   - **Expected**: Second exercise form appears below first
   - **Expected**: First exercise is saved and shows in list view
   - **Action**: User enters "Sit-ups" for name
   - **Action**: User enters "45" for duration
   - **Expected**: Exercise added to list

6. **Add Third Exercise (Pull-ups)**
   - **Action**: User adds third exercise
   - **Action**: User enters "Pull-ups" / "20" seconds
   - **Expected**: Three exercises now visible in list
   - **Expected**: Each shows exercise name and duration badge

7. **Configure Rest Time**
   - **Action**: User scrolls to "Rest Between Exercises" input
   - **Action**: User taps input (shows default "0")
   - **Action**: User enters "10"
   - **Expected**: Input shows "10 seconds"
   - **Test**: Verify 0-999 range

8. **Configure Total Cycles**
   - **Action**: User taps "Total Cycles" input (shows default "1")
   - **Action**: User enters "3"
   - **Expected**: Input shows "3 cycles"
   - **Expected**: Preview shows "Total Duration: 5m 50s" (calculated)
   - **Test**: Verify calculation: (30+45+20 + 2×10) × 3 = 345 seconds = 5:45

9. **Preview Workout**
   - **Expected**: Preview panel shows:
     - Routine name: "Morning Cardio"
     - 3 exercises listed with durations
     - Rest time: 10 seconds
     - Total cycles: 3
     - Total duration: 5m 45s
   - **Expected**: Visual progress bar shows cycle structure
   - **Test**: Verify all entered data displays correctly

10. **Save Routine**
    - **Action**: User taps "Save Routine" button
    - **Expected**: Button shows loading state briefly
    - **Expected**: Success message: "Routine saved!"
    - **Expected**: Navigate back to Home (`/`)
    - **Expected**: See saved routine in list
    - **Test**: Verify routine persists in LocalStorage
    - **Test**: Verify routine has unique ID, timestamps

**Success Criteria**:
- ✅ User completes routine creation in under 2 minutes
- ✅ Routine persists across page refresh
- ✅ All validation rules enforced (1-50 chars, 1-999 seconds, 1-99 cycles)
- ✅ No console errors during flow
- ✅ Lighthouse accessibility score 90+

---

## User Flow 2: Execute Workout

**Goal**: User starts and completes a saved workout routine

**Prerequisites**:
- Routine "Morning Cardio" exists (3 exercises, 10s rest, 3 cycles)
- Total duration: 5m 45s

**Steps**:

1. **Select Routine from Home**
   - **Action**: User taps "Morning Cardio" routine card
   - **Expected**: Card highlights on tap
   - **Expected**: Bottom sheet appears with options:
     - "Start Workout" (primary button)
     - "Edit" (secondary)
     - "Duplicate" (secondary)
     - "Delete" (danger)
   - **Action**: User taps "Start Workout"
   - **Expected**: Navigate to `/workout/routine_abc123`
   - **Expected**: Workout executor screen loads

2. **Workout Ready Screen**
   - **Expected**: See routine name at top: "Morning Cardio"
   - **Expected**: See "Get Ready!" message
   - **Expected**: See countdown: "Starting in 5..."
   - **Expected**: See first exercise preview: "Up next: Push-ups (30s)"
   - **Expected**: Countdown decreases: 4, 3, 2, 1...
   - **Test**: Verify countdown accuracy with stopwatch

3. **First Exercise Begins (Push-ups, 30s)**
   - **Expected**: Countdown reaches 0, transition to exercise
   - **Expected**: Play audio beep (if audio enabled)
   - **Expected**: Screen shows:
     - Phase indicator: "WORK" (green)
     - Exercise name: "Push-ups"
     - Large timer: "00:30"
     - Progress: "Exercise 1 of 3"
     - Progress: "Round 1 of 3"
     - Overall progress bar: ~5% complete
   - **Expected**: Timer counts down: 29, 28, 27...
   - **Test**: Verify 60 FPS animation (no jank)
   - **Test**: Verify timer accuracy ±0.5s over 30s

4. **First Rest Period (10s)**
   - **Expected**: Timer reaches 0, transition to rest
   - **Expected**: Play audio beep
   - **Expected**: Screen shows:
     - Phase indicator: "REST" (yellow/orange)
     - Message: "Next: Sit-ups"
     - Large timer: "00:10"
     - Progress indicators update
   - **Expected**: Timer counts down: 9, 8, 7...
   - **Test**: Verify automatic transition (no button press needed)

5. **Second Exercise (Sit-ups, 45s)**
   - **Expected**: Rest timer reaches 0, transition to exercise
   - **Expected**: Play audio beep
   - **Expected**: Screen shows:
     - Phase indicator: "WORK"
     - Exercise name: "Sit-ups"
     - Large timer: "00:45"
     - Progress: "Exercise 2 of 3"
     - Progress: "Round 1 of 3"
   - **Expected**: Timer counts down from 45

6. **User Pauses Workout**
   - **Action**: User taps "Pause" button (at 20s remaining)
   - **Expected**: Timer stops immediately
   - **Expected**: Button changes to "Resume"
   - **Expected**: Screen shows paused state (grayed overlay optional)
   - **Expected**: Timer stays at "00:20" (frozen)
   - **Test**: Verify timer doesn't continue in background

7. **User Resumes Workout**
   - **Action**: User waits 5 seconds (real time)
   - **Action**: User taps "Resume" button
   - **Expected**: Countdown continues from "00:20"
   - **Expected**: No time lost during pause
   - **Expected**: Button changes back to "Pause"
   - **Test**: Verify resumed timer accuracy

8. **Second Rest Period (10s)**
   - **Expected**: Automatic transition after sit-ups complete
   - **Expected**: "REST" / "Next: Pull-ups"
   - **Expected**: Progress: "Round 1 of 3" (still first cycle)

9. **Third Exercise (Pull-ups, 20s)**
   - **Expected**: Automatic transition
   - **Expected**: "WORK" / "Pull-ups"
   - **Expected**: Progress: "Exercise 3 of 3"
   - **Expected**: Progress: "Round 1 of 3"
   - **Expected**: Overall progress: ~33% (1 cycle done soon)

10. **First Cycle Complete, Start Second Cycle**
    - **Expected**: Pull-ups timer reaches 0
    - **Expected**: Play audio beep
    - **Expected**: Brief "Cycle 1 Complete!" message (2 seconds)
    - **Expected**: Automatic transition to next cycle
    - **Expected**: Back to first exercise: "Push-ups"
    - **Expected**: Progress: "Exercise 1 of 3" / "Round 2 of 3"
    - **Expected**: Overall progress: ~35%
    - **Test**: Verify seamless cycle transition

11. **Continue Through Cycles 2 and 3**
    - **Expected**: Same pattern repeats for cycles 2 and 3
    - **Expected**: Progress indicators update correctly
    - **Expected**: Overall progress bar advances smoothly
    - **Test**: Verify total time matches expected ~5m 45s

12. **Workout Completion**
    - **Expected**: Final exercise (Pull-ups, Round 3) completes
    - **Expected**: Play completion sound (longer, celebratory)
    - **Expected**: Transition to completion screen
    - **Expected**: Screen shows:
      - "Workout Complete! 🎉"
      - "Morning Cardio"
      - "Total Time: 5m 52s" (includes pauses)
      - "Exercises Completed: 9"
      - "Cycles Completed: 3"
      - Motivational message: "Great job!"
    - **Expected**: Buttons: [Done] [Repeat Workout]
    - **Test**: Verify completion triggers correctly

13. **Return to Home**
    - **Action**: User taps "Done" button
    - **Expected**: Navigate to `/` (home)
    - **Expected**: See "Morning Cardio" routine in list
    - **Expected**: Routine card shows "Last completed: Just now"
    - **Test**: Verify session state cleared

**Success Criteria**:
- ✅ Timer accuracy within ±0.5 seconds over full workout
- ✅ All automatic transitions work without user input
- ✅ Pause/resume preserves exact timer state
- ✅ Audio feedback plays at each transition (if enabled)
- ✅ Progress indicators accurate throughout
- ✅ 60 FPS maintained during countdown animations
- ✅ Wake lock keeps screen on (if supported)

---

## User Flow 3: Edit Existing Routine

**Goal**: User modifies a saved workout routine

**Prerequisites**:
- Routine "Morning Cardio" exists with 3 exercises

**Steps**:

1. **Access Edit Mode**
   - **Action**: On Home, user long-presses "Morning Cardio" card (or taps 3-dot menu)
   - **Expected**: Context menu appears
   - **Action**: User taps "Edit"
   - **Expected**: Navigate to `/edit/routine_abc123`
   - **Expected**: Workout builder loads with existing data pre-filled
   - **Test**: Verify all fields populated correctly

2. **Modify Routine Name**
   - **Action**: User taps routine name input (shows "Morning Cardio")
   - **Action**: User selects all text and types "Morning Strength"
   - **Expected**: Input updates to "Morning Strength"

3. **Update First Exercise Duration**
   - **Action**: User taps first exercise (Push-ups, 30s)
   - **Expected**: Exercise expands or opens edit modal
   - **Action**: User changes duration from 30 to 45
   - **Expected**: Duration updates to 45 seconds
   - **Expected**: Total duration recalculates

4. **Add Fourth Exercise**
   - **Action**: User taps "Add Exercise" button
   - **Expected**: New exercise form appears at end of list
   - **Action**: User enters "Burpees" / 60 seconds
   - **Expected**: Fourth exercise added
   - **Expected**: Total duration updates to reflect new exercise

5. **Reorder Exercises**
   - **Action**: User drags "Burpees" exercise (or taps up arrow)
   - **Action**: User moves it to position 2 (between Push-ups and Sit-ups)
   - **Expected**: Exercise list reorders
   - **Expected**: Order indicators update (1, 2, 3, 4)
   - **Test**: Verify drag-and-drop smooth on touch devices

6. **Delete Third Exercise**
   - **Action**: User taps delete icon on "Sit-ups" exercise
   - **Expected**: Confirmation dialog: "Delete this exercise?"
   - **Action**: User confirms deletion
   - **Expected**: "Sit-ups" removed from list
   - **Expected**: Remaining exercises renumbered
   - **Expected**: Total duration recalculates

7. **Update Rest Time and Cycles**
   - **Action**: User changes rest time from 10 to 15 seconds
   - **Action**: User changes cycles from 3 to 5
   - **Expected**: Preview updates with new totals
   - **Expected**: New total duration displayed

8. **Save Changes**
   - **Action**: User taps "Save Changes" button
   - **Expected**: Confirmation: "Routine updated!"
   - **Expected**: Navigate back to Home
   - **Expected**: Updated routine appears in list with new name
   - **Expected**: Shows "Last modified: Just now"
   - **Test**: Verify changes persisted in LocalStorage

**Success Criteria**:
- ✅ All modifications save correctly
- ✅ Reordering works smoothly
- ✅ Total duration updates in real-time
- ✅ Deletion requires confirmation
- ✅ Original routine overwritten (not duplicated)

---

## User Flow 4: Delete Routine

**Goal**: User removes an unwanted routine

**Prerequisites**:
- Multiple routines exist in list

**Steps**:

1. **Initiate Delete**
   - **Action**: User swipes left on "Morning Strength" card (iOS pattern)
   - **Alternative**: User taps 3-dot menu → Delete
   - **Expected**: Delete button appears or confirmation modal opens

2. **Confirm Deletion**
   - **Expected**: Confirmation dialog:
     - "Delete 'Morning Strength'?"
     - "This action cannot be undone."
     - [Cancel] [Delete] buttons
   - **Action**: User taps "Delete" button
   - **Expected**: Routine removed from list immediately
   - **Expected**: Show snackbar/toast: "Routine deleted"
   - **Optional**: Undo button in toast (3 seconds)

3. **Verify Deletion Persists**
   - **Action**: User refreshes page (or reopens app)
   - **Expected**: Deleted routine does not reappear
   - **Test**: Verify removed from LocalStorage

**Success Criteria**:
- ✅ Deletion requires explicit confirmation
- ✅ Routine removed immediately on confirm
- ✅ Deletion persists across sessions
- ✅ (Optional) Undo available for 3 seconds

---

## User Flow 5: Duplicate Routine

**Goal**: User creates copy of existing routine to modify

**Prerequisites**:
- Routine "Morning Strength" exists

**Steps**:

1. **Initiate Duplicate**
   - **Action**: User opens context menu on "Morning Strength"
   - **Action**: User taps "Duplicate"
   - **Expected**: New routine created instantly
   - **Expected**: Name: "Morning Strength (Copy)"
   - **Expected**: All exercises, timings copied exactly
   - **Expected**: New unique ID assigned
   - **Expected**: Current timestamp for createdAt/updatedAt

2. **Verify Duplicate in List**
   - **Expected**: Both routines appear in list
   - **Expected**: Copy shows same exercise count and duration
   - **Expected**: Copy has "(Copy)" suffix in name

3. **Edit Duplicate Independently**
   - **Action**: User edits the "(Copy)" routine
   - **Action**: User changes name to "Evening Workout"
   - **Action**: User modifies exercises
   - **Expected**: Changes only affect the duplicate
   - **Expected**: Original "Morning Strength" unchanged
   - **Test**: Verify both routines independent in storage

**Success Criteria**:
- ✅ Duplicate creates exact copy with new ID
- ✅ Duplicate appears immediately in list
- ✅ Modifications to duplicate don't affect original

---

## Edge Case Testing Scenarios

### Test 1: Minimum Values
- **Setup**: Create routine with 1 exercise, 1 second duration, 0 rest, 1 cycle
- **Expected**: Form accepts values
- **Expected**: Workout executes correctly (very short)
- **Expected**: Timer displays "00:01" and counts down accurately

### Test 2: Maximum Values
- **Setup**: Create routine with 20 exercises, 999 seconds each, 999 rest, 99 cycles
- **Expected**: Form accepts values (no UI crash)
- **Expected**: Total duration calculates correctly
- **Expected**: Exercise list scrolls smoothly
- **Expected**: Workout can be started (though impractical)

### Test 3: Empty Routine Name
- **Action**: Attempt to save routine with empty name field
- **Expected**: Validation error: "Routine name is required"
- **Expected**: Save button remains disabled or shows error

### Test 4: No Exercises
- **Action**: Attempt to save routine with name but no exercises
- **Expected**: Validation error: "Add at least one exercise"
- **Expected**: Save button disabled

### Test 5: Invalid Duration (letters)
- **Action**: Type "abc" in duration field
- **Expected**: Input rejects non-numeric characters (numeric keyboard on mobile)
- **Expected**: Or shows validation error on blur

### Test 6: Screen Lock During Workout
- **Action**: Start workout, lock device screen after 30 seconds
- **Expected**: Timer continues in background
- **Action**: Unlock screen after 20 seconds
- **Expected**: Timer displays correct current time (50 seconds elapsed total)
- **Test**: Verify with stopwatch

### Test 7: Browser Tab Backgrounded
- **Action**: Start workout, switch to different browser tab
- **Expected**: Timer continues (setInterval keeps running)
- **Action**: Return to tab after 30 seconds
- **Expected**: Timer caught up to correct time

### Test 8: Audio Disabled
- **Action**: Mute audio in settings/preferences
- **Action**: Start workout
- **Expected**: No audio plays at transitions
- **Expected**: Visual feedback still works (no errors)

### Test 9: LocalStorage Full
- **Setup**: Fill LocalStorage to quota limit (fill with dummy data)
- **Action**: Attempt to create new routine
- **Expected**: Error message: "Storage full. Delete old routines."
- **Expected**: App doesn't crash
- **Test**: Verify graceful degradation

### Test 10: Long Exercise Names
- **Action**: Enter 50-character exercise name: "This is a very long exercise name that reaches max"
- **Expected**: Input accepts up to 50 characters
- **Expected**: Name truncates in card view with ellipsis
- **Expected**: Full name visible on hover/tap

---

## Accessibility Testing Scenarios

### Test 1: Keyboard Navigation
- **Action**: Tab through entire Create Routine form
- **Expected**: All inputs, buttons focusable
- **Expected**: Clear focus indicators visible
- **Expected**: Tab order logical (name → exercises → rest → cycles → save)

### Test 2: Screen Reader (VoiceOver/TalkBack)
- **Action**: Navigate workout execution screen with screen reader
- **Expected**: Timer announces time updates (aria-live="polite")
- **Expected**: Exercise names announced
- **Expected**: Phase changes announced ("Work" → "Rest")
- **Expected**: Progress indicators have aria-label

### Test 3: Color Contrast
- **Test**: Use contrast checker on all text/background combinations
- **Expected**: All combinations meet WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large)
- **Examples**:
  - Timer display: white on dark gray
  - Exercise names: dark text on white cards
  - "WORK" badge: white on green (verify sufficient contrast)

### Test 4: Focus Management
- **Action**: Open confirmation dialog, press Escape
- **Expected**: Dialog closes, focus returns to trigger button
- **Action**: Save routine, navigate back
- **Expected**: Focus on newly created routine card

---

## Performance Testing Scenarios

### Test 1: Bundle Size
- **Action**: Build production bundle
- **Expected**: Total JavaScript < 150KB (gzipped)
- **Expected**: Total CSS < 20KB (gzipped)
- **Test**: Use `npm run build` and check dist/ folder sizes

### Test 2: Initial Load Time
- **Action**: Open app on mobile 3G network (throttled)
- **Expected**: First Contentful Paint < 1.5 seconds
- **Expected**: Time to Interactive < 3 seconds
- **Test**: Use Chrome DevTools Network throttling

### Test 3: Lighthouse Audit
- **Action**: Run Lighthouse on production build
- **Expected**: Performance score ≥ 90
- **Expected**: Accessibility score ≥ 90
- **Expected**: Best Practices score ≥ 90
- **Expected**: SEO score ≥ 90 (if applicable)

### Test 4: Animation Performance
- **Action**: Start workout, monitor with DevTools Performance panel
- **Expected**: 60 FPS during timer countdown
- **Expected**: No long tasks (>50ms)
- **Expected**: No jank on phase transitions

---

## Cross-Browser Testing Matrix

| Browser | Version | Tests | Status |
|---------|---------|-------|--------|
| Chrome | 110+ | All flows + edge cases | ✅ |
| Firefox | 109+ | All flows + edge cases | ✅ |
| Safari (iOS) | 16+ | All flows + audio edge cases | ⚠️ Test audio policies |
| Edge | 110+ | All flows | ✅ |
| Chrome (Android) | 110+ | All flows + touch gestures | ✅ |

**Critical iOS Safari Tests**:
- Audio playback after user interaction
- Wake Lock API (may not be supported)
- Timer accuracy when backgrounded

---

## Summary

**User Flows Documented**: 5 primary flows (create, execute, edit, delete, duplicate)  
**Test Scenarios**: 10 edge cases, 4 accessibility tests, 4 performance tests  
**Cross-Browser Matrix**: 5 browsers targeted  
**Success Criteria**: All flows meet spec.md acceptance scenarios

All documented flows align with user stories from spec.md. Ready for task breakdown with `/speckit.tasks`.
