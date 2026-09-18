export function isoLocalDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Native mobile calendars ignore `min` unless `max` is also set. */
export function travelDateBounds() {
  const min = new Date();
  min.setHours(0, 0, 0, 0);
  min.setDate(min.getDate() + 1);
  const max = new Date(min);
  max.setFullYear(max.getFullYear() + 3);
  return { min: isoLocalDate(min), max: isoLocalDate(max) };
}

export function clampTravelDate(value: string, min: string, max: string) {
  if (!value) return "";
  if (value < min) return min;
  if (value > max) return max;
  return value;
}
