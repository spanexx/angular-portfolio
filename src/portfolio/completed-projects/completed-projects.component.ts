import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../../app/core/services/mock-data.service';
import { ProjectService } from '../../app/core/services/project.service';
import { Project } from '../../app/shared/models';

@Component({
  selector: 'app-completed-projects',
  standalone: true,
  imports: [FormsModule, CommonModule, NgFor, RouterModule],
  templateUrl: './completed-projects.component.html',
  styleUrl: './completed-projects.component.css'
})
export class CompletedProjectsComponent implements OnInit {
  completedProjects: Project[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private mockDataService: MockDataService,
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCompletedProjects();
  }

  loadCompletedProjects(): void {
    this.isLoading = true;
    this.error = null;
    
    this.projectService.getCompletedProjects().subscribe({
      next: (projects) => {
        this.completedProjects = projects;
        this.isLoading = false;
      },
      error: (error) => {
        // Fallback to mock data if API fails
        console.warn('API failed, falling back to mock data:', error);
        this.completedProjects = this.mockDataService.getCompletedProjects();
        this.isLoading = false;
      }
    });
  }

  handleCardClick(project: Project): void {
    console.log('Completed Project Card Clicked:', project.title);
    this.navigateToProjectDetail(project);
  }

  navigateToProjectDetail(project: Project): void {
    if (project.id) {
      this.router.navigate(['/portfolio/project', project.id]);
    }
  }  truncateDescription(description: string, maxLength: number = 25): string {
    return description.length > maxLength 
      ? description.substring(0, maxLength) + '...' 
      : description;
  }

  getDisplayTechnologies(technologies: string[]): string[] {
    return technologies.slice(0, 3);
  }

  hasMoreTechnologies(technologies: string[]): boolean {
    return technologies.length > 3;
  }
}
