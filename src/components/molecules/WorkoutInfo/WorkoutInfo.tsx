import React from 'react';
import { Exercise } from '../../../types/workout.types';
import { WorkoutProgress } from '../../../types/timer.types';
import styles from './WorkoutInfo.module.css';

export interface WorkoutInfoProps {
  currentExercise: Exercise | null;
  progress: WorkoutProgress;
  phase: 'exercise' | 'rest';
}

const WorkoutInfo: React.FC<WorkoutInfoProps> = ({
  currentExercise,
  progress,
  phase,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${progress.percentComplete}%` }}
            role="progressbar"
            aria-valuenow={Math.round(progress.percentComplete)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <div className={styles.progressText}>
          {progress.completedExercises} / {progress.totalExercises * progress.totalCycles} exercises
        </div>
      </div>

      <div className={styles.info}>
        <div className={styles.cycle}>
          <span className={styles.label}>Cycle</span>
          <span className={styles.value}>
            {progress.currentCycle} / {progress.totalCycles}
          </span>
        </div>

        <div className={styles.exercise}>
          <span className={styles.label}>
            {phase === 'exercise' ? 'Current Exercise' : 'Next Up'}
          </span>
          <span className={styles.value}>
            {currentExercise?.name || 'Get Ready!'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WorkoutInfo;
