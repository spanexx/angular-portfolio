import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProgressBarComponent } from '../../components/progress-bar/progress-bar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Project {
  title: string;
  description: string;
  inProgress?: boolean;
  progress?: number;
  viewLink?: string;
  githubLink?: string;
}

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, ProgressBarComponent, FormsModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {
  @Input() project!: Project;
  @Output() cardClicked = new EventEmitter<Project>();

  get displayProgress(): number {
    return this.project.progress || 0;
  }

  onCardClick(): void {
    this.cardClicked.emit(this.project);
  }
}
