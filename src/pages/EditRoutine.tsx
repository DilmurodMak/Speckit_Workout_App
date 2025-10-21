import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import WorkoutBuilder from '../components/organisms/WorkoutBuilder/WorkoutBuilder';
import { useRoutineStorage } from '../hooks/useRoutineStorage';
import { WorkoutRoutineFormData } from '../types/workout.types';
import styles from './EditRoutine.module.css';

const EditRoutine: React.FC = () => {
  const { routineId } = useParams<{ routineId: string }>();
  const navigate = useNavigate();
  const { getRoutine, updateRoutine, error, isLoading } = useRoutineStorage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const routine = routineId ? getRoutine(routineId) : undefined;

  useEffect(() => {
    console.log('EditRoutine - routineId:', routineId);
    console.log('EditRoutine - isLoading:', isLoading);
    console.log('EditRoutine - routine found:', !!routine);
    console.log('EditRoutine - routine:', routine);
    
    // Only check for not found after loading is complete
    if (!isLoading && routineId && !routine) {
      console.log('EditRoutine - Setting notFound to true');
      setNotFound(true);
    }
  }, [routineId, routine, isLoading]);

  const handleSave = async (data: WorkoutRoutineFormData) => {
    if (!routineId) return;

    setIsSubmitting(true);

    try {
      await updateRoutine(routineId, data);
      // Navigate to home on success
      navigate('/');
    } catch (err) {
      console.error('Failed to update routine:', err);
      // Error is handled by the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (notFound) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>🔍</div>
        <h1 className={styles.errorTitle}>Routine Not Found</h1>
        <p className={styles.errorMessage}>
          The routine you're trying to edit doesn't exist or has been deleted.
        </p>
        <button
          onClick={() => navigate('/')}
          className={styles.backButton}
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  if (isLoading || !routine) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading routine...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Edit Routine</h1>
        <p className={styles.description}>
          Make changes to your workout routine. Your updates will be saved automatically.
        </p>
      </div>

      {error && (
        <div className={styles.errorBanner} role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      <WorkoutBuilder
        routine={{
          name: routine.name,
          exercises: routine.exercises,
          restSeconds: routine.restSeconds,
          totalCycles: routine.totalCycles,
        }}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      {isSubmitting && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner} />
          <p>Updating routine...</p>
        </div>
      )}
    </div>
  );
};

export default EditRoutine;
