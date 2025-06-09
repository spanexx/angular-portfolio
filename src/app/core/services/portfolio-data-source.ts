import { Observable } from 'rxjs';
import { Profile } from '../../shared/models/profile.model';
import { Project } from '../../shared/models/project.model';
import { Education } from '../../shared/models/education.model';
import { Experience } from '../../shared/models/experience.model';
import { Certification } from '../../shared/models/certification.model';

export interface PortfolioDataSource {
  getProfile(): Observable<Profile>;
  getProjects(): Observable<Project[]>;
  getEducation(): Observable<Education[]>;
  getExperience(): Observable<Experience[]>;
  getCertifications(): Observable<Certification[]>;
}