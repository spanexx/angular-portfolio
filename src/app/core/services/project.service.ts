import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Project } from '../../shared/models/project.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiService = inject(ApiService);

  /**
   * Get all projects
   */
  getProjects(): Observable<Project[]> {
    return this.apiService.get<Project[]>('projects');
  }

  /**
   * Get project by ID
   */
  getProjectById(id: string): Observable<Project> {
    return this.apiService.get<Project>(`projects/${id}`);
  }

  /**
   * Get completed projects
   */
  getCompletedProjects(): Observable<Project[]> {
    return this.apiService.get<Project[]>('projects/completed');
  }

  /**
   * Get projects in progress
   */
  getProjectsInProgress(): Observable<Project[]> {
    return this.apiService.get<Project[]>('projects/in-progress');
  }

  /**
   * Create new project
   */
  createProject(project: Partial<Project>): Observable<Project> {
    return this.apiService.post<Project>('projects', project);
  }

  /**
   * Update existing project
   */
  updateProject(id: string, project: Partial<Project>): Observable<Project> {
    return this.apiService.put<Project>(`projects/${id}`, project);
  }

  /**
   * Delete project
   */
  deleteProject(id: string): Observable<any> {
    return this.apiService.delete(`projects/${id}`);
  }
}