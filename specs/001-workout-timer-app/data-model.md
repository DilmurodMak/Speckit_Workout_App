# Data Model: Workout Timer App

**Phase**: 1 - Data Structures & State Management  
**Date**: 2025-10-17  
**Purpose**: Define TypeScript interfaces, data structures, and state management approach

---

## Core Data Entities

### 1. Exercise

Represents a single exercise within a workout routine.

```typescript
interface Exercise {
  id: string;                    // Unique identifier (UUID)
  name: string;                  // Exercise name (e.g., "Push-ups")
  durationSeconds: number;       // Exercise duration (1-999 seconds)
  order: number;                 // Position in routine (0-indexed)
}
```

**Validation Rules**:
- `name`: Required, 1-50 characters, trimmed
- `durationSeconds`: Required, integer, min 1, max 999
- `order`: Required, non-negative integer

**Example**:
```typescript
{
  id: "ex_1a2b3c4d",
  name: "Push-ups",
  durationSeconds: 30,
  order: 0
}
```

---

### 2. WorkoutRoutine

Represents a complete workout configuration.

```typescript
interface WorkoutRoutine {
  id: string;                    // Unique identifier (UUID)
  name: string;                  // Routine name
  exercises: Exercise[];         // List of exercises (ordered)
  restSeconds: number;           // Rest time between exercises (0-999 seconds)
  totalCycles: number;           // Number of repetition cycles (1-99)
  createdAt: number;             // Creation timestamp (Date.now())
  updatedAt: number;             // Last modified timestamp (Date.now())
}
```

**Validation Rules**:
- `name`: Required, 1-50 characters, trimmed
- `exercises`: Required, minimum 1 exercise
- `restSeconds`: Required, integer, min 0, max 999
- `totalCycles`: Required, integer, min 1, max 99

**Example**:
```typescript
{
  id: "routine_a1b2c3d4",
  name: "Morning Workout",
  exercises: [
    { id: "ex_1", name: "Push-ups", durationSeconds: 30, order: 0 },
    { id: "ex_2", name: "Sit-ups", durationSeconds: 45, order: 1 },
    { id: "ex_3", name: "Pull-ups", durationSeconds: 20, order: 2 }
  ],
  restSeconds: 10,
  totalCycles: 3,
  createdAt: 1697529600000,
  updatedAt: 1697529600000
}
```

**Derived Properties** (calculated, not stored):
```typescript
interface WorkoutRoutineWithDerived extends WorkoutRoutine {
  // Total duration in seconds (one complete cycle)
  cycleDuration: number;
  
  // Total workout duration in seconds (all cycles)
  totalDuration: number;
  
  // Total number of exercises
  exerciseCount: number;
}

// Calculation functions
function calculateCycleDuration(routine: WorkoutRoutine): number {
  const exerciseTime = routine.exercises.reduce((sum, ex) => sum + ex.durationSeconds, 0);
  const restTime = (routine.exercises.length - 1) * routine.restSeconds;
  return exerciseTime + restTime;
}

function calculateTotalDuration(routine: WorkoutRoutine): number {
  return calculateCycleDuration(routine) * routine.totalCycles;
}
```

---

### 3. WorkoutSession

Represents an active or completed workout execution.

```typescript
type PhaseType = 'exercise' | 'rest';
type SessionStatus = 'ready' | 'running' | 'paused' | 'completed' | 'stopped';

interface WorkoutSession {
  id: string;                    // Unique session identifier
  routineId: string;             // Reference to WorkoutRoutine
  status: SessionStatus;         // Current session state
  
  // Progress tracking
  currentCycle: number;          // Current cycle (1-indexed for UI, e.g., "Round 2 of 3")
  currentExerciseIndex: number;  // Current exercise (0-indexed)
  currentPhase: PhaseType;       // 'exercise' or 'rest'
  
  // Timing
  startTime: number | null;      // Session start timestamp (Date.now())
  pausedAt: number | null;       // Timestamp when paused (for calculating elapsed time)
  totalPausedDuration: number;   // Accumulated pause time in milliseconds
  
  // Metadata
  completedAt: number | null;    // Completion timestamp
}
```

**State Transitions**:
```
ready → running → paused → running → ... → completed
         ↓
       stopped
```

