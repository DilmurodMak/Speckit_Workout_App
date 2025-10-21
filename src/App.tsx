import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/templates/MainLayout/MainLayout';
import Home from './pages/Home';
import CreateRoutine from './pages/CreateRoutine';
import EditRoutine from './pages/EditRoutine';
import ExecuteWorkout from './pages/ExecuteWorkout/ExecuteWorkout';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="create" element={<CreateRoutine />} />
          <Route path="edit/:routineId" element={<EditRoutine />} />
          <Route path="workout/:id" element={<ExecuteWorkout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
