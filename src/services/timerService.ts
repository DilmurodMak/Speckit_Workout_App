/**
 * Timer calculation utilities
 * Based on data-model.md calculations
 */

import type { WorkoutRoutine } from '../types/workout.types';

/**
 * Calculate total duration for one complete cycle
 * @param routine - Workout routine
 * @returns Duration in seconds
 */
export function calculateCycleDuration(routine: WorkoutRoutine): number {
  const exerciseTime = routine.exercises.reduce((sum, ex) => sum + ex.durationSeconds, 0);
  const restTime = (routine.exercises.length - 1) * routine.restSeconds;
  return exerciseTime + restTime;
}

/**
 * Calculate total workout duration (all cycles)
 * @param routine - Workout routine
 * @returns Duration in seconds
 */
export function calculateTotalDuration(routine: WorkoutRoutine): number {
  return calculateCycleDuration(routine) * routine.totalCycles;
}
