# Component Contracts: Workout Timer App

**Phase**: 1 - Component Interfaces & Props  
**Date**: 2025-10-17  
**Purpose**: Define TypeScript interfaces for all React components and custom hooks

---

## Component Hierarchy

```
App
├── MainLayout
│   ├── Navigation
│   └── Pages (Router)
│       ├── Home
│       │   ├── RoutineList
│       │   │   └── RoutineCard (multiple)
│       │   └── Button (Create New)
│       │
│       ├── CreateRoutine / EditRoutine
│       │   ├── WorkoutBuilder
│       │   │   ├── Input (Routine Name)
│       │   │   ├── ExerciseForm (multiple)
│       │   │   │   ├── Input (Exercise Name)
│       │   │   │   ├── Input (Duration)
│       │   │   │   └── Button (Delete)
│       │   │   ├── Input (Rest Time)
│       │   │   ├── Input (Total Cycles)
│       │   │   └── Button (Add Exercise, Save)
│       │   │
│       │   └── WorkoutPreview
│       │       └── ProgressBar
│       │
│       └── ExecuteWorkout
│           ├── WorkoutExecutor
│           │   ├── Timer (large display)
│           │   ├── ExerciseCard (current)
│           │   ├── ProgressBar
│           │   ├── TimerControls
│           │   │   ├── Button (Pause/Resume)
│           │   │   └── Button (Stop)
│           │   └── WorkoutStats
│           └── CompletionScreen
```

---

## Atomic Components (Atoms)

### Button

**Purpose**: Reusable button component with variants

```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
  icon?: React.ReactNode;
  className?: string;
}

// Usage example
<Button 
  variant="primary" 
  size="large" 
  onClick={handleStart}
  ariaLabel="Start workout"
>
  Start Workout
</Button>
```

---

### Input

**Purpose**: Reusable text/number input field

```typescript
interface InputProps {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'email';
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  inputMode?: 'text' | 'numeric';
  ariaLabel?: string;
}

// Usage example
<Input
  id="exercise-duration"
  label="Duration (seconds)"
  type="number"
  value={duration}
  onChange={setDuration}
  min={1}
  max={999}
  required
  inputMode="numeric"
  helperText="Enter workout duration"
/>
```

---

### Timer

**Purpose**: Large countdown timer display

```typescript
interface TimerProps {
  timeRemaining: number;          // Seconds remaining
  totalTime: number;              // Total time for current phase
  phase: 'exercise' | 'rest';     // Current phase type
  isRunning: boolean;             // Animation state
  size?: 'small' | 'medium' | 'large';
}

// Usage example
<Timer
  timeRemaining={25}
  totalTime={30}
  phase="exercise"
  isRunning={true}
  size="large"
/>

// Display format: "00:25" (MM:SS)
// Shows circular progress ring around time
// Different colors for exercise (green) vs rest (yellow)
```

---

## Molecule Components

### ExerciseForm

**Purpose**: Form to add/edit a single exercise

```typescript
interface ExerciseFormProps {
  exercise?: Exercise;              // Existing exercise (edit mode) or undefined (create mode)
  onSave: (exercise: Omit<Exercise, 'id' | 'order'>) => void;
  onCancel: () => void;
  onDelete?: () => void;            // Only in edit mode
  index: number;                    // Position in list (for display)
  errors?: Record<string, string>;  // Validation errors
}

// Usage example
<ExerciseForm
  exercise={exercises[0]}
  onSave={handleUpdateExercise}
  onDelete={handleDeleteExercise}
  onCancel={() => setEditingIndex(null)}
  index={0}
/>
```

---

### ExerciseCard

**Purpose**: Display single exercise (read-only or interactive)

