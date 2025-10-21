import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRoutineStorage } from '../../hooks/useRoutineStorage';
import { WorkoutRoutineWithDerived } from '../../types/workout.types';
import WorkoutTimer from '../../components/organisms/WorkoutTimer/WorkoutTimer';
import Button from '../../components/atoms/Button/Button';
import styles from './ExecuteWorkout.module.css';

const ExecuteWorkout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRoutine } = useRoutineStorage();
  const [routine, setRoutine] = useState<WorkoutRoutineWithDerived | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    try {
      const loadedRoutine = getRoutine(id);
      setRoutine(loadedRoutine);
    } catch (error) {
      console.error('Error loading routine:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id, getRoutine]);

  const handleComplete = () => {
    navigate('/');
  };

  const handleExit = () => {
    const confirmed = window.confirm(
      'Are you sure you want to exit? Your progress will be lost.'
    );
    if (confirmed) {
      navigate('/');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading workout...</p>
        </div>
      </div>
    );
  }

  if (!routine) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <div className={styles.icon}>⚠️</div>
          <h1>Workout Not Found</h1>
          <p>The workout routine you're looking for doesn't exist.</p>
          <Button
            variant="primary"
            size="large"
            onClick={() => navigate('/')}
          >
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>{routine.name}</h1>
          <Button
            variant="secondary"
            size="medium"
            onClick={handleExit}
            aria-label="Exit workout"
          >
            × Exit
          </Button>
        </div>
      </header>

      <main className={styles.content}>
        <WorkoutTimer routine={routine} onComplete={handleComplete} />
      </main>
    </div>
  );
};

export default ExecuteWorkout;
