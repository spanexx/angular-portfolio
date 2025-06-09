import { SkillLevel } from './skill-level.enum';

/**
 * Represents a technical or professional skill
 * @example
 * {
 *   name: 'Angular',
 *   level: SkillLevel.Advanced,
 *   category: 'Frontend Frameworks',
 *   yearsOfExperience: 4
 * }
 */
export interface Skill {
  /** Name of the skill */
  name: string;
  
  /** Proficiency level */
  level: SkillLevel;
  
  /** Category or grouping */
  category: string;
  
  /** Years of experience (optional) */
  yearsOfExperience?: number;
  
  /** Last used date (optional) */
  lastUsed?: Date;
  
  /** Projects where this skill was applied (optional) */
  projects?: string[];
}