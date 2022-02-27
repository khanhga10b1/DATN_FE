export const diffDays = (startDate, endDate) =>{
  const diffTime = Math.abs(endDate - startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) +1; 
}

export const dateWithOutTime = (date) => {
  return new Date(date).setHours(0, 0, 0, 0);
}
