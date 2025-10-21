import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/atoms/Button/Button';
import RoutineList from '../components/organisms/RoutineList/RoutineList';
import styles from './Home.module.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateRoutine = () => {
    navigate('/create');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>My Workout Routines</h1>
          <p className={styles.description}>
            Create, manage, and execute your custom workout routines
          </p>
        </div>
        <Button
          onClick={handleCreateRoutine}
          variant="primary"
          size="large"
          ariaLabel="Create new workout routine"
        >
          + Create New Routine
        </Button>
      </div>

      <div className={styles.content}>
        <RoutineList />
      </div>
    </div>
  );
};

export default Home;
