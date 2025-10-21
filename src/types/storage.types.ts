/**
 * TypeScript type definitions for LocalStorage data structures
 * Based on data-model.md specifications
 */

import { WorkoutRoutine } from './workout.types';

/**
 * User preferences stored in LocalStorage
 */
export interface UserPreferences {
  /** Enable/disable audio feedback */
  audioEnabled: boolean;
  
  /** ID of last executed routine (for quick access) */
  lastUsedRoutineId: string | null;
}

/**
 * Complete data structure stored in LocalStorage
 * Stored under key: 'workout_timer_data'
 */
export interface StorageData {
  /** Data schema version (for migrations) */
  version: string;
  
  /** Array of all saved workout routines */
  routines: WorkoutRoutine[];
  
  /** User preferences and settings */
  preferences: UserPreferences;
  
  /** Timestamp of last modification (Date.now()) */
  lastModified: number;
}

/**
 * Storage service error types
 */
export type StorageError = 
  | 'QUOTA_EXCEEDED'
  | 'PARSE_ERROR'
  | 'NOT_FOUND'
  | 'INVALID_DATA'
  | 'STORAGE_DISABLED';

/**
 * Storage operation result
 */
export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: StorageError;
  message?: string;
}
