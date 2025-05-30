import { getUniqueGroups } from './getUniqueGroups';

describe('getUniqueGroups utility', () => {
  test('Возвращает уникальные отсортированные группы', () => {
    const students = [
      { id: 1, name: 'Иванов', group: 'ИВ1-22' },
      { id: 2, name: 'Петров', group: 'ИВ2-22' },
      { id: 3, name: 'Сидоров', group: 'ИВ1-22' } // Дубликат группы
    ];
    
    expect(getUniqueGroups(students)).toEqual(['ИВ1-22', 'ИВ2-22']);
  });

  test('Возвращает пустой массив, если студентов нет', () => {
    expect(getUniqueGroups([])).toEqual([]);
  });
});