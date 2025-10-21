import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../atoms/Button/Button';
import { WorkoutRoutineWithDerived } from '../../../types/workout.types';
import { formatDuration } from '../../../utils/formatTime';
import styles from './RoutineCard.module.css';

export interface RoutineCardProps {
  routine: WorkoutRoutineWithDerived;
  onStart: (routineId: string) => void;
  onEdit: (routineId: string) => void;
  onDelete: (routineId: string) => void;
}

const RoutineCard: React.FC<RoutineCardProps> = ({
  routine,
  onStart,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  const handleStart = () => {
    onStart(routine.id);
    navigate(`/workout/${routine.id}`);
  };

  const handleEdit = () => {
    console.log('Editing routine:', routine.id, routine.name);
    onEdit(routine.id);
    navigate(`/edit/${routine.id}`);
  };

  const handleDelete = () => {
    if (window.confirm(`Delete "${routine.name}"? This cannot be undone.`)) {
      onDelete(routine.id);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{routine.name}</h3>
        <div className={styles.badge}>
          {routine.exerciseCount} {routine.exerciseCount === 1 ? 'exercise' : 'exercises'}
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Duration per cycle</span>
          <span className={styles.statValue}>
            {formatDuration(routine.cycleDuration)}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Total cycles</span>
          <span className={styles.statValue}>{routine.totalCycles}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Total duration</span>
          <span className={styles.statValue}>
            {formatDuration(routine.totalDuration)}
          </span>
        </div>
      </div>

      <div className={styles.exercises}>
        <h4 className={styles.exercisesTitle}>Exercises:</h4>
        <ul className={styles.exercisesList}>
          {routine.exercises.slice(0, 3).map((exercise, index) => (
            <li key={exercise.id} className={styles.exerciseItem}>
              {index + 1}. {exercise.name}
            </li>
          ))}
          {routine.exercises.length > 3 && (
            <li className={styles.exerciseMore}>
              +{routine.exercises.length - 3} more
            </li>
          )}
        </ul>
      </div>

      <div className={styles.actions}>
        <Button
          onClick={handleStart}
          variant="primary"
          size="large"
          fullWidth
          ariaLabel={`Start ${routine.name} workout`}
        >
          Start Workout
        </Button>
        <div className={styles.secondaryActions}>
          <Button
            onClick={handleEdit}
            variant="secondary"
            size="small"
            ariaLabel={`Edit ${routine.name}`}
          >
            Edit
          </Button>
          <Button
            onClick={handleDelete}
            variant="danger"
            size="small"
            ariaLabel={`Delete ${routine.name}`}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoutineCard;
