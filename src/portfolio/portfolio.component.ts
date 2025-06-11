import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioHeaderComponent } from './portfolio-header/portfolio-header.component';
import { CompletedProjectsComponent } from './completed-projects/completed-projects.component';
import { ProjectsInProgressComponent } from './projects-in-progress/projects-in-progress.component';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [
    CommonModule,
    PortfolioHeaderComponent,
    CompletedProjectsComponent,
    ProjectsInProgressComponent
  ],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent {
  constructor() { }
}