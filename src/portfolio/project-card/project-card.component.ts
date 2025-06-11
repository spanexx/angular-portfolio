import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ProgressBarComponent } from '../../app/components/progress-bar/progress-bar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Project } from '../../app/shared/models';



@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, ProgressBarComponent, FormsModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ProjectCardComponent {
  @Input() project!: Project;

  constructor(private router: Router) {}

  get displayProgress(): number {
    return this.project.progress || 0;
  }
  get truncatedDescription(): string {
    const maxLength = 20; // Limit description to 20 characters
    if (this.project.description.length <= maxLength) {
      return this.project.description;
    }
    return this.project.description.substring(0, maxLength).trim() + '...';
  }

  get displayTechnologies(): string[] {
    // Show only first 3 technologies
    return this.project.technologies.slice(0, 3);
  }

  get hasMoreTechnologies(): boolean {
    return this.project.technologies.length > 3;
  }

  onCardClick(): void {
    if (this.project.id) {
      this.router.navigate(['/portfolio/project', this.project.id]);
    }
  }

  onViewProject(): void {
    if (this.project.viewLink) {
      window.open(this.project.viewLink, '_blank');
    }
  }

  onViewGitHub(): void {
    if (this.project.githubLink) {
      window.open(this.project.githubLink, '_blank');
    }
  }
}
