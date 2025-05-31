import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { StudentList } from '../StudentList/StudentList';
import { Auth } from '../Auth/Auth';
import SchedulePage from '../SchedulePage/SchedulePage';
import SubjectAttendance from '../SubjectAttendance/SubjectAttendance';
import './App.css';
import './__logout-button/__logout-button.css';
import './__header/__header.css';
import './__main/__main.css';
import './__nav/__nav.css';
import './__title/__title.css';

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
        <div className="app">
          <header className="app__header">
            <h1 className="app__title">Электронный журнал посещаемости</h1>
            <button onClick={handleLogout} className="app__logout-button">Выйти</button>
          </header>

          <nav className="app__nav">
            <Link to="/students" className="app__nav-link">Студенты</Link>
            <Link to="/schedule" className="app__nav-link">Расписание</Link>
            <Link to="/subjects/math" className="app__nav-link">Математический анализ</Link>
            <Link to="/subjects/python" className="app__nav-link">Python</Link>
            <Link to="/subjects/frontend" className="app__nav-link">Фронтенд</Link>
          </nav>

          <main className="app__main">
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
