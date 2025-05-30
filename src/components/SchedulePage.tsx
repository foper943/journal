import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './SchedulePage.css';

interface Subject {
  id: string;
  name: string;
  dayOfWeek: string;
}

const SchedulePage: React.FC = () => {
  const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const [schedule, setSchedule] = useState<Subject[]>([]);
  const [newSubjectName, setNewSubjectName] = useState('');

  // Загрузка расписания при монтировании
  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await axios.get('http://localhost:3001/subjects');
      setSchedule(response.data);
    } catch (err) {
      console.error('Ошибка загрузки расписания:', err);
    }
  };

  const addSubject = async (day: string) => {
    if (!newSubjectName.trim()) return;
    
    try {
      const newSubject = {
        name: newSubjectName.trim(),
        dayOfWeek: day
      };

      const response = await axios.post('http://localhost:3001/subjects', newSubject);
      setSchedule([...schedule, response.data]);
      setNewSubjectName('');
    } catch (err) {
      console.error('Ошибка добавления предмета:', err);
    }
  };

  const deleteSubject = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/subjects/${id}`);
      setSchedule(schedule.filter(subject => subject.id !== id));
    } catch (err) {
      console.error('Ошибка удаления предмета:', err);
    }
  };

  // Группировка по дням недели для отображения
  const groupedSchedule = daysOfWeek.map(day => ({
    day,
    subjects: schedule.filter(subject => subject.dayOfWeek === day)
  }));

  return (
    <div className="schedule-page">
      <header>
        <h1>Расписание занятий</h1>
        <Link to="/students" className="nav-button">← К журналу</Link>
      </header>

      <div className="subject-input">
        <input
          type="text"
          value={newSubjectName}
          onChange={(e) => setNewSubjectName(e.target.value)}
          placeholder="Название предмета"
        />
      </div>

      <div className="week-container">
        {groupedSchedule.map(({ day, subjects }) => (
          <div key={day} className="day-card">
            <h3>{day}</h3>
            
            <button 
              onClick={() => addSubject(day)}
              className="add-btn"
            >
              + Добавить
            </button>

            <ul className="subject-list">
              {subjects.map(subject => (
                <li key={subject.id} className="subject-item">
                  {subject.name}
                  <button 
                    onClick={() => deleteSubject(subject.id)}
                    className="delete-btn"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchedulePage;