import { getStatusForSelectedDate } from './attendanceUtils';

describe('getStatusForSelectedDate utility', () => {
  // Объявляем тип прямо здесь
  type AttendanceRecord = {
    studentId: number;
    date: string;
    status: 'present' | 'absent';
    subject?: string; // Опционально, если используется
  };

  const attendance: AttendanceRecord[] = [
    { 
      studentId: 1, 
      date: '2023-01-01', 
      status: 'present' // Теперь статус строго типизирован
    },
    { 
      studentId: 1, 
      date: '2023-01-02', 
      status: 'absent'
    }
  ];

  test('Находит статус для указанной даты', () => {
    expect(getStatusForSelectedDate(1, '2023-01-01', attendance))
      .toBe('present');
  });

  test('Возвращает null, если записи нет', () => {
    expect(getStatusForSelectedDate(1, '2023-01-03', attendance))
      .toBeNull();
  });
});