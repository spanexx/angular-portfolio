import { ProjectStatus } from "./project-status.enum";

/**
 * Represents a project in the portfolio
 */
export interface Project {
  /** Unique identifier for the project */
  id: string;

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

  /** List of key features */
  features?: string[];

  /** YouTube video URLs for project demonstrations */
  youtubeVideos?: ProjectVideo[];

  /** GitHub image URLs for project screenshots */
  githubImages?: ProjectImage[];

  /** Project gallery with mixed media */
  gallery?: ProjectMedia[];
}

/**
 * Represents a YouTube video for a project
 */
export interface ProjectVideo {
  /** YouTube video ID or full URL */
  url: string;
  
  /** Title or description of the video */
  title: string;
  
  /** Thumbnail URL (optional, can be auto-generated) */
  thumbnail?: string;
  
  /** Duration of the video in seconds */
  duration?: number;
  
  /** Video type/category */
  type?: 'demo' | 'tutorial' | 'overview' | 'feature';
}

/**
 * Represents an image from GitHub or other sources
 */
export interface ProjectImage {
  /** URL to the image */
  url: string;
  
  /** Alt text for the image */
  alt: string;
  
  /** Caption for the image */
  caption?: string;
  
  /** Image type/category */
  type?: 'screenshot' | 'diagram' | 'architecture' | 'ui' | 'result';
  
  /** Image dimensions */
  width?: number;
  height?: number;
}

/**
 * Represents mixed media content for project gallery
 */
export interface ProjectMedia {
  /** Type of media */
  type: 'image' | 'video' | 'youtube';
  
  /** URL to the media */
  url: string;
  
  /** Title or description */
  title: string;
  
  /** Thumbnail URL for videos */
  thumbnail?: string;
  
  /** Additional metadata */
  metadata?: {
    duration?: number;
    dimensions?: { width: number; height: number };
    fileSize?: number;
  };
}