import { Component } from '@angular/core';
import { Project } from '../project-card/project-card.component';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProgressBarComponent } from '../../app/components/progress-bar/progress-bar.component';

@Component({
  selector: 'app-projects-in-progress',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor, RouterModule, ProgressBarComponent],
  templateUrl: './projects-in-progress.component.html',
  styleUrl: './projects-in-progress.component.css'
})
export class ProjectsInProgressComponent {
  projectsInProgress: Project[] = [
    {
      title: 'AI Chatbot Integration',
      description: 'Integrating a custom AI chatbot into the portfolio for interactive Q&A.',
      inProgress: true,
      progress: 75,
      technologies: ['Python', 'TensorFlow', 'Angular', 'WebSocket']
    },
    {
      title: 'Backend API Development',
      description: 'Building a robust backend API with Node.js and Express for project data management.',
      inProgress: true,
      progress: 50,
      technologies: ['Node.js', 'Express', 'MongoDB', 'JWT']
    },
    {
      title: 'Mobile App Development',
      description: 'Creating a cross-platform mobile application using React Native.',
      inProgress: true,
      progress: 30,
      technologies: ['React Native', 'Firebase', 'Redux', 'JavaScript']
    }
  ];

  handleCardClick(project: Project): void {
    console.log('Project In Progress Card Clicked:', project.title);
    // In a real application, you might navigate to a detail page or open a modal
  }

  getProjectProgress(project: Project): number {
    return project.progress || 0;
  }
}
