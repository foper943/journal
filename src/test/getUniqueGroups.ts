export const getUniqueGroups = (students: { group: string }[]) => {
  const groups = new Set(students.map(student => student.group));
  return Array.from(groups).sort();
};