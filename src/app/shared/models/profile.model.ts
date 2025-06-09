/**
 * Represents a user profile
 */
export interface Profile {
  /** Full name of the profile owner */
  name: string;
  
  /** Professional title or headline */
  title: string;
  
  /** Biography description */
  bio: string;
  
  /** URL to profile image */
  imageUrl?: string;
  
  /** Location information */
  location?: string;
}