import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './SubjectAttendance.css';
import './__action-btn/__action-btn.css';
import './__controls/__controls.css';
import './__delete-btn/__delete-btn.css';
import './__group/__group.css';
import './__history/__history.css';
import './__mark-btn/__mark-btn.css';
import './__quick-actions/__quick-actions.css';
import './__record/__record.css';
import './__search/__search.css';
import './__select-status/__select-status.css';
import './__state/__state.css';
import './__status-indicator/__status-indicator.css';
import './__student/__student.css';
import './__toggle-icon/__toggle-icon.css';
import './__title/__title.css';

interface AttendanceRecord {
  id: number;
  studentId: number;
  date: string;
  status: 'present' | 'absent';
  subject: string;
}

interface Student {
  id: number;
  name: string;
  group: string;
}

const API_URL = 'https://attendance-api-8l60.onrender.com';

// Форматирование названия предмета
const formatSubjectName = (subject: string) => {
  if (!subject) return '';
  return subject
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const SubjectAttendance: React.FC = () => {
  const { subjectName } = useParams<{ subjectName: string }>();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [filterGroup, setFilterGroup] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [expandedStudent, setExpandedStudent] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsRes, attendanceRes] = await Promise.all([
          axios.get(`${API_URL}/students`),
          axios.get(`${API_URL}/attendance`)
        ]);
        
        setStudents(studentsRes.data);
        setAttendance(
          attendanceRes.data.filter(
            (record: AttendanceRecord) => record.subject === subjectName
          )
        );
        setError('');
      } catch (err) {
        setError('Ошибка загрузки данных');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subjectName]);

  const addAttendance = async (studentId: number, status: 'present' | 'absent') => {
    try {
      const existingRecord = attendance.find(record => 
        record.studentId === studentId && 
        record.date === selectedDate
      );

      if (existingRecord) {
        alert('На эту дату уже есть отметка!');
        return;
      }

      const newRecord = {
        studentId,
        date: selectedDate,
        status,
        subject: subjectName
      };

      const res = await axios.post(`${API_URL}/attendance`, newRecord);
      setAttendance([...attendance, res.data]);
    } catch (err) {
      setError('Ошибка при добавлении посещения');
      console.error(err);
    }
  };

  const markAllStudents = async (status: 'present' | 'absent') => {
    if (!window.confirm(`Отметить всех студентов как "${status === 'present' ? 'присутствующих' : 'отсутствующих'}"?`)) {
      return;
    }

    try {
      const studentsToMark = students.filter(student => 
        !filterGroup || student.group === filterGroup
      );

      const results = await Promise.all(
        studentsToMark.map(async student => {
          const existing = attendance.find(
            record => record.studentId === student.id && record.date === selectedDate
          );
          if (!existing) {
            const res = await axios.post(`${API_URL}/attendance`, {
              studentId: student.id,
              date: selectedDate,
              status,
              subject: subjectName
            });
            return res.data;
          }
          return null;
        })
      );

      const newRecords = results.filter(record => record !== null) as AttendanceRecord[];
      setAttendance([...attendance, ...newRecords]);
    } catch (err) {
      setError('Ошибка при массовой отметке');
      console.error(err);
    }
  };

  const resetAllAttendance = async () => {
    if (!window.confirm('Сбросить все отметки для выбранной даты?')) return;

    try {
      const recordsToDelete = attendance.filter(
        record => record.date === selectedDate &&
          (!filterGroup || students.find(s => s.id === record.studentId)?.group === filterGroup)
      );

      await Promise.all(
        recordsToDelete.map(record => 
          axios.delete(`${API_URL}/attendance/${record.id}`)
        )
      );

      setAttendance(attendance.filter(
        record => !recordsToDelete.includes(record)
      ));
    } catch (err) {
      setError('Ошибка при сбросе посещений');
      console.error(err);
    }
  };

  const updateAttendance = async (id: number, newStatus: 'present' | 'absent') => {
    try {
      await axios.patch(`${API_URL}/attendance/${id}`, { status: newStatus });
      setAttendance(attendance.map(record => 
        record.id === id ? { ...record, status: newStatus } : record
      ));
    } catch (err) {
      setError('Ошибка при обновлении посещения');
      console.error(err);
    }
  };

  const deleteAttendance = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/attendance/${id}`);
      setAttendance(attendance.filter(record => record.id !== id));
    } catch (err) {
      setError('Ошибка при удалении посещения');
      console.error(err);
    }
  };

  const getStatusForSelectedDate = (studentId: number) => {
    const record = attendance.find(
      record => record.studentId === studentId && record.date === selectedDate
    );
    return record ? record.status : null;
  };

  const getStudentAttendance = (studentId: number) => {
    return attendance
      .filter(record => record.studentId === studentId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getUniqueGroups = () => {
    const groups = new Set(students.map(student => student.group));
    return Array.from(groups).sort();
  };

  const filteredStudents = students
    .filter(student => 
      (!filterGroup || student.group === filterGroup) &&
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  if (loading) return <div className="subject-attendance__state subject-attendance__state--loading">Загрузка...</div>;
  if (error) return <div className="subject-attendance__state subject-attendance__state--error">{error}</div>;

  return (
    <div className="subject-attendance">
      <h2 className="subject-attendance__title">{formatSubjectName(subjectName || '')}</h2>

      <div className="subject-attendance__controls">
        <div className="subject-attendance__quick-actions">
          <button onClick={() => markAllStudents('present')} className="subject-attendance__mark-btn subject-attendance__mark-btn--present">
            Отметить всех присутствующими
          </button>
          <button onClick={() => markAllStudents('absent')} className="subject-attendance__mark-btn subject-attendance__mark-btn--absent">
            Отметить всех отсутствующими
          </button>
          <button onClick={resetAllAttendance} className="subject-attendance__mark-btn subject-attendance__mark-btn--reset">
            Сбросить отметки
          </button>
        </div>

        <input
          type="text"
          placeholder="Поиск по имени студента..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="subject-attendance__search"
        />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="subject-attendance__date"
        />
        <select
          value={filterGroup}
          onChange={(e) => setFilterGroup(e.target.value)}
          className="subject-attendance__select"
        >
          <option value="">Все группы</option>
          {getUniqueGroups().map(group => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>
      </div>

      {Object.keys(groupedStudents).map(group => (
        <div key={group} className="subject-attendance__group">
          <h3 className="subject-attendance__group-title">Группа: {group}</h3>
          <div className="subject-attendance__students">
            {groupedStudents[group].map(student => {
              const statusForDate = getStatusForSelectedDate(student.id);

              return (
                <div 
                  key={student.id} 
                  className="subject-attendance__student"
                  onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
                >
                  <div className="subject-attendance__student-header">
                    <div className="subject-attendance__student-info">
                      <h3 className="subject-attendance__student-name">{student.name}</h3>
                      <span className="subject-attendance__student-group">{student.group}</span>
                    </div>
                    <div className="subject-attendance__student-status">
                      {statusForDate && (
                        <span className={`subject-attendance__status-indicator subject-attendance__status-indicator--${statusForDate}`}>
                          {statusForDate === 'present' ? '✓' : '✗'}
                        </span>
                      )}
                      <span className="subject-attendance__toggle-icon">
                        {expandedStudent === student.id ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>

                  {expandedStudent === student.id && (
                    <div className="subject-attendance__details">
                      <div className="subject-attendance__actions">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            addAttendance(student.id, 'present');
                          }}
                          className="subject-attendance__action-btn subject-attendance__action-btn--present"
                        >
                          ➕ Присутствовал
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            addAttendance(student.id, 'absent');
                          }}
                          className="subject-attendance__action-btn subject-attendance__action-btn--absent"
                        >
                          ➖ Отсутствовал
                        </button>
                      </div>

                      <h4>История посещений:</h4>
                      {getStudentAttendance(student.id).length === 0 ? (
                        <p className="subject-attendance__no-data">Нет данных о посещениях</p>
                      ) : (
                        <ul className="subject-attendance__history">
                          {getStudentAttendance(student.id).map(record => (
                            <li 
                              key={record.id} 
                              className="subject-attendance__record"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span className="subject-attendance__record-date">{record.date}</span>
                              <select
                                value={record.status}
                                onChange={(e) => updateAttendance(record.id, e.target.value as 'present' | 'absent')}
                                onClick={(e) => e.stopPropagation()}
                                className="subject-attendance__select-status"
                              >
                                <option value="present">Присутствовал</option>
                                <option value="absent">Отсутствовал</option>
                              </select>
                              <button
                                className="subject-attendance__delete-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm('Удалить эту запись?')) {
                                    deleteAttendance(record.id);
                                  }
                                }}
                              >
                                ×
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubjectAttendance;
