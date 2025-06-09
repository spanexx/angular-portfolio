import { ProjectStatus } from "./project-status.enum";

/**
 * Represents a project in the portfolio
 */
export interface Project {
  /** Title of the project */
  title: string;
  
  /** Detailed description of the project */
  description: string;
  
  /** Technologies used in the project */
  technologies: string[];
  
  /** Current status of the project */
  status: ProjectStatus;
  
  /** URL to project image or screenshot */
  imageUrl?: string;
  
  /** URL to live project or repository */
  projectUrl?: string;

  /** URL to view the project */
  viewLink?: string;

  /** URL to the project's GitHub repository */
  githubLink?: string;

  /** Indicates if the project is in progress */
  inProgress?: boolean;

  /** Progress of the project (0-100) */
  progress?: number;
}