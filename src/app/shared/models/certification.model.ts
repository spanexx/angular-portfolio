import { DateString } from '../types/date-string.type';

/**
 * Represents a professional certification
 * @example
 * {
 *   name: 'AWS Certified Solutions Architect',
 *   issuer: 'Amazon Web Services',
 *   date: '2023-11-15',
 *   credentialId: 'ABCD1234',
 *   verificationUrl: 'https://aws.amazon.com/verification',
 *   imageUrl: '/assets/aws-badge.png'
 * }
 */
export interface Certification {
  /** Name of the certification */
  name: string;
  
  /** Issuing organization */
  issuer: string;
  
  /**
   * Date of certification in YYYY-MM-DD format
   * @pattern ^\d{4}-\d{2}-\d{2}$
   */
  date: DateString;
  
  /** Certification ID or credential number */
  credentialId?: string;
  
  /** URL to certification verification */
  verificationUrl?: string;
  
  /** URL to certification badge image */
  imageUrl?: string;
}