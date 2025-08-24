import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PortfolioDataSource } from './portfolio-data-source';
import { Profile } from '../../shared/models/profile.model';
import { Project } from '../../shared/models/project.model';
import { Experience } from '../../shared/models/experience.model';
import { Education } from '../../shared/models/education.model';
import { Certification } from '../../shared/models/certification.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class HttpPortfolioDataSource implements PortfolioDataSource {

  constructor(private apiService: ApiService) { }

  getProfile(): Observable<Profile> {
    return this.apiService.get<Profile>('profile');
  }

  getProjects(): Observable<Project[]> {
    return this.apiService.get<Project[]>('projects');
  }

  getExperience(): Observable<Experience[]> {
    return this.apiService.get<Experience[]>('experiences');
  }

  getEducation(): Observable<Education[]> {
    return this.apiService.get<Education[]>('educations');
  }

  getCertifications(): Observable<Certification[]> {
    return this.apiService.get<Certification[]>('certifications');
  }
}