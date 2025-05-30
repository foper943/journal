import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { StudentList } from './StudentList';
import { Auth } from './Auth';
import  SchedulePage  from './SchedulePage';
import SubjectAttendance from "./SubjectAttendance";
import './App.css';

const App: React.FC = () => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuth') === 'true';
    setIsAuth(authStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuth');
    setIsAuth(false);
  };

  return (
    <Router>
      {isAuth ? (
        <div className="app-container">
          <header className="app-header">
            <h1>Электронный журнал посещаемости</h1>
            <button onClick={handleLogout} className="logout-button">Войти</button>
          </header>
          
          <nav className="app-nav">
            <Link to="/students" className="nav-link">Студенты</Link>
            <Link to="/schedule" className="nav-link">Расписание</Link>
            <Link to="/subjects/math" className="nav-link">Математический анализ</Link>
            <Link to="/subjects/python" className="nav-link">Python</Link>
            <Link to="/subjects/frontend" className="nav-link">Фронтенд</Link>
          </nav>
          
          <main className="app-main">
            <Routes>
              <Route path="/students" element={<StudentList />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/subjects/:subjectName" element={<SubjectAttendance />} />
              <Route path="*" element={<Navigate to="/students" />} />
            </Routes>
          </main>
        </div>
      ) : (
        <Auth onLogin={setIsAuth} />
      )}
    </Router>
  );
};

export default App;