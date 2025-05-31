import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './SchedulePage.css';
import './__button/__button.css';
import './__day/__day.css';
import './__input/__input.css';
import './__nav/__nav-link.css';
import './__subject/__subject.css';
import './__week/__week.css';

interface Subject {
  id: string;
  name: string;
  dayOfWeek: string;
}

const SchedulePage: React.FC = () => {
  const daysOfWeek = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const [schedule, setSchedule] = useState<Subject[]>([]);
  const [newSubjectName, setNewSubjectName] = useState('');

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await axios.get('https://attendance-api-8l60.onrender.com/subjects');
      setSchedule(response.data);
    } catch (err) {
      console.error('Ошибка загрузки расписания:', err);
    }
  };

  const addSubject = async (day: string) => {
    if (!newSubjectName.trim()) return;

    try {
      const newSubject = { name: newSubjectName.trim(), dayOfWeek: day };
      const response = await axios.post('https://attendance-api-8l60.onrender.com/subjects', newSubject);
      setSchedule([...schedule, response.data]);
      setNewSubjectName('');
    } catch (err) {
      console.error('Ошибка добавления предмета:', err);
    }
  };

  const deleteSubject = async (id: string) => {
    try {
      await axios.delete(`https://attendance-api-8l60.onrender.com/subjects/${id}`);
      setSchedule(schedule.filter(subject => subject.id !== id));
    } catch (err) {
      console.error('Ошибка удаления предмета:', err);
    }
  };

  const groupedSchedule = daysOfWeek.map(day => ({
    day,
    subjects: schedule.filter(subject => subject.dayOfWeek === day)
  }));

  return (
    <div className="schedule-page">
      <header>
        <h1>Расписание занятий</h1>
        <Link to="/students" className="schedule-page__nav-link">← К журналу</Link>
      </header>

      <div className="schedule-page__input-wrapper">
        <input
          type="text"
          value={newSubjectName}
          onChange={(e) => setNewSubjectName(e.target.value)}
          placeholder="Название предмета"
          className="schedule-page__input"
        />
      </div>

      <div className="schedule-page__week">
        {groupedSchedule.map(({ day, subjects }) => (
          <div key={day} className="schedule-page__day">
            <h3>{day}</h3>
            <button 
              onClick={() => addSubject(day)}
              className="schedule-page__button"
            >
              + Добавить
            </button>
            <ul className="schedule-page__subject-list">
              {subjects.map(subject => (
                <li key={subject.id} className="schedule-page__subject-item">
                  {subject.name}
                  <button 
                    onClick={() => deleteSubject(subject.id)}
                    className="schedule-page__button schedule-page__button--delete"
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
