import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PortfolioDataSource } from './portfolio-data-source';
import { Profile } from '../../shared/models/profile.model';
import { Project } from '../../shared/models/project.model';
import { Education } from '../../shared/models/education.model';
import { Experience } from '../../shared/models/experience.model';
import { Certification } from '../../shared/models/certification.model';
import { mockProfile, mockCompletedProjects, mockProjectsInProgress, mockEducations, mockExperiences, mockCertifications } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class MockPortfolioDataSource implements PortfolioDataSource {
  getProfile(): Observable<Profile> {
    return of(mockProfile);
  }
  getProjects(): Observable<Project[]> {
    return of([...mockCompletedProjects, ...mockProjectsInProgress]);
  }
  getEducation(): Observable<Education[]> {
    return of(mockEducations);
  }
  getExperience(): Observable<Experience[]> {
    return of(mockExperiences);
  }
  getCertifications(): Observable<Certification[]> {
    return of(mockCertifications);
  }
}