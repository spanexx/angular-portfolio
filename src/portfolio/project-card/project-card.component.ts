import { Component, Input } from '@angular/core';
import { ProgressBarComponent } from '../../app/components/progress-bar/progress-bar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

export interface Project {
  title: string;
  description: string;
  inProgress?: boolean;
  progress?: number;
  viewLink?: string;
  githubLink?: string;
  technologies?: string[];
}

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, ProgressBarComponent, FormsModule, RouterLink],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {
  @Input() project!: Project;

  constructor(private router: Router) {}

  get displayProgress(): number {
    return this.project.progress || 0;
  }

  onCardClick(): void {
    if (this.project.viewLink) {
      this.router.navigate(['/project', this.project.title]);
    }
  }
}
