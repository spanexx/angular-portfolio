import { SocialLink } from './social-link.model';

/**
 * Represents contact information
 * @example
 * {
 *   email: 'contact@example.com',
 *   phone: '+1234567890',
 *   linkedin: 'https://linkedin.com/in/username',
 *   github: 'https://github.com/username',
 *   website: 'https://personalwebsite.com',
 *   socialLinks: [
 *     { platform: 'twitter', url: 'https://twitter.com/username' },
 *     { platform: 'other', url: 'https://custom.site/me', customName: 'MyBlog' }
 *   ]
 * }
 */
export interface ContactInfo {
  /**
   * Primary email address
   * @format email
   */
  email: string;
  
  /** Phone number */
  phone?: string;
  
  /** LinkedIn profile URL */
  linkedin?: string;
  
  /** GitHub profile URL */
  github?: string;
  
  /** Personal website URL */
  website?: string;
  
  /** Other social media links */
  socialLinks?: SocialLink[];
}