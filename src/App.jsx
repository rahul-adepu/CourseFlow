import { AppProvider } from './context/AppContext';
import CourseTypes from './components/CourseTypes';
import Courses from './components/Courses';
import CourseOfferings from './components/CourseOfferings';
import StudentRegistrations from './components/StudentRegistrations';
import './App.css';

function App() {
  return (
    <AppProvider>
      <div className="App">
        <header className="app-header">
          <h1>CourseFlow</h1>
          <p className="subtitle">Student Registration System</p>
        </header>
        <main className="app-main">
          <CourseTypes />
          <Courses />
          <CourseOfferings />
          <StudentRegistrations />
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
