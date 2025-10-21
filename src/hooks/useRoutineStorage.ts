import { useState, useEffect, useCallback } from 'react';
import {
  WorkoutRoutine,
  WorkoutRoutineFormData,
  WorkoutRoutineWithDerived,
  Exercise,
} from '../types/workout.types';
import { StorageData } from '../types/storage.types';
import {
  loadFromStorage,
  saveToStorage,
} from '../services/storageService';
import {
  calculateCycleDuration,
  calculateTotalDuration,
} from '../services/timerService';
import { generateId } from '../utils/generateId';
import { ERROR_MESSAGES } from '../utils/constants';

export interface UseRoutineStorageReturn {
  routines: WorkoutRoutineWithDerived[];
  isLoading: boolean;
  error: string | null;
  createRoutine: (data: WorkoutRoutineFormData) => Promise<WorkoutRoutine>;
  updateRoutine: (
    id: string,
    data: WorkoutRoutineFormData
  ) => Promise<WorkoutRoutine>;
  deleteRoutine: (id: string) => Promise<void>;
  getRoutine: (id: string) => WorkoutRoutineWithDerived | undefined;
  clearError: () => void;
}

/**
 * Custom hook for managing workout routines in LocalStorage
 */
export function useRoutineStorage(): UseRoutineStorageReturn {
  const [routines, setRoutines] = useState<WorkoutRoutineWithDerived[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load routines from storage on mount
  useEffect(() => {
    loadRoutines();
  }, []);

  const loadRoutines = useCallback(() => {
    setIsLoading(true);
    setError(null);

    const result = loadFromStorage();

    if (!result.success) {
      setError(result.message || 'Failed to load routines from storage');
      setRoutines([]);
      setIsLoading(false);
      return;
    }

    const routinesWithDerived = (result.data?.routines || []).map(
      (routine) => ({
        ...routine,
        cycleDuration: calculateCycleDuration(routine),
        totalDuration: calculateTotalDuration(routine),
        exerciseCount: routine.exercises.length,
      })
    );

    setRoutines(routinesWithDerived);
    setIsLoading(false);
  }, []);

  const saveRoutines = useCallback(
    (updatedRoutines: WorkoutRoutine[]): boolean => {
      const result = loadFromStorage();
      if (!result.success || !result.data) {
        setError('Failed to load current data');
        return false;
      }

      const storageData: StorageData = {
        ...result.data,
        routines: updatedRoutines,
        lastModified: Date.now(),
      };

      const saveResult = saveToStorage(storageData);
      if (!saveResult.success) {
        setError(saveResult.message || 'Failed to save routines to storage');
        return false;
      }

      return true;
    },
    []
  );

  const createRoutine = useCallback(
    async (data: WorkoutRoutineFormData): Promise<WorkoutRoutine> => {
      setError(null);

      const now = Date.now();
      
      // Create exercises with proper IDs and order
      const exercises: Exercise[] = data.exercises.map((ex, index) => ({
        ...ex,
        id: ex.id || generateId('exercise'),
        order: index,
      }));

      const newRoutine: WorkoutRoutine = {
        id: generateId('routine'),
        name: data.name,
        exercises,
        restSeconds: data.restSeconds,
        totalCycles: data.totalCycles,
        createdAt: now,
        updatedAt: now,
      };

      const currentRoutines = routines.map((r) => {
        // Remove derived properties
        const { cycleDuration, totalDuration, exerciseCount, ...routine } = r;
        return routine;
      });

      const updatedRoutines = [...currentRoutines, newRoutine];

      if (!saveRoutines(updatedRoutines)) {
        throw new Error('Failed to save routine');
      }

      // Reload to get derived properties
      loadRoutines();

      return newRoutine;
    },
    [routines, saveRoutines, loadRoutines]
  );

  const updateRoutine = useCallback(
    async (
      id: string,
      data: WorkoutRoutineFormData
    ): Promise<WorkoutRoutine> => {
      setError(null);

      const existingRoutine = routines.find((r) => r.id === id);
      if (!existingRoutine) {
        const errorMsg = ERROR_MESSAGES.ROUTINE_NOT_FOUND;
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      // Create exercises with proper IDs and order
      const exercises: Exercise[] = data.exercises.map((ex, index) => ({
        ...ex,
        id: ex.id || generateId('exercise'),
        order: index,
      }));

      const updatedRoutine: WorkoutRoutine = {
        ...existingRoutine,
        name: data.name,
        exercises,
        restSeconds: data.restSeconds,
        totalCycles: data.totalCycles,
        updatedAt: Date.now(),
      };

      const currentRoutines = routines.map((r) => {
        // Remove derived properties
        const { cycleDuration, totalDuration, exerciseCount, ...routine } = r;
        return routine;
      });

      const updatedRoutines = currentRoutines.map((r) =>
        r.id === id ? updatedRoutine : r
      );

      if (!saveRoutines(updatedRoutines)) {
        throw new Error('Failed to update routine');
      }

      // Reload to get derived properties
      loadRoutines();

      return updatedRoutine;
    },
    [routines, saveRoutines, loadRoutines]
  );

  const deleteRoutine = useCallback(
    async (id: string): Promise<void> => {
      setError(null);

      const currentRoutines = routines.map((r) => {
        // Remove derived properties
        const { cycleDuration, totalDuration, exerciseCount, ...routine } = r;
        return routine;
      });

      const updatedRoutines = currentRoutines.filter((r) => r.id !== id);

      if (!saveRoutines(updatedRoutines)) {
        throw new Error('Failed to delete routine');
      }

      // Reload to update state
      loadRoutines();
    },
    [routines, saveRoutines, loadRoutines]
  );

  const getRoutine = useCallback(
    (id: string): WorkoutRoutineWithDerived | undefined => {
      return routines.find((r) => r.id === id);
    },
    [routines]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    routines,
    isLoading,
    error,
    createRoutine,
    updateRoutine,
    deleteRoutine,
    getRoutine,
    clearError,
  };
}
