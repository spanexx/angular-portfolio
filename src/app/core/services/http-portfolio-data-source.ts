import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PortfolioDataSource } from './portfolio-data-source';
import { Profile } from '../../shared/models/profile.model';
import { Project } from '../../shared/models/project.model';
import { Experience } from '../../shared/models/experience.model';
import { Education } from '../../shared/models/education.model';
import { Certification } from '../../shared/models/certification.model';

@Injectable({
  providedIn: 'root'
})
export class HttpPortfolioDataSource implements PortfolioDataSource {

  private readonly dataUrl = 'assets/data.json';

  constructor(private http: HttpClient) { }

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(this.dataUrl);
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.dataUrl);
  }

  getExperience(): Observable<Experience[]> {
    return this.http.get<Experience[]>(this.dataUrl);
  }

  getEducation(): Observable<Education[]> {
    return this.http.get<Education[]>(this.dataUrl);
  }

  getCertifications(): Observable<Certification[]> {
    return this.http.get<Certification[]>(this.dataUrl);
  }
}