```typescript
interface ExerciseCardProps {
  exercise: Exercise;
  variant: 'list' | 'current' | 'upcoming';
  onEdit?: () => void;              // Optional edit handler
  onDelete?: () => void;            // Optional delete handler
  onReorder?: (direction: 'up' | 'down') => void; // Optional reorder handler
  isActive?: boolean;               // Highlight as current exercise
  showDuration?: boolean;           // Show duration badge
}

// Usage examples

// In routine list (editable)
<ExerciseCard
  exercise={exercise}
  variant="list"
  onEdit={() => handleEdit(exercise.id)}
  onDelete={() => handleDelete(exercise.id)}
  onReorder={handleReorder}
  showDuration={true}
/>

// During workout (current exercise)
<ExerciseCard
  exercise={currentExercise}
  variant="current"
  isActive={true}
/>

// During workout (upcoming exercise)
<ExerciseCard
  exercise={nextExercise}
  variant="upcoming"
/>
```

---

### TimerControls

**Purpose**: Pause/Resume/Stop buttons during workout

```typescript
interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  disabled?: boolean;
}

// Usage example
<TimerControls
  isRunning={session.status === 'running'}
  isPaused={session.status === 'paused'}
  onPause={handlePause}
  onResume={handleResume}
  onStop={handleStop}
/>

// Shows: [Pause] [Stop] when running
// Shows: [Resume] [Stop] when paused
```

---

### ProgressBar

**Purpose**: Visual progress indicator

```typescript
interface ProgressBarProps {
  current: number;                  // Current value
  total: number;                    // Total value
  label?: string;                   // Optional label text
  showPercentage?: boolean;         // Show "X%" text
  variant?: 'linear' | 'circular';  // Display style
  color?: 'primary' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  ariaLabel: string;                // Required for accessibility
}

// Usage examples

// Linear progress (exercises)
<ProgressBar
  current={currentExerciseIndex + 1}
  total={routine.exercises.length}
  label="Exercise"
  showPercentage={false}
  variant="linear"
  ariaLabel="Exercise progress"
/>

// Circular progress (overall workout)
<ProgressBar
  current={completedExercises}
  total={totalExercises}
  variant="circular"
  showPercentage={true}
  ariaLabel="Workout progress"
/>
```

---

## Organism Components

### RoutineList

**Purpose**: Display all saved routines

```typescript
interface RoutineListProps {
  routines: WorkoutRoutine[];
  onSelectRoutine: (routineId: string) => void;
  onEditRoutine: (routineId: string) => void;
  onDeleteRoutine: (routineId: string) => void;
  onDuplicateRoutine: (routineId: string) => void;
  isLoading?: boolean;
  emptyStateMessage?: string;
}

// Usage example
<RoutineList
  routines={savedRoutines}
  onSelectRoutine={handleStartWorkout}
  onEditRoutine={handleEdit}
  onDeleteRoutine={handleDelete}
  onDuplicateRoutine={handleDuplicate}
/>
```

---

### RoutineCard

**Purpose**: Single routine card in list

```typescript
interface RoutineCardProps {
  routine: WorkoutRoutine;
  onSelect: () => void;             // Start workout
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  showActions?: boolean;            // Show edit/delete/duplicate buttons
}

// Usage example
<RoutineCard
  routine={routine}
  onSelect={() => startWorkout(routine.id)}
  onEdit={() => navigateToEdit(routine.id)}
  onDelete={() => confirmDelete(routine.id)}
  onDuplicate={() => duplicateRoutine(routine.id)}
  showActions={true}
/>

// Displays:
// - Routine name
// - Exercise count
// - Total duration
// - Last modified date
// - Action buttons (play, edit, delete, duplicate)
```

---

### WorkoutBuilder

**Purpose**: Create/edit workout routine form

```typescript
interface WorkoutBuilderProps {
  initialRoutine?: WorkoutRoutine;  // Existing routine (edit mode)
  onSave: (routine: Omit<WorkoutRoutine, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

// Usage example
<WorkoutBuilder
  initialRoutine={existingRoutine}
  onSave={handleSaveRoutine}
  onCancel={handleCancel}
  mode="edit"
/>

// Manages internal state:
// - Routine name input
// - List of exercises (can add/remove/reorder)
// - Rest time input
// - Total cycles input
// - Form validation
```

