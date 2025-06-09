import { Component } from '@angular/core';
import { Project } from '../project-card/project-card.component';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-completed-projects',
  standalone: true,
  imports: [FormsModule, CommonModule, NgFor, RouterModule],
  templateUrl: './completed-projects.component.html',
  styleUrl: './completed-projects.component.css'
})
export class CompletedProjectsComponent {
  completedProjects: Project[] = [
    {
      title: 'E-commerce Platform',
      description: 'Developed a full-stack e-commerce platform with Angular, Node.js, and MongoDB.',
      viewLink: '#',
      githubLink: '#',
      technologies: ['Angular', 'Node.js', 'MongoDB', 'Express']
    },
    {
      title: 'Portfolio Website',
      description: 'Designed and developed a personal portfolio website using Angular and SCSS.',
      viewLink: '#',
      githubLink: '#',
      technologies: ['Angular', 'SCSS', 'TypeScript', 'HTML5']
    },
    {
      title: 'Task Management App',
      description: 'Built a collaborative task management application with real-time updates.',
      viewLink: '#',
      githubLink: '#',
      technologies: ['React', 'Node.js', 'Socket.io', 'PostgreSQL']
    }
  ];

  handleCardClick(project: Project): void {
    console.log('Completed Project Card Clicked:', project.title);
    // In a real application, you might navigate to a detail page or open a modal
  }
}
