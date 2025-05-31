import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentList.css';
import './__delete/__delete.css';
import './__form/__form.css';
import './__group/__group.css';
import './__info/__info.css';
import './__input/__input.css';
import './__items/__items.css';
import './__logo/__logo.css';
import './__name/__name.css';
import './__submit/__submit.css';

interface Student {
  id: number;
  name: string;
  group: string;
}

export const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudent, setNewStudent] = useState<Omit<Student, 'id'>>({ name: '', group: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('https://attendance-api-8l60.onrender.com/students');
      setStudents(response.data);
    } catch (err) {
      console.error('Ошибка при загрузке студентов:', err);
    }
  };

  const addStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://attendance-api-8l60.onrender.com/students', newStudent);
      setStudents([...students, res.data]);
      setNewStudent({ name: '', group: '' });
    } catch (err) {
      console.error('Ошибка при добавлении студента:', err);
    }
  };

  const deleteStudent = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого студента?')) return;

    try {
      await axios.delete(`https://attendance-api-8l60.onrender.com/students/${id}`);
      setStudents(students.filter(student => student.id !== id));
    } catch (err) {
      console.error('Ошибка при удалении студента:', err);
      alert('Не удалось удалить студента');
    }
  };

  const filteredStudents = students
    .filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.group.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a.group < b.group) return -1;
      if (a.group > b.group) return 1;
      return a.name.localeCompare(b.name);
    });

  const groupedStudents = filteredStudents.reduce((acc, student) => {
    if (!acc[student.group]) acc[student.group] = [];
    acc[student.group].push(student);
    return acc;
  }, {} as Record<string, Student[]>);

  const visibleGroups = Object.keys(groupedStudents).sort();

  return (
    <div className="student-list">
      <div className="student-list__form-section">
        <h2>Добавить студента</h2>
        <form onSubmit={addStudent} className="student-list__form">
          <input
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            placeholder="Имя"
            required
            className="student-list__input"
          />
          <input
            value={newStudent.group}
            onChange={(e) => setNewStudent({ ...newStudent, group: e.target.value })}
            placeholder="Группа"
            required
            className="student-list__input"
          />
          <button type="submit" className="student-list__submit">Добавить</button>
        </form>

        <h2>Список студентов</h2>
        <input
          type="text"
          placeholder="Поиск по имени или группе..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="student-list__search"
        />

        {visibleGroups.map(group => (
          <div key={group} className="student-list__group">
            <h3 className="student-list__group-header">Группа: {group}</h3>
            <ul className="student-list__items">
              {groupedStudents[group].map(student => (
                <li key={student.id} className="student-list__item">
                  <div className="student-list__info">
                    <span className="student-list__name">{student.name}</span>
                  </div>
                  <button 
                    className="student-list__delete"
                    onClick={() => deleteStudent(student.id)}
                    title="Удалить студента"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="student-list__logo">
        <img 
          src={`${process.env.PUBLIC_URL}/images/mirea-logo.svg`} 
          alt="Эмблема РТУ МИРЭА" 
          className="student-list__logo-img"
        />
      </div>
    </div>
  );
};
