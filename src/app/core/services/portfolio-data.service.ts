import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProjectStatus } from '../../shared/models/project-status.enum';
import { Profile } from '../../shared/models/profile.model';
import { Project } from '../../shared/models/project.model';
import { Education } from '../../shared/models/education.model';
import { Experience } from '../../shared/models/experience.model';
import { Certification } from '../../shared/models/certification.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioDataService {

  constructor() { }

  getProfile(): Observable<Profile> {
    // Static mock data - will be replaced with API call later
    const mockProfile: Profile = {
      name: 'John Doe',
      title: 'Senior Software Engineer',
      bio: 'Passionate full-stack developer with 5+ years of experience',
      imageUrl: 'assets/profile.jpg'
    };
    return of(mockProfile);
  }

  getProjects(): Observable<Project[]> {
    // Static mock data
    const mockProjects: Project[] = [
      {
        title: 'E-commerce Platform',
        description: 'Full-featured online shopping platform',
        technologies: ['Angular', 'Node.js', 'MongoDB'],
        status: ProjectStatus.Completed,
        imageUrl: 'assets/projects/ecommerce.jpg'
      },
      {
        title: 'Portfolio Website',
        description: 'Personal portfolio showcasing projects',
        technologies: ['Angular', 'SCSS'],
        status: ProjectStatus.Active,
        imageUrl: 'assets/projects/portfolio.jpg'
      }
    ];
    return of(mockProjects);
  }

  getEducation(): Observable<Education[]> {
    // Static mock data
    const mockEducation: Education[] = [
      {
        institution: 'Tech University',
        degree: 'MSc Computer Science',
        fieldOfStudy: 'Web Technologies',
        startDate: '2015-09-01',
        endDate: '2017-06-30',
        description: 'Specialized in web technologies'
      },
      {
        institution: 'State College',
        degree: 'BSc Software Engineering',
        fieldOfStudy: 'Software Development',
        startDate: '2011-09-01',
        endDate: '2015-06-30',
        description: 'Graduated with honors'
      }
    ];
    return of(mockEducation);
  }

  getExperience(): Observable<Experience[]> {
    // Static mock data
    const mockExperience: Experience[] = [
      {
        company: 'Tech Solutions Inc.',
        role: 'Senior Developer',
        startDate: '2020-03-01',
        endDate: 'Present',
        responsibilities: [
          'Lead frontend development',
          'Architect Angular applications'
        ]
      },
      {
        company: 'WebDev Agency',
        role: 'Full-stack Developer',
        startDate: '2017-01-01',
        endDate: '2020-02-29',
        responsibilities: [
          'Developed client websites',
          'Implemented REST APIs'
        ]
      }
    ];
    return of(mockExperience);
  }

  getCertifications(): Observable<Certification[]> {
    // Static mock data
    const mockCertifications: Certification[] = [
      {
        name: 'Angular Certified Developer',
        issuer: 'Google',
        date: '2023-05-15'
      },
      {
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon',
        date: '2022-11-20'
      }
    ];
    return of(mockCertifications);
  }
}