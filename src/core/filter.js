export function filterByDate(data, range) {
  if (!range || range.length === 0) {
    const todayStr = new Date().toDateString();
    return data.filter(
      (p) => new Date(p.timestamp).toDateString() === todayStr,
    );
  }

  const start = new Date(range[0]).setHours(0, 0, 0, 0);
  const endDateSource = range[1] ? range[1] : range[0];
  const end = new Date(endDateSource).setHours(23, 59, 59, 999);

  return data.filter((p) => {
    const time = new Date(p.timestamp).getTime();
    return time >= start && time <= end;
  });
}