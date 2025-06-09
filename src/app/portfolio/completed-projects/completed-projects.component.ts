import { Component } from '@angular/core';
import { Project, ProjectCardComponent } from '../project-card/project-card.component';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-completed-projects',
  standalone: true,
  imports: [ProjectCardComponent, FormsModule, CommonModule, NgFor],
  templateUrl: './completed-projects.component.html',
  styleUrl: './completed-projects.component.css'
})
export class CompletedProjectsComponent {
  completedProjects: Project[] = [
    {
      title: 'E-commerce Platform',
      description: 'Developed a full-stack e-commerce platform with Angular, Node.js, and MongoDB.',
      viewLink: '#',
      githubLink: '#'
    },
    {
      title: 'Portfolio Website',
      description: 'Designed and developed a personal portfolio website using Angular and SCSS.',
      viewLink: '#',
      githubLink: '#'
    }
  ];

  handleCardClick(project: Project): void {
    console.log('Completed Project Card Clicked:', project.title);
    // In a real application, you might navigate to a detail page or open a modal
  }
}
