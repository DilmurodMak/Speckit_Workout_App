import React from 'react';
import { useNavigate } from 'react-router-dom';
import WorkoutBuilder from '../components/organisms/WorkoutBuilder/WorkoutBuilder';
import { useRoutineStorage } from '../hooks/useRoutineStorage';
import { WorkoutRoutineFormData } from '../types/workout.types';
import styles from './CreateRoutine.module.css';

const CreateRoutine: React.FC = () => {
  const navigate = useNavigate();
  const { createRoutine, error } = useRoutineStorage();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSave = async (data: WorkoutRoutineFormData) => {
    setIsSubmitting(true);
    
    try {
      await createRoutine(data);
      // Navigate to home on success
      navigate('/');
    } catch (err) {
      console.error('Failed to create routine:', err);
      // Error is handled by the hook and displayed in the builder
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Create New Routine</h1>
        <p className={styles.description}>
          Design your custom workout by adding exercises, setting rest times, and choosing how many cycles to complete.
        </p>
      </div>

      {error && (
        <div className={styles.errorBanner} role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      <WorkoutBuilder
        onSave={handleSave}
        onCancel={handleCancel}
      />

      {isSubmitting && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner} />
          <p>Saving routine...</p>
        </div>
      )}
    </div>
  );
};

export default CreateRoutine;

