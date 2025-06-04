export function millisecondsToHours(milliseconds: number) {
  const seconds = milliseconds / 1000;
  const hours = seconds / 3600;
  return hours.toFixed(2);
}

export const getPeriodTime = (startTime: Date, endTime: Date) => {
  const duration = Math.abs(endTime.getTime() - startTime.getTime());

  return duration;
};

export const formatDateTime = (value: string | number, mode = "default") => {
  const date = new Date(value);
  return date.toLocaleTimeString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateVN = (value: string | number, mode = "default") => {
  const date = new Date(value);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// format date yyyy - mm - dd
export const formatDate = (dateString: string | number | Date) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-CA');
};