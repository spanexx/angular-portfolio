import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../../shared/models/profile.model';
import { Project } from '../../shared/models/project.model';
import { Education } from '../../shared/models/education.model';
import { Experience } from '../../shared/models/experience.model';
import { Certification } from '../../shared/models/certification.model';
import { MockPortfolioDataSource } from './mock-portfolio-data-source';
import { HttpPortfolioDataSource } from './http-portfolio-data-source';
import { PortfolioDataSource } from './portfolio-data-source';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PortfolioDataService {

  private dataSource: PortfolioDataSource;

  private http = inject(HttpClient);

  constructor() {
    this.dataSource = new MockPortfolioDataSource();
  }

  getProfile(): Observable<Profile> {
    return this.dataSource.getProfile();
  }

  getProjects(): Observable<Project[]> {
    return this.dataSource.getProjects();
  }

  getEducation(): Observable<Education[]> {
    return this.dataSource.getEducation();
  }

  getExperience(): Observable<Experience[]> {
    return this.dataSource.getExperience();
  }

  getCertifications(): Observable<Certification[]> {
    return this.dataSource.getCertifications();
  }
}