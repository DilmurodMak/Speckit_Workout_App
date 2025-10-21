import React from 'react';
import RoutineCard from '../../molecules/RoutineCard/RoutineCard';
import Button from '../../atoms/Button/Button';
import { useRoutineStorage } from '../../../hooks/useRoutineStorage';
import { useNavigate } from 'react-router-dom';
import styles from './RoutineList.module.css';

const RoutineList: React.FC = () => {
  const navigate = useNavigate();
  const { routines, isLoading, error, deleteRoutine } = useRoutineStorage();

  const handleStart = (_routineId: string) => {
    // Navigation handled in RoutineCard
  };

  const handleEdit = (_routineId: string) => {
    // Navigation handled in RoutineCard
  };

  const handleDelete = async (routineId: string) => {
    try {
      await deleteRoutine(routineId);
    } catch (err) {
      console.error('Failed to delete routine:', err);
    }
  };

  const handleCreateNew = () => {
    navigate('/create');
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading your routines...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h3 className={styles.errorTitle}>Failed to load routines</h3>
        <p className={styles.errorMessage}>{error}</p>
        <Button onClick={() => window.location.reload()} variant="primary">
          Retry
        </Button>
      </div>
    );
  }

  if (routines.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIcon}>📋</div>
        <h2 className={styles.emptyTitle}>No routines yet</h2>
        <p className={styles.emptyMessage}>
          Create your first workout routine to get started!
        </p>
        <Button
          onClick={handleCreateNew}
          variant="primary"
          size="large"
          ariaLabel="Create your first routine"
        >
          + Create Your First Routine
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {routines.map((routine) => (
          <RoutineCard
            key={routine.id}
            routine={routine}
            onStart={handleStart}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default RoutineList;
