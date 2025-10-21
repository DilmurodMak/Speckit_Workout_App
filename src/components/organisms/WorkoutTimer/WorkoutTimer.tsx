import React from 'react';
import { WorkoutRoutine } from '../../../types/workout.types';
import { useWorkoutTimer } from '../../../hooks/useWorkoutTimer';
import TimerDisplay from '../../atoms/TimerDisplay/TimerDisplay';
import WorkoutInfo from '../../molecules/WorkoutInfo/WorkoutInfo';
import TimerControls from '../../molecules/TimerControls/TimerControls';
import styles from './WorkoutTimer.module.css';

export interface WorkoutTimerProps {
  routine: WorkoutRoutine;
  onComplete?: () => void;
}

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({ routine, onComplete }) => {
  const {
    session,
    timerState,
    progress,
    start,
    pause,
    resume,
    stop,
  } = useWorkoutTimer(routine);

  // Get current exercise
  const currentExercise = 
    session.currentExerciseIndex < routine.exercises.length
      ? routine.exercises[session.currentExerciseIndex]
      : null;

  // Get next exercise (for rest phase display)
  const nextExerciseIndex = session.currentExerciseIndex + 1;
  const nextExercise = 
    nextExerciseIndex < routine.exercises.length
      ? routine.exercises[nextExerciseIndex]
      : (session.currentCycle < routine.totalCycles)
        ? routine.exercises[0] // First exercise of next cycle
        : null; // Workout complete

  // Determine which exercise to show based on phase
  const displayExercise = session.currentPhase === 'rest' ? nextExercise : currentExercise;

  // Handle complete
  const handleStop = () => {
    stop();
    if (onComplete) {
      onComplete();
    }
  };

  // Check if workout is complete
  const isComplete = session.status === 'completed';

  // Show start button only when ready (not started)
  const showStart = session.status === 'ready';

  return (
    <div className={styles.container}>
      <div className={styles.timer}>
        <TimerDisplay
          timeRemaining={timerState.timeRemaining}
          phase={session.currentPhase}
        />
      </div>

      <div className={styles.info}>
        <WorkoutInfo
          currentExercise={displayExercise}
          progress={progress}
          phase={session.currentPhase}
        />
      </div>

      <div className={styles.controls}>
        <TimerControls
          isRunning={timerState.isRunning}
          isPaused={timerState.isPaused}
          isComplete={isComplete}
          onStart={start}
          onPause={pause}
          onResume={resume}
          onStop={handleStop}
          showStart={showStart}
        />
      </div>
    </div>
  );
};

export default WorkoutTimer;
