import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentList.css';

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
      const response = await axios.get('http://localhost:3001/students');
      setStudents(response.data);
    } catch (err) {
      console.error('Ошибка при загрузке студентов:', err);
    }
  };

  const addStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/students', newStudent);
      setStudents([...students, res.data]);
      setNewStudent({ name: '', group: '' });
    } catch (err) {
      console.error('Ошибка при добавлении студента:', err);
    }
  };

  const deleteStudent = async (id: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого студента?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/students/${id}`);
      setStudents(students.filter(student => student.id !== id));
    } catch (err) {
      console.error('Ошибка при удалении студента:', err);
      alert('Не удалось удалить студента');
    }
  };

  // Сортируем и фильтруем студентов
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

  // Группируем с учетом фильтрации
  const groupedStudents = filteredStudents.reduce((acc, student) => {
    if (!acc[student.group]) {
      acc[student.group] = [];
    }
    acc[student.group].push(student);
    return acc;
  }, {} as Record<string, Student[]>);

  // Получаем уникальные группы для отображения
  const visibleGroups = Object.keys(groupedStudents).sort();

  return (
    <div className="student-list-container">
      <div className="student-form-section">
        <h2>Добавить студента</h2>
        <form onSubmit={addStudent}>
          <input
            value={newStudent.name}
            onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
            placeholder="Имя"
            required
          />
          <input
            value={newStudent.group}
            onChange={(e) => setNewStudent({...newStudent, group: e.target.value})}
            placeholder="Группа"
            required
          />
          <button type="submit">Добавить</button>
        </form>

        <h2>Список студентов</h2>
        
        <input
          type="text"
          placeholder="Поиск по имени или группе..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        {visibleGroups.map(group => (
          <div key={group} className="group-container">
            <h3 className="group-header">Группа: {group}</h3>
            <ul className="student-list">
              {groupedStudents[group].map(student => (
                <li key={student.id} className="student-item">
                  <div className="student-info">
                    <span className="student-name">{student.name}</span>
                  </div>
                  <button 
                    className="delete-btn"
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
      
      <div className="logo-section">
        <img 
          src="/images/mirea-logo.svg" 
          alt="Эмблема РТУ МИРЭА" 
          className="mirea-logo"
        />
      </div>
    </div>
  );
};