import { DateString } from '../types/date-string.type';

/**
 * Represents professional work experience
 * @example
 * {
 *   company: 'Tech Innovations Inc.',
 *   role: 'Senior Developer',
 *   startDate: '2020-03',
 *   endDate: 'Present',
 *   responsibilities: ['Led team of 5 developers', 'Implemented CI/CD pipeline'],
 *   imageUrl: '/assets/company-logo.png',
 *   employmentType: 'Full-time'
 * }
 */
export interface Experience {
  /** Company name */
  company: string;
  
  /** Job title/role */
  role: string;
  
  /**
   * Start date in YYYY-MM format
   * @pattern ^\d{4}-\d{2}$
   */
  startDate: DateString;
  
  /**
   * End date in YYYY-MM format or 'Present'
   * @pattern ^(\d{4}-\d{2}|Present)$
   */
  endDate: DateString | 'Present';
  
  /** List of responsibilities and achievements */
  responsibilities: string[];
  
  /** Company image URL */
  imageUrl?: string;
  
  /** Employment type (Full-time, Contract, etc.) */
  employmentType?: string;
}