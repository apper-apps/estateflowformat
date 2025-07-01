import { format, parseISO, isToday, isTomorrow, isThisWeek, addDays, startOfWeek, endOfWeek } from 'date-fns';

export const formatDate = (dateString, formatString = 'MMM dd, yyyy') => {
  if (!dateString) return '';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, formatString);
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};

export const formatDateTime = (dateString) => {
  return formatDate(dateString, 'MMM dd, yyyy hh:mm a');
};

export const formatTime = (dateString) => {
  return formatDate(dateString, 'hh:mm a');
};

export const getRelativeDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isThisWeek(date)) return format(date, 'EEEE');
    
    return formatDate(date, 'MMM dd');
  } catch (error) {
    console.error('Relative date error:', error);
    return '';
  }
};

export const isOverdue = (dateString) => {
  if (!dateString) return false;
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return date < new Date() && !isToday(date);
  } catch (error) {
    return false;
  }
};

export const isDueSoon = (dateString, days = 2) => {
  if (!dateString) return false;
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    const futureDate = addDays(new Date(), days);
    return date <= futureDate && date >= new Date();
  } catch (error) {
    return false;
  }
};

export const getWeekRange = (date = new Date()) => {
  return {
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 })
  };
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US').format(number);
};