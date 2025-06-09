import { DateString } from '../types/date-string.type';

/**
 * Represents an educational experience
 * @example
 * {
 *   institution: 'University of Technology',
 *   degree: 'Bachelor of Science',
 *   fieldOfStudy: 'Computer Science',
 *   startDate: '2018-09',
 *   endDate: '2022-06',
 *   description: 'Focused on AI and machine learning',
 *   imageUrl: '/assets/edu-logo.png'
 * }
 */
export interface Education {
  /** Institution name */
  institution: string;
  
  /** Degree or certification obtained */
  degree: string;
  
  /** Field of study */
  fieldOfStudy: string;
  
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
  
  /** Description of studies */
  description?: string;
  
  /** Institution image URL */
  imageUrl?: string;
}