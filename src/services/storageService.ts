/**
 * LocalStorage service for workout routine persistence
 * Based on data-model.md storage schema
 */

import { STORAGE_KEY, STORAGE_VERSION, ERROR_MESSAGES } from '../utils/constants';
import type { StorageData, StorageResult } from '../types/storage.types';

/**
 * Initial storage data structure
 */
const INITIAL_STORAGE_DATA: StorageData = {
  version: STORAGE_VERSION,
  routines: [],
  preferences: {
    audioEnabled: true,
    lastUsedRoutineId: null,
  },
  lastModified: Date.now(),
};

/**
 * Load data from LocalStorage
 * @returns StorageData or null if not found/invalid
 */
export function loadFromStorage(): StorageResult<StorageData> {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    
    if (!serialized) {
      // First time user - initialize with default data
      const initialData = { ...INITIAL_STORAGE_DATA };
      saveToStorage(initialData);
      return { success: true, data: initialData };
    }
    
    const data = JSON.parse(serialized) as StorageData;
    
    // TODO: Handle version migrations if needed
    if (data.version !== STORAGE_VERSION) {
      // For now, just update version
      data.version = STORAGE_VERSION;
      saveToStorage(data);
    }
    
    return { success: true, data };
  } catch (error) {
    if (error instanceof Error && error.name === 'SecurityError') {
      return {
        success: false,
        error: 'STORAGE_DISABLED',
        message: ERROR_MESSAGES.STORAGE_DISABLED,
      };
    }
    
    return {
      success: false,
      error: 'PARSE_ERROR',
      message: ERROR_MESSAGES.STORAGE_PARSE_ERROR,
    };
  }
}

/**
 * Save data to LocalStorage
 * @param data - StorageData to save
 * @returns Success result or error
 */
export function saveToStorage(data: StorageData): StorageResult<void> {
  try {
    data.lastModified = Date.now();
    const serialized = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serialized);
    
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      return {
        success: false,
        error: 'QUOTA_EXCEEDED',
        message: ERROR_MESSAGES.STORAGE_QUOTA_EXCEEDED,
      };
    }
    
    if (error instanceof Error && error.name === 'SecurityError') {
      return {
        success: false,
        error: 'STORAGE_DISABLED',
        message: ERROR_MESSAGES.STORAGE_DISABLED,
      };
    }
    
    return {
      success: false,
      error: 'INVALID_DATA',
      message: 'Failed to save data',
    };
  }
}

/**
 * Clear all storage data
 */
export function clearStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Check if LocalStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}