**Example (in progress)**:
```typescript
{
  id: "session_x1y2z3",
  routineId: "routine_a1b2c3d4",
  status: "running",
  currentCycle: 2,               // On round 2 of 3
  currentExerciseIndex: 1,       // On 2nd exercise (sit-ups)
  currentPhase: "exercise",      // Currently doing exercise (not rest)
  startTime: 1697529600000,
  pausedAt: null,
  totalPausedDuration: 15000,    // 15 seconds of previous pause time
  completedAt: null
}
```

---

### 4. TimerState

Represents the current countdown timer status (used by `useTimer` hook).

```typescript
interface TimerState {
  timeRemaining: number;         // Seconds remaining in current phase
  isRunning: boolean;            // Is timer currently counting down
  isPaused: boolean;             // Is timer paused (can be resumed)
  initialTime: number;           // Starting time for current phase (for reset)
}
```

**Example**:
```typescript
{
  timeRemaining: 25,             // 25 seconds left in current exercise
  isRunning: true,
  isPaused: false,
  initialTime: 30                // Exercise was 30 seconds total
}
```

---

## State Management Architecture

### Local Component State (useState)

Used for UI-only state that doesn't need to be shared:

```typescript
// Example: Form input state
const [exerciseName, setExerciseName] = useState('');
const [duration, setDuration] = useState(30);

// Example: Modal visibility
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

// Example: Audio mute preference
const [isMuted, setIsMuted] = useState(false);
```

### Custom Hooks (Encapsulated State)

Business logic state managed in custom hooks:

#### `useTimer(initialSeconds: number)`
```typescript
interface UseTimerReturn {
  timeRemaining: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  stop: () => void;
}

// Internal state
const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
const [isRunning, setIsRunning] = useState(false);
const intervalRef = useRef<number | null>(null);
```

#### `useWorkoutSession(routine: WorkoutRoutine)`
```typescript
interface UseWorkoutSessionReturn {
  session: WorkoutSession;
  currentExercise: Exercise | null;
  progress: {
    completedExercises: number;
    totalExercises: number;
    completedCycles: number;
    totalCycles: number;
    percentComplete: number;
  };
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

// Manages WorkoutSession state
const [session, setSession] = useState<WorkoutSession>(initialSession);

// Uses useTimer internally
const timer = useTimer(getCurrentPhaseDuration());

// Handles automatic transitions
useEffect(() => {
  if (timer.timeRemaining === 0) {
    transitionToNextPhase();
  }
}, [timer.timeRemaining]);
```

#### `useRoutineStorage()`
```typescript
interface UseRoutineStorageReturn {
  routines: WorkoutRoutine[];
  isLoading: boolean;
  error: string | null;
  createRoutine: (routine: Omit<WorkoutRoutine, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRoutine: (id: string, updates: Partial<WorkoutRoutine>) => void;
  deleteRoutine: (id: string) => void;
  getRoutine: (id: string) => WorkoutRoutine | undefined;
}

// Syncs with LocalStorage
const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);

useEffect(() => {
  // Load from LocalStorage on mount
  const stored = loadFromStorage();
  setRoutines(stored);
}, []);

useEffect(() => {
  // Save to LocalStorage whenever routines change
  saveToStorage(routines);
}, [routines]);
```

### Context API (Optional - Not Required for MVP)

If global state becomes complex, consider React Context:

```typescript
// Only if needed for deeply nested components
interface AppContextValue {
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const AppContext = createContext<AppContextValue | null>(null);
```

**Decision**: Start without Context. Use prop drilling for 2-3 levels. Add Context only if component tree becomes too deep.

---

## LocalStorage Schema

### Storage Key
```typescript
const STORAGE_KEY = 'workout_timer_data';
```

### Stored Data Structure
```typescript
interface StorageData {
  version: string;               // Data schema version (for migrations)
  routines: WorkoutRoutine[];    // Array of all saved routines
  preferences: {
    audioEnabled: boolean;       // User preference for sound effects
    lastUsedRoutineId: string | null; // Last executed routine
  };
  lastModified: number;          // Timestamp of last change
}
```

### Storage Operations

#### Save to LocalStorage
```typescript
function saveToStorage(data: StorageData): void {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      // Handle storage quota exceeded
      console.error('LocalStorage quota exceeded');
    }
    throw error;
  }
}
```

