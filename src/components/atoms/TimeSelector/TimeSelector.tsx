import React from 'react';
import styles from './TimeSelector.module.css';

export interface TimeSelectorProps {
  value: number; // Total seconds
  onChange: (seconds: number) => void;
  label?: string;
  error?: string;
  required?: boolean;
  minSeconds?: number;
  maxSeconds?: number;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({
  value,
  onChange,
  label,
  error,
  required = false,
  minSeconds = 1,
  maxSeconds = 999,
}) => {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;

  // Generate minute options (0-16 minutes = 0-999 seconds)
  const maxMinutes = Math.floor(maxSeconds / 60);
  const minuteOptions = Array.from({ length: maxMinutes + 1 }, (_, i) => i);

  // Generate second options (0-59)
  const secondOptions = Array.from({ length: 60 }, (_, i) => i);

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMinutes = parseInt(e.target.value, 10);
    const totalSeconds = newMinutes * 60 + seconds;
    if (totalSeconds <= maxSeconds) {
      onChange(totalSeconds);
    }
  };

  const handleSecondChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSeconds = parseInt(e.target.value, 10);
    const totalSeconds = minutes * 60 + newSeconds;
    if (totalSeconds >= minSeconds && totalSeconds <= maxSeconds) {
      onChange(totalSeconds);
    }
  };

  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      
      <div className={styles.selectors}>
        <div className={styles.field}>
          <select
            value={minutes}
            onChange={handleMinuteChange}
            className={`${styles.select} ${error ? styles.error : ''}`}
            aria-label="Minutes"
          >
            {minuteOptions.map((min) => (
              <option key={min} value={min}>
                {min}
              </option>
            ))}
          </select>
          <span className={styles.unit}>min</span>
        </div>

        <span className={styles.separator}>:</span>

        <div className={styles.field}>
          <select
            value={seconds}
            onChange={handleSecondChange}
            className={`${styles.select} ${error ? styles.error : ''}`}
            aria-label="Seconds"
          >
            {secondOptions.map((sec) => (
              <option key={sec} value={sec}>
                {sec.toString().padStart(2, '0')}
              </option>
            ))}
          </select>
          <span className={styles.unit}>sec</span>
        </div>
      </div>

      {error && (
        <div className={styles.errorMessage} role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default TimeSelector;
