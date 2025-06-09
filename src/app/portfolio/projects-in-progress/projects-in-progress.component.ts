import { Component } from '@angular/core';
import { Project, ProjectCardComponent } from '../project-card/project-card.component';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-projects-in-progress',
  standalone: true,
  imports: [ProjectCardComponent, CommonModule, FormsModule, NgFor],
  templateUrl: './projects-in-progress.component.html',
  styleUrl: './projects-in-progress.component.css'
})
export class ProjectsInProgressComponent {
  projectsInProgress: Project[] = [
    {
      title: 'AI Chatbot Integration',
      description: 'Integrating a custom AI chatbot into the portfolio for interactive Q&A.',
      inProgress: true,
      progress: 75
    },
    {
      title: 'Backend API Development',
      description: 'Building a robust backend API with Node.js and Express for project data management.',
      inProgress: true,
      progress: 50
    }
  ];

  handleCardClick(project: Project): void {
    console.log('Project In Progress Card Clicked:', project.title);
    // In a real application, you might navigate to a detail page or open a modal
  }
}
