/**
 * Application constants and configuration
 */

// ============================================================================
// Storage Configuration
// ============================================================================

/** LocalStorage key for app data */
export const STORAGE_KEY = 'workout_timer_data';

/** Current data schema version */
export const STORAGE_VERSION = '1.0.0';

// ============================================================================
// Validation Limits
// ============================================================================

/** Exercise name constraints */
export const EXERCISE_NAME_MIN_LENGTH = 1;
export const EXERCISE_NAME_MAX_LENGTH = 50;

/** Exercise duration constraints (seconds) */
export const EXERCISE_DURATION_MIN = 1;
export const EXERCISE_DURATION_MAX = 999;

/** Routine name constraints */
export const ROUTINE_NAME_MIN_LENGTH = 1;
export const ROUTINE_NAME_MAX_LENGTH = 50;

/** Rest time constraints (seconds) */
export const REST_TIME_MIN = 0;
export const REST_TIME_MAX = 999;

/** Total cycles constraints */
export const CYCLES_MIN = 1;
export const CYCLES_MAX = 99;

/** Maximum exercises per routine */
export const MAX_EXERCISES_PER_ROUTINE = 20;

// ============================================================================
// Timer Configuration
// ============================================================================

/** Timer update interval (milliseconds) */
export const TIMER_INTERVAL_MS = 100; // Update every 100ms for smooth countdown

/** Acceptable timer drift/accuracy (seconds) */
export const TIMER_ACCURACY_THRESHOLD = 0.5;

/** Countdown duration before workout starts (seconds) */
export const WORKOUT_READY_COUNTDOWN = 5;

// ============================================================================
// Audio Configuration
// ============================================================================

/** Audio file paths */
export const AUDIO_BEEP_PATH = '/sounds/beep.mp3';
export const AUDIO_COMPLETE_PATH = '/sounds/complete.mp3';

/** Default audio enabled state */
export const DEFAULT_AUDIO_ENABLED = true;

/** Default audio volume (0.0 - 1.0) */
export const DEFAULT_AUDIO_VOLUME = 0.8;

// ============================================================================
// UI Configuration
// ============================================================================

/** Minimum touch target size (px) - iOS HIG / WCAG requirement */
export const MIN_TOUCH_TARGET_SIZE = 44;

/** Default animation duration (milliseconds) */
export const ANIMATION_DURATION_MS = 300;

/** Toast notification duration (milliseconds) */
export const TOAST_DURATION_MS = 3000;

// ============================================================================
// Performance Targets
// ============================================================================

/** Target frame rate for animations (FPS) */
export const TARGET_FPS = 60;

/** Maximum acceptable UI response time (milliseconds) */
export const MAX_UI_RESPONSE_TIME_MS = 100;

/** Bundle size targets (kilobytes) */
export const MAX_JS_BUNDLE_SIZE_KB = 150;
export const MAX_CSS_BUNDLE_SIZE_KB = 20;

// ============================================================================
// Accessibility
// ============================================================================

/** ARIA live region politeness setting */
export const ARIA_LIVE_POLITENESS = 'polite' as const;

/** Minimum color contrast ratio (WCAG 2.1 AA) */
export const MIN_CONTRAST_RATIO = 4.5;

// ============================================================================
// Error Messages
// ============================================================================

export const ERROR_MESSAGES = {
  STORAGE_QUOTA_EXCEEDED: 'Storage quota exceeded. Please delete old routines to free up space.',
  STORAGE_DISABLED: 'Browser storage is disabled. Please enable cookies/storage to save data.',
  STORAGE_PARSE_ERROR: 'Failed to load saved data. Data may be corrupted.',
  ROUTINE_NOT_FOUND: 'Routine not found.',
  INVALID_ROUTINE_DATA: 'Invalid routine data. Please check your inputs.',
  VALIDATION_FAILED: 'Validation failed. Please correct the errors and try again.',
} as const;

// ============================================================================
// Success Messages
// ============================================================================

export const SUCCESS_MESSAGES = {
  ROUTINE_CREATED: 'Routine created successfully!',
  ROUTINE_UPDATED: 'Routine updated successfully!',
  ROUTINE_DELETED: 'Routine deleted.',
  ROUTINE_DUPLICATED: 'Routine duplicated successfully!',
  WORKOUT_COMPLETED: 'Workout complete! Great job!',
} as const;
