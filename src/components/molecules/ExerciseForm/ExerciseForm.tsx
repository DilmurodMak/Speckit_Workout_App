import React, { useState, useEffect } from 'react';
import Input from '../../atoms/Input/Input';
import Button from '../../atoms/Button/Button';
import TimeSelector from '../../atoms/TimeSelector/TimeSelector';
import { ExerciseFormData } from '../../../types/workout.types';
import { validateExercise } from '../../../services/validationService';
import styles from './ExerciseForm.module.css';

export interface ExerciseFormProps {
  exercise?: ExerciseFormData;
  onSubmit: (exercise: ExerciseFormData) => void;
  onCancel: () => void;
  submitLabel?: string;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({
  exercise,
  onSubmit,
  onCancel,
  submitLabel = 'Add Exercise',
}) => {
  const [name, setName] = useState(exercise?.name || '');
  const [durationSeconds, setDurationSeconds] = useState(exercise?.durationSeconds || 30);
  const [errors, setErrors] = useState<{
    name?: string;
    durationSeconds?: string;
  }>({});

  useEffect(() => {
    if (exercise) {
      setName(exercise.name);
      setDurationSeconds(exercise.durationSeconds);
    }
  }, [exercise]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const exerciseData: ExerciseFormData = {
      name: name.trim(),
      durationSeconds,
    };

    const validation = validateExercise(exerciseData);

    if (!validation.isValid) {
      const newErrors: { name?: string; durationSeconds?: string } = {};
      validation.errors.forEach((error) => {
        if (error.field === 'name') {
          newErrors.name = error.message;
        } else if (error.field === 'durationSeconds') {
          newErrors.durationSeconds = error.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit(exerciseData);
    
    // Reset form if adding new exercise (no exercise prop)
    if (!exercise) {
      setName('');
      setDurationSeconds(30);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleDurationChange = (seconds: number) => {
    setDurationSeconds(seconds);
    if (errors.durationSeconds) {
      setErrors((prev) => ({ ...prev, durationSeconds: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        id="exercise-name"
        name="name"
        type="text"
        value={name}
        onChange={handleNameChange}
        label="Exercise Name"
        placeholder="e.g., Push-ups"
        error={errors.name}
        required
        autoComplete="off"
      />

      <TimeSelector
        value={durationSeconds}
        onChange={handleDurationChange}
        label="Duration"
        error={errors.durationSeconds}
        required
        minSeconds={1}
        maxSeconds={999}
      />

      <div className={styles.actions}>
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
          ariaLabel="Cancel"
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" ariaLabel={submitLabel}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default ExerciseForm;