---

### WorkoutExecutor

**Purpose**: Main workout execution interface

```typescript
interface WorkoutExecutorProps {
  routine: WorkoutRoutine;
  onComplete: () => void;
  onStop: () => void;
  initialCycle?: number;            // Resume from specific cycle (optional)
  initialExerciseIndex?: number;    // Resume from specific exercise (optional)
}

// Usage example
<WorkoutExecutor
  routine={selectedRoutine}
  onComplete={handleWorkoutComplete}
  onStop={handleWorkoutStop}
/>

// Manages:
// - WorkoutSession state
// - Timer countdown
// - Automatic phase transitions
// - Audio feedback
// - Progress tracking
// - Pause/resume/stop controls
```

---

### WorkoutStats

**Purpose**: Display workout statistics during/after execution

```typescript
interface WorkoutStatsProps {
  session: WorkoutSession;
  routine: WorkoutRoutine;
  currentExercise: Exercise | null;
  nextExercise: Exercise | null;
  variant: 'live' | 'summary';      // Live (during workout) or summary (after completion)
}

// Usage example (during workout)
<WorkoutStats
  session={currentSession}
  routine={routine}
  currentExercise={getCurrentExercise()}
  nextExercise={getNextExercise()}
  variant="live"
/>

// Displays:
// - Current cycle (e.g., "Round 2 of 3")
// - Current exercise (e.g., "Exercise 2 of 3")
// - Next exercise preview
// - Elapsed time
// - Estimated time remaining
```

---

### CompletionScreen

**Purpose**: Workout completion celebration screen

```typescript
interface CompletionScreenProps {
  routine: WorkoutRoutine;
  session: WorkoutSession;
  totalDuration: number;            // Actual elapsed time in seconds
  onClose: () => void;              // Return to home
  onRepeat: () => void;             // Start same workout again
}

// Usage example
<CompletionScreen
  routine={completedRoutine}
  session={completedSession}
  totalDuration={elapsedSeconds}
  onClose={() => navigate('/home')}
  onRepeat={() => startWorkout(routine.id)}
/>

// Displays:
// - "Workout Complete!" message
// - Total time
// - Total exercises completed
// - Total cycles completed
// - Motivational message
// - Actions: [Close] [Repeat Workout]
```

---

## Custom Hook Contracts

### useTimer

**Purpose**: Countdown timer logic

```typescript
interface UseTimerOptions {
  initialSeconds: number;
  onComplete?: () => void;          // Callback when timer reaches 0
  autoStart?: boolean;              // Start immediately
}

interface UseTimerReturn {
  timeRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  stop: () => void;
  setTime: (seconds: number) => void;
}

// Usage example
const timer = useTimer({
  initialSeconds: 30,
  onComplete: handlePhaseComplete,
  autoStart: false
});

// Access: timer.timeRemaining, timer.start(), etc.
```

---

### useWorkoutSession

**Purpose**: Manage complete workout execution

```typescript
interface UseWorkoutSessionOptions {
  routine: WorkoutRoutine;
  onComplete: () => void;
  onPhaseChange?: (phase: PhaseType, exercise?: Exercise) => void;
  audioEnabled?: boolean;
}

interface UseWorkoutSessionReturn {
  session: WorkoutSession;
  currentExercise: Exercise | null;
  nextExercise: Exercise | null;
  progress: {
    currentCycle: number;
    totalCycles: number;
    currentExerciseIndex: number;
    totalExercises: number;
    percentComplete: number;
    completedExercises: number;
  };
  timer: {
    timeRemaining: number;
    isRunning: boolean;
  };
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

// Usage example
const workout = useWorkoutSession({
  routine: selectedRoutine,
  onComplete: handleComplete,
  onPhaseChange: playTransitionSound,
  audioEnabled: true
});

// Access: workout.session, workout.currentExercise, workout.start(), etc.
```

---

### useRoutineStorage

