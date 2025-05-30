export const formatSubjectName = (subject: string) => {
  if (!subject) return ''; // Если строка пустая — возвращаем пустую строку
  return subject
    .split(' ') // Разбиваем строку на слова по пробелам
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Каждое слово: первая буква заглавная, остальные — строчные
    .join(' '); // Собираем обратно в строку
};