import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateToBrazilian(dateString: string): string {
  if (!dateString) return '';
  
  if (dateString.includes('/') && dateString.split('/').length === 3) {
    return dateString;
  }
  
  try {
    let date: Date;
    
    if (dateString.includes('T')) {
      date = new Date(dateString);
    }
    else if (dateString.includes('-') && dateString.length === 10) {
      const [year, month, day] = dateString.split('-');
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    else {
      date = new Date(dateString);
    }
    
    if (isNaN(date.getTime())) {
      console.warn(`Data inválida: ${dateString}`);
      return dateString;
    }
    
    return date.toLocaleDateString('pt-BR');
  } catch (error) {
    console.error(`Erro ao formatar data: ${dateString}`, error);
    return dateString; 
  }
}

export function formatDateToISO(dateString: string): string {
  if (!dateString) return '';
  
  if (dateString.includes('-') && dateString.length === 10) return dateString;
  
  try {
    if (dateString.includes('T')) {
      return dateString.split('T')[0];
    }
    
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    return dateString;
  } catch (error) {
    console.error(`Erro ao converter data para ISO: ${dateString}`, error);
    return dateString;
  }
}

export function formatDateInputValue(dateString: string): string {
  if (!dateString) return '';
  
  try {
    if (dateString.includes('T')) {
      return dateString.split('T')[0];
    }
    
    if (dateString.includes('-') && dateString.length === 10) return dateString;
    
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    return dateString;
  } catch (error) {
    console.error(`Erro ao formatar data para input: ${dateString}`, error);
    return '';
  }
}

export function getCurrentDateForInput(): string {
  return new Date().toISOString().split('T')[0];
}
