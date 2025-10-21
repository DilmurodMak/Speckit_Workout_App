/**
 * TypeScript type definitions for timer and workout session state
 * Based on data-model.md specifications
 */

/**
 * Phase type during workout execution
 */
export type PhaseType = 'exercise' | 'rest';

/**
 * Workout session status
 */
export type SessionStatus = 'ready' | 'running' | 'paused' | 'completed' | 'stopped';

/**
 * Represents the current countdown timer status
 * Used by useTimer hook
 */
export interface TimerState {
  /** Seconds remaining in current phase */
  timeRemaining: number;
  
  /** Is timer currently counting down */
  isRunning: boolean;
  
  /** Is timer paused (can be resumed) */
  isPaused: boolean;
  
  /** Starting time for current phase (for reset) */
  initialTime: number;
}

/**
 * Represents an active or completed workout execution
 * Tracks full workout session state
 */
export interface WorkoutSession {
  /** Unique session identifier */
  id: string;
  
  /** Reference to WorkoutRoutine being executed */
  routineId: string;
  
  /** Current session state */
  status: SessionStatus;
  
  /** Current cycle (1-indexed for UI, e.g., "Round 2 of 3") */
  currentCycle: number;
  
  /** Current exercise (0-indexed) */
  currentExerciseIndex: number;
  
  /** Current phase ('exercise' or 'rest') */
  currentPhase: PhaseType;
  
  /** Session start timestamp (Date.now()) */
  startTime: number | null;
  
  /** Timestamp when paused (for calculating elapsed time) */
  pausedAt: number | null;
  
  /** Accumulated pause time in milliseconds */
  totalPausedDuration: number;
  
  /** Completion timestamp */
  completedAt: number | null;
}

/**
 * Progress metrics for workout session
 * Calculated values exposed by useWorkoutSession hook
 */
export interface WorkoutProgress {
  /** Current cycle number (1-indexed) */
  currentCycle: number;
  
  /** Total cycles in routine */
  totalCycles: number;
  
  /** Current exercise index (0-indexed) */
  currentExerciseIndex: number;
  
  /** Total exercises in one cycle */
  totalExercises: number;
  
  /** Overall completion percentage (0-100) */
  percentComplete: number;
  
  /** Total exercises completed across all cycles */
  completedExercises: number;
}

/**
 * Timer controls for workout execution
 * Return type of timer-related operations
 */
export interface TimerControls {
  /** Time remaining in current phase (seconds) */
  timeRemaining: number;
  
  /** Is timer currently running */
  isRunning: boolean;
  
  /** Is timer paused */
  isPaused: boolean;
  
  /** Start/resume countdown */
  start: () => void;
  
  /** Pause countdown */
  pause: () => void;
  
  /** Resume after pause */
  resume: () => void;
  
  /** Reset to initial time */
  reset: () => void;
  
  /** Stop and clear timer */
  stop: () => void;
  
  /** Set new time value */
  setTime: (seconds: number) => void;
}
