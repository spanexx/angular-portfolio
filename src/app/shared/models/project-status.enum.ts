/**
 * Represents the status of a project
 */
export enum ProjectStatus {
  /** Project is currently in development */
  Active = 'Active',
  
  /** Project has been finished and delivered */
  Completed = 'Completed',
  
  /** Project is no longer maintained */
  Archived = 'Archived',
  /** Project is currently in progress */
  InProgress = 'In Progress'
}