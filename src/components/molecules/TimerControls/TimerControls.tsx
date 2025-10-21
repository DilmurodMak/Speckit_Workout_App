import React from 'react';
import Button from '../../atoms/Button/Button';
import styles from './TimerControls.module.css';

export interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  isComplete: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  showStart?: boolean;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  isPaused,
  isComplete,
  onStart,
  onPause,
  onResume,
  onStop,
  showStart = false,
}) => {
  if (isComplete) {
    return (
      <div className={styles.controls}>
        <Button
          onClick={onStop}
          variant="primary"
          size="large"
          fullWidth
          ariaLabel="Return to routine list"
        >
          ✓ Workout Complete - Return Home
        </Button>
      </div>
    );
  }

  if (showStart && !isRunning && !isPaused) {
    return (
      <div className={styles.controls}>
        <Button
          onClick={onStart}
          variant="primary"
          size="large"
          fullWidth
          ariaLabel="Start workout"
        >
          ▶ Start Workout
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.controls}>
      {isPaused ? (
        <>
          <Button
            onClick={onResume}
            variant="primary"
            size="large"
            ariaLabel="Resume workout"
          >
            ▶ Resume
          </Button>
          <Button
            onClick={onStop}
            variant="danger"
            size="large"
            ariaLabel="Stop workout"
          >
            ■ Stop
          </Button>
        </>
      ) : isRunning ? (
        <>
          <Button
            onClick={onPause}
            variant="secondary"
            size="large"
            ariaLabel="Pause workout"
          >
            ⏸ Pause
          </Button>
          <Button
            onClick={onStop}
            variant="danger"
            size="large"
            ariaLabel="Stop workout"
          >
            ■ Stop
          </Button>
        </>
      ) : null}
    </div>
  );
};

export default TimerControls;
