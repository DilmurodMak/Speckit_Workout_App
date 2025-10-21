/**
 * Validation service for workout data
 * Based on data-model.md validation rules
 */

import {
  EXERCISE_NAME_MIN_LENGTH,
  EXERCISE_NAME_MAX_LENGTH,
  EXERCISE_DURATION_MIN,
  EXERCISE_DURATION_MAX,
  ROUTINE_NAME_MIN_LENGTH,
  ROUTINE_NAME_MAX_LENGTH,
  REST_TIME_MIN,
  REST_TIME_MAX,
  CYCLES_MIN,
  CYCLES_MAX,
  MAX_EXERCISES_PER_ROUTINE,
} from '../utils/constants';
import type { Exercise, WorkoutRoutine } from '../types/workout.types';

/**
 * Validation error result
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validate exercise data
 * @param exercise - Partial exercise object to validate
 * @returns Validation result with any errors
 */
export function validateExercise(exercise: Partial<Exercise>): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate name
  if (!exercise.name || exercise.name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: 'Exercise name is required',
    });
  } else if (exercise.name.trim().length < EXERCISE_NAME_MIN_LENGTH) {
    errors.push({
      field: 'name',
      message: `Exercise name must be at least ${EXERCISE_NAME_MIN_LENGTH} character`,
    });
  } else if (exercise.name.length > EXERCISE_NAME_MAX_LENGTH) {
    errors.push({
      field: 'name',
      message: `Exercise name must be ${EXERCISE_NAME_MAX_LENGTH} characters or less`,
    });
  }

  // Validate duration
  if (exercise.durationSeconds === undefined || exercise.durationSeconds === null) {
    errors.push({
      field: 'durationSeconds',
      message: 'Duration is required',
    });
  } else if (!Number.isInteger(exercise.durationSeconds)) {
    errors.push({
      field: 'durationSeconds',
      message: 'Duration must be a whole number',
    });
  } else if (exercise.durationSeconds < EXERCISE_DURATION_MIN) {
    errors.push({
      field: 'durationSeconds',
      message: `Duration must be at least ${EXERCISE_DURATION_MIN} second`,
    });
  } else if (exercise.durationSeconds > EXERCISE_DURATION_MAX) {
    errors.push({
      field: 'durationSeconds',
      message: `Duration must be ${EXERCISE_DURATION_MAX} seconds or less`,
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate workout routine data
 * @param routine - Partial routine object to validate
 * @returns Validation result with any errors
 */
export function validateRoutine(routine: Partial<WorkoutRoutine>): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate routine name
  if (!routine.name || routine.name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: 'Routine name is required',
    });
  } else if (routine.name.trim().length < ROUTINE_NAME_MIN_LENGTH) {
    errors.push({
      field: 'name',
      message: `Routine name must be at least ${ROUTINE_NAME_MIN_LENGTH} character`,
    });
  } else if (routine.name.length > ROUTINE_NAME_MAX_LENGTH) {
    errors.push({
      field: 'name',
      message: `Routine name must be ${ROUTINE_NAME_MAX_LENGTH} characters or less`,
    });
  }

  // Validate exercises
  if (!routine.exercises || routine.exercises.length === 0) {
    errors.push({
      field: 'exercises',
      message: 'At least one exercise is required',
    });
  } else {
    if (routine.exercises.length > MAX_EXERCISES_PER_ROUTINE) {
      errors.push({
        field: 'exercises',
        message: `Maximum ${MAX_EXERCISES_PER_ROUTINE} exercises allowed per routine`,
      });
    }

    // Validate each exercise
    routine.exercises.forEach((exercise, index) => {
      const exerciseValidation = validateExercise(exercise);
      exerciseValidation.errors.forEach((error) => {
        errors.push({
          field: `exercises[${index}].${error.field}`,
          message: `Exercise ${index + 1}: ${error.message}`,
        });
      });
    });
  }

  // Validate rest time
  if (routine.restSeconds === undefined || routine.restSeconds === null) {
    errors.push({
      field: 'restSeconds',
      message: 'Rest time is required',
    });
  } else if (!Number.isInteger(routine.restSeconds)) {
    errors.push({
      field: 'restSeconds',
      message: 'Rest time must be a whole number',
    });
  } else if (routine.restSeconds < REST_TIME_MIN) {
    errors.push({
      field: 'restSeconds',
      message: `Rest time must be ${REST_TIME_MIN} or greater`,
    });
  } else if (routine.restSeconds > REST_TIME_MAX) {
    errors.push({
      field: 'restSeconds',
      message: `Rest time must be ${REST_TIME_MAX} seconds or less`,
    });
  }

  // Validate total cycles
  if (routine.totalCycles === undefined || routine.totalCycles === null) {
    errors.push({
      field: 'totalCycles',
      message: 'Total cycles is required',
    });
  } else if (!Number.isInteger(routine.totalCycles)) {
    errors.push({
      field: 'totalCycles',
      message: 'Total cycles must be a whole number',
    });
  } else if (routine.totalCycles < CYCLES_MIN) {
    errors.push({
      field: 'totalCycles',
      message: `Total cycles must be at least ${CYCLES_MIN}`,
    });
  } else if (routine.totalCycles > CYCLES_MAX) {
    errors.push({
      field: 'totalCycles',
      message: `Total cycles must be ${CYCLES_MAX} or less`,
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate numeric input within range
 * @param value - Value to validate
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @param fieldName - Field name for error message
 * @returns Validation error or null if valid
 */
export function validateNumberRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): ValidationError | null {
  if (!Number.isFinite(value)) {
    return {
      field: fieldName,
      message: `${fieldName} must be a valid number`,
    };
  }

  if (value < min) {
    return {
      field: fieldName,
      message: `${fieldName} must be at least ${min}`,
    };
  }

  if (value > max) {
    return {
      field: fieldName,
      message: `${fieldName} must be ${max} or less`,
    };
  }

  return null;
}

/**
 * Validate string length
 * @param value - String to validate
 * @param min - Minimum length
 * @param max - Maximum length
 * @param fieldName - Field name for error message
 * @returns Validation error or null if valid
 */
export function validateStringLength(
  value: string,
  min: number,
  max: number,
  fieldName: string
): ValidationError | null {
  const trimmed = value.trim();

  if (trimmed.length < min) {
    return {
      field: fieldName,
      message: `${fieldName} must be at least ${min} character${min > 1 ? 's' : ''}`,
    };
  }

  if (value.length > max) {
    return {
      field: fieldName,
      message: `${fieldName} must be ${max} characters or less`,
    };
  }

  return null;
}