#### Load from LocalStorage
```typescript
function loadFromStorage(): StorageData | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    
    const data = JSON.parse(serialized) as StorageData;
    
    // Validate schema version and migrate if needed
    if (data.version !== CURRENT_VERSION) {
      return migrateData(data);
    }
    
    return data;
  } catch (error) {
    console.error('Failed to load from storage:', error);
    return null;
  }
}
```

#### Initial Data (First Launch)
```typescript
const INITIAL_STORAGE_DATA: StorageData = {
  version: '1.0.0',
  routines: [],                  // Empty routine list
  preferences: {
    audioEnabled: true,
    lastUsedRoutineId: null
  },
  lastModified: Date.now()
};
```

---

## Data Validation

### Validation Functions

```typescript
// Validate exercise input
function validateExercise(exercise: Partial<Exercise>): string[] {
  const errors: string[] = [];
  
  if (!exercise.name || exercise.name.trim().length === 0) {
    errors.push('Exercise name is required');
  } else if (exercise.name.length > 50) {
    errors.push('Exercise name must be 50 characters or less');
  }
  
  if (exercise.durationSeconds === undefined || exercise.durationSeconds < 1) {
    errors.push('Duration must be at least 1 second');
  } else if (exercise.durationSeconds > 999) {
    errors.push('Duration must be 999 seconds or less');
  }
  
  return errors;
}

// Validate routine input
function validateRoutine(routine: Partial<WorkoutRoutine>): string[] {
  const errors: string[] = [];
  
  if (!routine.name || routine.name.trim().length === 0) {
    errors.push('Routine name is required');
  } else if (routine.name.length > 50) {
    errors.push('Routine name must be 50 characters or less');
  }
  
  if (!routine.exercises || routine.exercises.length === 0) {
    errors.push('At least one exercise is required');
  } else {
    routine.exercises.forEach((ex, index) => {
      const exErrors = validateExercise(ex);
      exErrors.forEach(err => errors.push(`Exercise ${index + 1}: ${err}`));
    });
  }
  
  if (routine.restSeconds === undefined || routine.restSeconds < 0) {
    errors.push('Rest time must be 0 or greater');
  } else if (routine.restSeconds > 999) {
    errors.push('Rest time must be 999 seconds or less');
  }
  
  if (routine.totalCycles === undefined || routine.totalCycles < 1) {
    errors.push('Total cycles must be at least 1');
  } else if (routine.totalCycles > 99) {
    errors.push('Total cycles must be 99 or less');
  }
  
  return errors;
}
```

---

## Type Guards

```typescript
// Check if value is a valid WorkoutRoutine
function isWorkoutRoutine(value: unknown): value is WorkoutRoutine {
  if (typeof value !== 'object' || value === null) return false;
  
  const obj = value as Record<string, unknown>;
  
  return (
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    Array.isArray(obj.exercises) &&
    typeof obj.restSeconds === 'number' &&
    typeof obj.totalCycles === 'number' &&
    typeof obj.createdAt === 'number' &&
    typeof obj.updatedAt === 'number'
  );
}

// Check if value is a valid Exercise
function isExercise(value: unknown): value is Exercise {
  if (typeof value !== 'object' || value === null) return false;
  
  const obj = value as Record<string, unknown>;
  
  return (
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.durationSeconds === 'number' &&
    typeof obj.order === 'number'
  );
}
```

---

## Data Migration Strategy

### Version 1.0.0 → 1.1.0 Example

```typescript
function migrateData(data: StorageData): StorageData {
  const currentVersion = data.version;
  
  // Example: Adding new field to routines
  if (currentVersion === '1.0.0') {
    return {
      ...data,
      version: '1.1.0',
      routines: data.routines.map(routine => ({
        ...routine,
        // Add new field with default value
        description: ''
      }))
    };
  }
  
  return data;
}
```

---

## Summary

**Data Entities**: Exercise, WorkoutRoutine, WorkoutSession, TimerState  
**State Management**: Local component state + custom hooks (no global state needed)  
**Persistence**: LocalStorage with JSON serialization  
**Validation**: Runtime validation functions for all user input  
**Type Safety**: TypeScript interfaces, type guards, strict mode enabled

All data structures support the requirements from spec.md. Ready to proceed to contracts and quickstart documentation.
