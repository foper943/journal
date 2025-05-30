// Локальный тип прямо в файле
type AttendanceRecord = {
  studentId: number;
  date: string;
  status: 'present' | 'absent';
  subject?: string; // Опционально
};

export const getStatusForSelectedDate = (
  studentId: number,
  date: string,
  records: AttendanceRecord[]
) => {
  const record = records.find(r => 
    r.studentId === studentId && 
    r.date === date
  );
  return record ? record.status : null;
};