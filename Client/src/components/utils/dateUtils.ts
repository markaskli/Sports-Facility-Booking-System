export const formatTime = (timeString: string) => {
  const date = new Date(timeString);
  return date.toLocaleTimeString("en-EN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatToDateOnly = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("lt-LT");
};
