export const getDaysHours = (seconds):any => {
  const days = Math.floor(seconds / 86400);
  const hours = (seconds % 86400) / 3600;
  const daysHours = {
    days,
    hours
  };

  if(seconds < 0) return {days: 0, hours: 0};

  return daysHours;
}

export const getSeconds = (days, hours):any => {
  const seconds = days * 86400 + hours * 3600;

  return seconds;
}