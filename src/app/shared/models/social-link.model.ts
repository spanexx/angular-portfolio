/**
 * Represents a social media platform
 */
export type SocialPlatform = 'linkedin' | 'github' | 'twitter' | 'facebook' | 'instagram' | 'youtube' | 'other';

/**
 * Represents a social media link
 * @example
 * {
 *   platform: 'github',
 *   url: 'https://github.com/username'
 * }
 */
export interface SocialLink {
  /** 
   * Social media platform
   * @pattern ^(linkedin|github|twitter|facebook|instagram|youtube|other)$
   */
  platform: SocialPlatform;
  
  /** 
   * Profile URL
   * @format uri
   */
  url: string;
  
  /** 
   * Custom platform name (only required when platform is 'other')
   */
  customName?: string;
}