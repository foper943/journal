import { formatSubjectName } from './formatSubjectName';

describe('formatSubjectName utility', () => {
  // Тест 1: Проверяем одно слово
  test('Делает первую букву заглавной для одного слова', () => {
    expect(formatSubjectName('математика')).toBe('Математика');
  });

  // Тест 2: Проверяем несколько слов
  test('Делает первую букву заглавной для каждого слова', () => {
    expect(formatSubjectName('иностранный язык')).toBe('Иностранный Язык');
  });

  // Тест 3: Проверяем пустую строку
  test('Корректно обрабатывает пустую строку', () => {
    expect(formatSubjectName('')).toBe('');
  });
});