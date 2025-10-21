import React from 'react';
import Button from '../../atoms/Button/Button';
import { Exercise } from '../../../types/workout.types';
import { formatTime } from '../../../utils/formatTime';
import styles from './ExerciseCard.module.css';

export interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  onEdit?: (exercise: Exercise) => void;
  onDelete?: (exerciseId: string) => void;
  onMoveUp?: (exerciseId: string) => void;
  onMoveDown?: (exerciseId: string) => void;
  isFirst?: boolean;
  isLast?: boolean;
  showActions?: boolean;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  index,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
  showActions = true,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.number}>{index + 1}</div>
        <div className={styles.details}>
          <h3 className={styles.name}>{exercise.name}</h3>
          <p className={styles.duration}>
            {formatTime(exercise.durationSeconds)}
          </p>
        </div>
      </div>

      {showActions && (
        <div className={styles.actions}>
          <div className={styles.reorderButtons}>
            <Button
              onClick={() => onMoveUp?.(exercise.id)}
              variant="ghost"
              size="small"
              disabled={isFirst}
              ariaLabel={`Move ${exercise.name} up`}
              icon={<span>↑</span>}
            />
            <Button
              onClick={() => onMoveDown?.(exercise.id)}
              variant="ghost"
              size="small"
              disabled={isLast}
              ariaLabel={`Move ${exercise.name} down`}
              icon={<span>↓</span>}
            />
          </div>
          
          <div className={styles.editButtons}>
            <Button
              onClick={() => onEdit?.(exercise)}
              variant="secondary"
              size="small"
              ariaLabel={`Edit ${exercise.name}`}
            >
              Edit
            </Button>
            <Button
              onClick={() => onDelete?.(exercise.id)}
              variant="danger"
              size="small"
              ariaLabel={`Delete ${exercise.name}`}
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseCard;
