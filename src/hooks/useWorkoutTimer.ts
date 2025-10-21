import { useState, useEffect, useRef, useCallback } from 'react';
import {
  WorkoutSession,
  TimerState,
  SessionStatus,
  PhaseType,
  WorkoutProgress,
} from '../types/timer.types';
import { WorkoutRoutine } from '../types/workout.types';
import { TIMER_INTERVAL_MS } from '../utils/constants';
import { playBeep, playComplete, initializeAudio } from '../services/audioService';
import { generateId } from '../utils/generateId';

export interface UseWorkoutTimerReturn {
  session: WorkoutSession;
  timerState: TimerState;
  progress: WorkoutProgress;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  isComplete: boolean;
}

/**
 * Custom hook for managing workout timer state and logic
 */
export function useWorkoutTimer(routine: WorkoutRoutine): UseWorkoutTimerReturn {
  const [session, setSession] = useState<WorkoutSession>(() => ({
    id: generateId('session'),
    routineId: routine.id,
    currentCycle: 1,
    currentExerciseIndex: 0,
    currentPhase: 'exercise' as PhaseType,
    status: 'ready' as SessionStatus,
    startTime: null,
    pausedAt: null,
    totalPausedDuration: 0,
    completedAt: null,
  }));

  const [timerState, setTimerState] = useState<TimerState>(() => ({
    timeRemaining: routine.exercises[0]?.durationSeconds || 0,
    isRunning: false,
    isPaused: false,
    initialTime: routine.exercises[0]?.durationSeconds || 0,
  }));

  const intervalRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());
  const [isComplete, setIsComplete] = useState(false);

  // Calculate progress
  const progress: WorkoutProgress = {
    currentCycle: session.currentCycle,
    totalCycles: routine.totalCycles,
    currentExerciseIndex: session.currentExerciseIndex,
    totalExercises: routine.exercises.length,
    completedExercises: 
      (session.currentCycle - 1) * routine.exercises.length + 
      session.currentExerciseIndex + 
      (session.currentPhase === 'rest' ? 1 : 0),
    percentComplete:
      ((session.currentCycle - 1) * routine.exercises.length + 
       session.currentExerciseIndex + 
       (session.currentPhase === 'rest' ? 1 : 0)) /
      (routine.totalCycles * routine.exercises.length) * 100,
  };

  // Get current exercise
  const getCurrentExercise = useCallback(() => {
    return routine.exercises[session.currentExerciseIndex];
  }, [routine.exercises, session.currentExerciseIndex]);

  // Transition to next phase
  const transitionToNextPhase = useCallback(() => {
    const currentExercise = getCurrentExercise();

    if (session.status === 'ready') {
      // Ready -> Exercise (first exercise, no beep)
      setSession((prev) => ({
        ...prev,
        currentPhase: 'exercise' as PhaseType,
        status: 'running' as SessionStatus,
        startTime: prev.startTime || Date.now(),
      }));
      setTimerState((prev) => ({
        ...prev,
        timeRemaining: currentExercise.durationSeconds,
        initialTime: currentExercise.durationSeconds,
      }));
    } else if (session.currentPhase === 'exercise') {
      // Exercise -> Rest (no beep here, was played at 3s warning)
      const isLastExercise = session.currentExerciseIndex === routine.exercises.length - 1;
      const isLastCycle = session.currentCycle === routine.totalCycles;

      if (isLastExercise && isLastCycle) {
        // Workout complete
        setSession((prev) => ({ 
          ...prev, 
          status: 'completed' as SessionStatus, 
          currentPhase: 'exercise' as PhaseType,
          completedAt: Date.now(),
        }));
        setTimerState((prev) => ({ ...prev, isRunning: false, timeRemaining: 0 }));
        setIsComplete(true);
        playComplete();
        return;
      }

      // Move to rest phase
      setSession((prev) => ({
        ...prev,
        currentPhase: 'rest' as PhaseType,
      }));
      setTimerState((prev) => ({
        ...prev,
        timeRemaining: routine.restSeconds,
        initialTime: routine.restSeconds,
      }));
    } else if (session.currentPhase === 'rest') {
      // Rest -> Exercise (no beep here, was played at 3s warning)
      const isLastExercise = session.currentExerciseIndex === routine.exercises.length - 1;

      if (isLastExercise) {
        // Start new cycle
        setSession((prev) => ({
          ...prev,
          currentCycle: prev.currentCycle + 1,
          currentExerciseIndex: 0,
          currentPhase: 'exercise' as PhaseType,
        }));
        const firstExercise = routine.exercises[0];
        setTimerState((prev) => ({
          ...prev,
          timeRemaining: firstExercise.durationSeconds,
          initialTime: firstExercise.durationSeconds,
        }));
      } else {
        // Next exercise
        setSession((prev) => ({
          ...prev,
          currentExerciseIndex: prev.currentExerciseIndex + 1,
          currentPhase: 'exercise' as PhaseType,
        }));
        const nextExercise = routine.exercises[session.currentExerciseIndex + 1];
        setTimerState((prev) => ({
          ...prev,
          timeRemaining: nextExercise.durationSeconds,
          initialTime: nextExercise.durationSeconds,
        }));
      }
    }
  }, [session, routine, getCurrentExercise]);

  // Track if beep has been played for current phase
  const beepPlayedRef = useRef(false);

  // Timer tick
  const tick = useCallback(() => {
    const now = Date.now();
    const delta = (now - lastTickRef.current) / 1000; // Convert to seconds
    lastTickRef.current = now;

    setTimerState((prev) => {
      const newTimeRemaining = Math.max(0, prev.timeRemaining - delta);

      // Play beep 3 seconds before transition (warning sound)
      if (newTimeRemaining <= 3 && newTimeRemaining > 0 && !beepPlayedRef.current) {
        playBeep();
        beepPlayedRef.current = true;
      }

      if (newTimeRemaining === 0) {
        // Time's up, transition to next phase (no sound here)
        setTimeout(() => {
          transitionToNextPhase();
          beepPlayedRef.current = false; // Reset for next phase
        }, 0);
        return { ...prev, timeRemaining: 0 };
      }

      return { ...prev, timeRemaining: newTimeRemaining };
    });
  }, [transitionToNextPhase]);

  // Start timer
  const start = useCallback(() => {
    initializeAudio(); // Initialize audio on user interaction
    
    setSession((prev) => ({
      ...prev,
      status: 'running' as SessionStatus,
      startTime: prev.startTime || Date.now(),
    }));
    setTimerState((prev) => ({
      ...prev,
      isRunning: true,
      isPaused: false,
    }));
    lastTickRef.current = Date.now();
  }, []);

  // Pause timer
  const pause = useCallback(() => {
    const now = Date.now();
    setSession((prev) => ({
      ...prev,
      status: 'paused' as SessionStatus,
      pausedAt: now,
      totalPausedDuration: prev.totalPausedDuration + (prev.pausedAt ? now - prev.pausedAt : 0),
    }));
    setTimerState((prev) => ({
      ...prev,
      isRunning: false,
      isPaused: true,
    }));
  }, []);

  // Resume timer
  const resume = useCallback(() => {
    setSession((prev) => ({
      ...prev,
      status: 'running' as SessionStatus,
      pausedAt: null,
    }));
    setTimerState((prev) => ({
      ...prev,
      isRunning: true,
      isPaused: false,
    }));
    lastTickRef.current = Date.now();
  }, []);

  // Stop timer
  const stop = useCallback(() => {
    setSession((prev) => ({
      ...prev,
      status: 'stopped' as SessionStatus,
    }));
    setTimerState((prev) => ({
      ...prev,
      isRunning: false,
      isPaused: false,
    }));
    
    // Reset to initial state
    setSession({
      id: generateId('session'),
      routineId: routine.id,
      currentCycle: 1,
      currentExerciseIndex: 0,
      currentPhase: 'exercise' as PhaseType,
      status: 'ready' as SessionStatus,
      startTime: null,
      pausedAt: null,
      totalPausedDuration: 0,
      completedAt: null,
    });
    setTimerState({
      timeRemaining: routine.exercises[0]?.durationSeconds || 0,
      isRunning: false,
      isPaused: false,
      initialTime: routine.exercises[0]?.durationSeconds || 0,
    });
    setIsComplete(false);
  }, [routine]);

  // Effect: Run timer interval when active
  useEffect(() => {
    if (timerState.isRunning) {
      intervalRef.current = setInterval(tick, TIMER_INTERVAL_MS);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isRunning, tick]);

  return {
    session,
    timerState,
    progress,
    start,
    pause,
    resume,
    stop,
    isComplete,
  };
}
