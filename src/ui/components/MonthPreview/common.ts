export function getDayArrayForMonth(year: number, month: number) {
  const days = [];
  let day = 1;
  while (new Date(year, month, day).getMonth() === month) {
    days.push(day);
    ++day;
  }
  return days;
}

export interface MonthPreviewProps {
  year: number;
  month: number;
}

export const singleDayFormatter = new Intl.DateTimeFormat(navigator.language || 'it_IT', {
  weekday: 'short',
  day: 'numeric'
});
