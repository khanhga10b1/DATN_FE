export const diffDays = (startDate, endDate) =>{
  const diffTime = Math.abs(endDate - startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) +1; 
}