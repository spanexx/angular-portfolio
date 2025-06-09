import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioHeaderComponent } from './portfolio-header/portfolio-header.component';
import { CompletedProjectsComponent } from './completed-projects/completed-projects.component';
import { ProjectsInProgressComponent } from './projects-in-progress/projects-in-progress.component';
import { ProjectCardComponent } from './project-card/project-card.component';
import { PortfolioDataService } from '../app/core/services/portfolio-data.service';
import { Project, ProjectStatus } from '../app/shared/models';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [
    CommonModule,
    PortfolioHeaderComponent,
    CompletedProjectsComponent,
    ProjectsInProgressComponent,
    ProjectCardComponent
  ],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent implements OnInit, OnDestroy {
  completedProjects: Project[] = [];
  projectsInProgress: Project[] = [];

  private readonly destroy$ = new Subject<void>();

  private portfolioDataService = inject(PortfolioDataService);

  constructor() { }

  ngOnInit(): void {
    this.portfolioDataService.getProjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe(projects => {
        this.completedProjects = projects.filter(project => project.status === ProjectStatus.Completed);
        this.projectsInProgress = projects.filter(project => project.status === ProjectStatus.Active);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}