import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import TasksPage from './components/TaskPage';
import './App.css'
import RegistrationPage from './components/RegistrationPage';

function App() {
  return (
    <div>
     
        <BrowserRouter>
            <Routes>
              <Route exact path="/" element={<Login/>} />
              <Route exact path="/tasks" element={<TasksPage/>} />
              <Route exact path="/register" element={<RegistrationPage/>} />
            </Routes>
        </BrowserRouter>
        
    </div>
  );
}

export default App;