**Purpose**: LocalStorage CRUD operations for routines

```typescript
interface UseRoutineStorageReturn {
  routines: WorkoutRoutine[];
  isLoading: boolean;
  error: string | null;
  createRoutine: (routine: Omit<WorkoutRoutine, 'id' | 'createdAt' | 'updatedAt'>) => Promise<WorkoutRoutine>;
  updateRoutine: (id: string, updates: Partial<WorkoutRoutine>) => Promise<void>;
  deleteRoutine: (id: string) => Promise<void>;
  duplicateRoutine: (id: string) => Promise<WorkoutRoutine>;
  getRoutine: (id: string) => WorkoutRoutine | undefined;
  clearAll: () => Promise<void>;
}

// Usage example
const {
  routines,
  isLoading,
  createRoutine,
  updateRoutine,
  deleteRoutine
} = useRoutineStorage();

// Create new routine
const newRoutine = await createRoutine({
  name: "Morning Workout",
  exercises: [...],
  restSeconds: 10,
  totalCycles: 3
});
```

---

### useAudioFeedback

**Purpose**: Audio playback management

```typescript
interface UseAudioFeedbackOptions {
  enabled?: boolean;                // Enable/disable audio
  volume?: number;                  // 0.0 - 1.0
}

interface UseAudioFeedbackReturn {
  isEnabled: boolean;
  isMuted: boolean;
  isLoading: boolean;
  playTransition: () => Promise<void>;    // Beep for phase transitions
  playComplete: () => Promise<void>;      // Sound for workout completion
  toggleMute: () => void;
  setVolume: (volume: number) => void;
}

// Usage example
const audio = useAudioFeedback({
  enabled: true,
  volume: 0.8
});

// Play sound on phase transition
useEffect(() => {
  if (phaseChanged) {
    audio.playTransition();
  }
}, [phaseChanged]);
```

---

### useWakeLock

**Purpose**: Prevent screen sleep during workouts

```typescript
interface UseWakeLockReturn {
  isSupported: boolean;             // Is API available in browser
  isLocked: boolean;                // Is screen wake lock active
  requestLock: () => Promise<void>;
  releaseLock: () => Promise<void>;
  error: string | null;
}

// Usage example
const wakeLock = useWakeLock();

// Request lock when workout starts
useEffect(() => {
  if (workoutStarted && wakeLock.isSupported) {
    wakeLock.requestLock();
  }
  
  return () => {
    wakeLock.releaseLock();
  };
}, [workoutStarted]);
```

---

## Routing Structure

```typescript
// React Router v6 routes
const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'create',
        element: <CreateRoutine />
      },
      {
        path: 'edit/:routineId',
        element: <EditRoutine />
      },
      {
        path: 'workout/:routineId',
        element: <ExecuteWorkout />
      }
    ]
  }
];

// URL examples:
// /                          -> Home (routine list)
// /create                    -> Create new routine
// /edit/routine_abc123       -> Edit existing routine
// /workout/routine_abc123    -> Execute workout
```

---

## Event Handlers

### Common Patterns

```typescript
// Button click (no parameters)
const handleClick = () => void;

// Form submission
const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => void;

// Input change
const handleChange = (value: string) => void;

// Generic action with ID
const handleAction = (id: string) => void;

// Reorder items
const handleReorder = (fromIndex: number, toIndex: number) => void;

// Delete with confirmation
const handleDelete = (id: string) => {
  if (confirm('Are you sure?')) {
    deleteRoutine(id);
  }
};
```

---

## Summary

**Component Architecture**: Atomic design pattern (atoms → molecules → organisms)  
**Type Safety**: All components have strict TypeScript interfaces  
**Hook Contracts**: Custom hooks encapsulate business logic with clear return types  
**Props**: Explicit prop interfaces with JSDoc comments  
**Event Handlers**: Consistent naming patterns (handle*, on*)

All component contracts support the requirements from spec.md and data-model.md. Ready to proceed to quickstart documentation and task breakdown.
