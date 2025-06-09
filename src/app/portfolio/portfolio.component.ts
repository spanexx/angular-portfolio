import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioHeaderComponent } from './portfolio-header/portfolio-header.component';
import { CompletedProjectsComponent } from './completed-projects/completed-projects.component';
import { ProjectsInProgressComponent } from './projects-in-progress/projects-in-progress.component';
import { ProjectCardComponent, Project } from './project-card/project-card.component';
import { PortfolioDataService } from '../core/services/portfolio-data.service';

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
export class PortfolioComponent implements OnInit {
  completedProjects: Project[] = [
    {
      title: 'Project Title 1',
      description: 'Short description of the project and technologies used.',
      viewLink: '#',
      githubLink: '#'
    },
    {
      title: 'Project Title 2',
      description: 'Short description of the project and technologies used.',
      viewLink: '#',
      githubLink: '#'
    },
    {
      title: 'Project Title 3',
      description: 'Short description of the project and technologies used.',
      viewLink: '#',
      githubLink: '#'
    }
  ];

  projectsInProgress: Project[] = [
    {
      title: 'Ongoing Project 1',
      description: 'Description of the ongoing project and current status.',
      inProgress: true,
      progress: 75,
      githubLink: '#'
    },
    {
      title: 'Ongoing Project 2',
      description: 'Description of the ongoing project and current status.',
      inProgress: true,
      progress: 45,
      githubLink: '#'
    }
  ];

  constructor(private portfolioDataService: PortfolioDataService) { }

  ngOnInit(): void {
    this.portfolioDataService.getProfile().subscribe(profile =>
      console.log('Profile:', profile));
      
    this.portfolioDataService.getProjects().subscribe(projects =>
      console.log('Projects:', projects));
      
    this.portfolioDataService.getEducation().subscribe(education =>
      console.log('Education:', education));
      
    this.portfolioDataService.getExperience().subscribe(experience =>
      console.log('Experience:', experience));
      
    this.portfolioDataService.getCertifications().subscribe(certifications =>
      console.log('Certifications:', certifications));
  }
}