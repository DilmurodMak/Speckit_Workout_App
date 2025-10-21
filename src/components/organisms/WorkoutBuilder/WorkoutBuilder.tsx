import React, { useState, useEffect } from 'react';
import Input from '../../atoms/Input/Input';
import Button from '../../atoms/Button/Button';
import ExerciseForm from '../../molecules/ExerciseForm/ExerciseForm';
import ExerciseCard from '../../molecules/ExerciseCard/ExerciseCard';
import {
  WorkoutRoutineFormData,
  ExerciseFormData,
  Exercise,
} from '../../../types/workout.types';
import { validateRoutine } from '../../../services/validationService';
import { generateId } from '../../../utils/generateId';
import {
  REST_TIME_MIN,
  REST_TIME_MAX,
  CYCLES_MIN,
  CYCLES_MAX,
} from '../../../utils/constants';
import styles from './WorkoutBuilder.module.css';

export interface WorkoutBuilderProps {
  routine?: WorkoutRoutineFormData;
  onSave: (routine: WorkoutRoutineFormData) => void;
  onCancel?: () => void;
}

const WorkoutBuilder: React.FC<WorkoutBuilderProps> = ({
  routine,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(routine?.name || '');
  const [exercises, setExercises] = useState<Exercise[]>(routine?.exercises || []);
  const [restSeconds, setRestSeconds] = useState(
    routine?.restSeconds?.toString() || ''
  );
  const [totalCycles, setTotalCycles] = useState(
    routine?.totalCycles?.toString() || '1'
  );
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    exercises?: string;
    restSeconds?: string;
    totalCycles?: string;
  }>({});

  useEffect(() => {
    if (routine) {
      setName(routine.name);
      setExercises(routine.exercises);
      setRestSeconds(routine.restSeconds?.toString() || '');
      setTotalCycles(routine.totalCycles?.toString() || '1');
    }
  }, [routine]);

  const handleAddExercise = (exerciseData: ExerciseFormData) => {
    const newExercise: Exercise = {
      id: generateId('exercise'),
      name: exerciseData.name,
      durationSeconds: exerciseData.durationSeconds,
      order: exercises.length,
    };

    setExercises([...exercises, newExercise]);
    setShowExerciseForm(false);
    
    // Clear exercise validation error if present
    if (errors.exercises) {
      setErrors((prev) => ({ ...prev, exercises: undefined }));
    }
  };

  const handleEditExercise = (exerciseData: ExerciseFormData) => {
    if (!editingExercise) return;

    const updatedExercises = exercises.map((ex) =>
      ex.id === editingExercise.id
        ? { ...ex, name: exerciseData.name, durationSeconds: exerciseData.durationSeconds }
        : ex
    );

    setExercises(updatedExercises);
    setEditingExercise(null);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    const updatedExercises = exercises
      .filter((ex) => ex.id !== exerciseId)
      .map((ex, index) => ({ ...ex, order: index }));
    
    setExercises(updatedExercises);
  };

  const handleMoveExercise = (exerciseId: string, direction: 'up' | 'down') => {
    const index = exercises.findIndex((ex) => ex.id === exerciseId);
    if (index === -1) return;

    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === exercises.length - 1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedExercises = [...exercises];
    
    // Swap exercises
    [updatedExercises[index], updatedExercises[newIndex]] = [
      updatedExercises[newIndex],
      updatedExercises[index],
    ];

    // Update order values
    updatedExercises.forEach((ex, idx) => {
      ex.order = idx;
    });

    setExercises(updatedExercises);
  };

  const handleStartEdit = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setShowExerciseForm(false);
  };

  const handleCancelEdit = () => {
    setEditingExercise(null);
  };

  const handleCancelAdd = () => {
    setShowExerciseForm(false);
  };

  const handleSave = () => {
    const routineData: WorkoutRoutineFormData = {
      name: name.trim(),
      exercises,
      restSeconds: parseInt(restSeconds, 10) || 0,
      totalCycles: parseInt(totalCycles, 10) || 1,
    };

    const validation = validateRoutine(routineData);

    if (!validation.isValid) {
      const newErrors: {
        name?: string;
        exercises?: string;
        restSeconds?: string;
        totalCycles?: string;
      } = {};
      
      validation.errors.forEach((error) => {
        if (error.field === 'name') {
          newErrors.name = error.message;
        } else if (error.field === 'exercises') {
          newErrors.exercises = error.message;
        } else if (error.field === 'restSeconds') {
          newErrors.restSeconds = error.message;
        } else if (error.field === 'totalCycles') {
          newErrors.totalCycles = error.message;
        }
      });
      
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSave(routineData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Input
          id="routine-name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) {
              setErrors((prev) => ({ ...prev, name: undefined }));
            }
          }}
          label="Routine Name"
          placeholder="e.g., Morning Cardio"
          error={errors.name}
          required
          autoComplete="off"
        />

        <div className={styles.settings}>
          <Input
            id="rest-seconds"
            name="restSeconds"
            type="number"
            value={restSeconds}
            onChange={(e) => {
              setRestSeconds(e.target.value);
              if (errors.restSeconds) {
                setErrors((prev) => ({ ...prev, restSeconds: undefined }));
              }
            }}
            label="Rest Between Exercises (seconds)"
            placeholder="e.g., 30"
            error={errors.restSeconds}
            helperText={`${REST_TIME_MIN}-${REST_TIME_MAX} seconds`}
            min={REST_TIME_MIN}
            max={REST_TIME_MAX}
            inputMode="numeric"
            autoComplete="off"
          />

          <Input
            id="total-cycles"
            name="totalCycles"
            type="number"
            value={totalCycles}
            onChange={(e) => {
              setTotalCycles(e.target.value);
              if (errors.totalCycles) {
                setErrors((prev) => ({ ...prev, totalCycles: undefined }));
              }
            }}
            label="Total Cycles"
            placeholder="1"
            error={errors.totalCycles}
            helperText={`${CYCLES_MIN}-${CYCLES_MAX} cycles`}
            min={CYCLES_MIN}
            max={CYCLES_MAX}
            inputMode="numeric"
            autoComplete="off"
          />
        </div>
      </div>

      <div className={styles.exercises}>
        <div className={styles.exercisesHeader}>
          <h2 className={styles.exercisesTitle}>Exercises</h2>
          {!showExerciseForm && !editingExercise && (
            <Button
              onClick={() => setShowExerciseForm(true)}
              variant="primary"
              size="small"
              ariaLabel="Add new exercise"
            >
              + Add Exercise
            </Button>
          )}
        </div>

        {errors.exercises && (
          <p className={styles.error} role="alert">
            {errors.exercises}
          </p>
        )}

        {showExerciseForm && (
          <div className={styles.formWrapper}>
            <ExerciseForm
              onSubmit={handleAddExercise}
              onCancel={handleCancelAdd}
              submitLabel="Add Exercise"
            />
          </div>
        )}

        {editingExercise && (
          <div className={styles.formWrapper}>
            <ExerciseForm
              exercise={{
                name: editingExercise.name,
                durationSeconds: editingExercise.durationSeconds,
              }}
              onSubmit={handleEditExercise}
              onCancel={handleCancelEdit}
              submitLabel="Save Changes"
            />
          </div>
        )}

        {exercises.length === 0 && !showExerciseForm && !editingExercise && (
          <div className={styles.emptyState}>
            <p>No exercises added yet. Click "Add Exercise" to get started.</p>
          </div>
        )}

        {exercises.length > 0 && (
          <div className={styles.exercisesList}>
            {exercises.map((exercise, index) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                index={index}
                onEdit={handleStartEdit}
                onDelete={handleDeleteExercise}
                onMoveUp={(id) => handleMoveExercise(id, 'up')}
                onMoveDown={(id) => handleMoveExercise(id, 'down')}
                isFirst={index === 0}
                isLast={index === exercises.length - 1}
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        {onCancel && (
          <Button
            onClick={onCancel}
            variant="secondary"
            size="large"
            ariaLabel="Cancel"
          >
            Cancel
          </Button>
        )}
        <Button
          onClick={handleSave}
          variant="primary"
          size="large"
          ariaLabel="Save routine"
          fullWidth={!onCancel}
        >
          {routine ? 'Update Routine' : 'Save Routine'}
        </Button>
      </div>
    </div>
  );
};

export default WorkoutBuilder;
