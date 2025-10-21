import React from 'react';
import { formatTime } from '../../../utils/formatTime';
import styles from './TimerDisplay.module.css';

export interface TimerDisplayProps {
  timeRemaining: number;
  phase: 'exercise' | 'rest';
  className?: string;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeRemaining,
  phase,
  className = '',
}) => {
  const formattedTime = formatTime(Math.ceil(timeRemaining));
  const isWarning = timeRemaining <= 10 && timeRemaining > 0;
  
  const displayClasses = [
    styles.display,
    styles[phase],
    isWarning ? styles.warning : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={displayClasses}>
      <div className={styles.time} aria-live="polite" aria-atomic="true">
        {formattedTime}
      </div>
      <div className={styles.phase}>
        {phase === 'exercise' ? 'WORK' : 'REST'}
      </div>
    </div>
  );
};

export default TimerDisplay;
