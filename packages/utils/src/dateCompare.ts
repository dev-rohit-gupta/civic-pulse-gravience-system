export function isSameWeek(dateA: Date, dateB: Date) {
  const startOfWeek = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay(); // 0 = Sun
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  };

  return startOfWeek(dateA).toDateString() === startOfWeek(dateB).toDateString();
}
