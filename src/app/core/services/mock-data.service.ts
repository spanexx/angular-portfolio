import { Injectable } from '@angular/core';
import { Project, Education, Experience, Certification, ContactInfo, Profile } from '../../shared/models';
import { mockCompletedProjects, mockProjectsInProgress, mockEducations, mockExperiences, mockCertifications, mockContactInfo, mockProfile } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private allProjects: Project[] = [...mockCompletedProjects, ...mockProjectsInProgress];

  getProjects(): Project[] {
    return this.allProjects;
  }

  getProjectById(id: string): Project | undefined {
    return this.allProjects.find(project => project.id === id);
  }

  getCompletedProjects(): Project[] {
    return mockCompletedProjects;
  }

  getProjectsInProgress(): Project[] {
    return mockProjectsInProgress;
  }

  getEducations(): Education[] {
    return mockEducations;
  }

  getExperiences(): Experience[] {
    return mockExperiences;
  }
  getCertifications(): Certification[] {
    return mockCertifications;
  }

  getContactInfo(): ContactInfo {
    return mockContactInfo;
  }

  getProfile(): Profile {
    return mockProfile;
  }
}
