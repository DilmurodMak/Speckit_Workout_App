/**
 * TypeScript type definitions for workout routines and exercises
 * Based on data-model.md specifications
 */

/**
 * Represents a single exercise within a workout routine
 */
export interface Exercise {
  /** Unique identifier (UUID or timestamp-based) */
  id: string;
  
  /** Exercise name (e.g., "Push-ups", "Sit-ups") */
  name: string;
  
  /** Exercise duration in seconds (1-999) */
  durationSeconds: number;
  
  /** Position in routine (0-indexed) */
  order: number;
}

/**
 * Represents a complete workout configuration
 */
export interface WorkoutRoutine {
  /** Unique identifier (UUID or timestamp-based) */
  id: string;
  
  /** Routine name (1-50 characters) */
  name: string;
  
  /** List of exercises (ordered by 'order' field) */
  exercises: Exercise[];
  
  /** Rest time between exercises in seconds (0-999) */
  restSeconds: number;
  
  /** Number of repetition cycles (1-99) */
  totalCycles: number;
  
  /** Creation timestamp (Date.now()) */
  createdAt: number;
  
  /** Last modified timestamp (Date.now()) */
  updatedAt: number;
}

/**
 * Extended routine interface with derived/calculated properties
 * (not stored, calculated on-the-fly)
 */
export interface WorkoutRoutineWithDerived extends WorkoutRoutine {
  /** Total duration in seconds for one complete cycle */
  cycleDuration: number;
  
  /** Total workout duration in seconds (all cycles) */
  totalDuration: number;
  
  /** Total number of exercises */
  exerciseCount: number;
}

/**
 * Form data for creating/editing a routine (before ID/timestamps assigned)
 */
export type WorkoutRoutineFormData = Omit<WorkoutRoutine, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Form data for creating/editing an exercise (before ID/order assigned)
 */
export type ExerciseFormData = Omit<Exercise, 'id' | 'order'>;
