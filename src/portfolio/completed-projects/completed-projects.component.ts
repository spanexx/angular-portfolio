import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MockDataService } from '../../app/core/services/mock-data.service';
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

  constructor(
    private mockDataService: MockDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.completedProjects = this.mockDataService.getCompletedProjects();
  }

  handleCardClick(project: Project): void {
    console.log('Completed Project Card Clicked:', project.title);
    this.navigateToProjectDetail(project);
  }

  navigateToProjectDetail(project: Project): void {
    if (project.id) {
      this.router.navigate(['/portfolio/project', project.id]);
    }
  }
  truncateDescription(description: string, maxLength: number = 20): string {
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
