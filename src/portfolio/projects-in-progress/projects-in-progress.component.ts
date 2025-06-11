import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProgressBarComponent } from '../../app/components/progress-bar/progress-bar.component';
import { Project } from '../../app/shared/models';
import { MockDataService } from '../../app/core/services/mock-data.service';

@Component({
  selector: 'app-projects-in-progress',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor, RouterModule, ProgressBarComponent],
  templateUrl: './projects-in-progress.component.html',
  styleUrl: './projects-in-progress.component.css'
})
export class ProjectsInProgressComponent implements OnInit {
  projectsInProgress: Project[] = [];

  constructor(
    private mockDataService: MockDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectsInProgress = this.mockDataService.getProjectsInProgress();
  }

  handleCardClick(project: Project): void {
    console.log('Project In Progress Card Clicked:', project.title);
    this.navigateToProjectDetail(project);
  }

  navigateToProjectDetail(project: Project): void {
    if (project.id) {
      this.router.navigate(['/portfolio/project', project.id]);
    }
  }

  getProjectProgress(project: Project): number {
    return project.progress || 0;
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
