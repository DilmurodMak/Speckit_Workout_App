import React from 'react';
import styles from './Input.module.css';

export interface InputProps {
  id: string;
  name: string;
  type?: 'text' | 'number' | 'email';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email';
  autoComplete?: string;
  ariaLabel?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  id,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  label,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  min,
  max,
  step,
  inputMode,
  autoComplete,
  ariaLabel,
  className = '',
}) => {
  const hasError = !!error;
  const inputClasses = [
    styles.input,
    hasError ? styles.error : '',
    disabled ? styles.disabled : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-label={ariaLabel || label}
        aria-invalid={hasError}
        aria-describedby={
          error ? `${id}-error` : helperText ? `${id}-helper` : undefined
        }
        className={inputClasses}
      />
      
      {error && (
        <span id={`${id}-error`} className={styles.errorText} role="alert">
          {error}
        </span>
      )}
      
      {helperText && !error && (
        <span id={`${id}-helper`} className={styles.helperText}>
          {helperText}
        </span>
      )}
    </div>
  );
};

export default Input;
