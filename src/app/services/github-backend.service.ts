import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, catchError, of, finalize } from 'rxjs';
import { environment } from '../../environments/environment';

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  repository?: string;
  repository_url?: string;
}

export interface GitHubRepo {
  name: string;
  html_url: string;
  description?: string;
  language?: string;
  stargazers_count?: number;
  updated_at?: string;
}

interface GitHubApiResponse<T> {
  success: boolean;
  data: T;
  fromCache?: boolean;
  timestamp?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GithubBackendService {
  private readonly apiUrl = `${environment.apiUrl}/github`;
  
  private commitsSubject = new BehaviorSubject<GitHubCommit[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  
  public commits$ = this.commitsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {
    console.log('GitHub Backend Service initialized');
  }

  /**
   * Fetch recent commits from backend
   */
  fetchCommits(): Observable<GitHubCommit[]> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.get<GitHubApiResponse<GitHubCommit[]>>(`${this.apiUrl}/commits`)
      .pipe(
        map(response => {
          if (response.success) {
            console.log(`Loaded ${response.data.length} commits${response.fromCache ? ' (from cache)' : ''}`);
            this.commitsSubject.next(response.data);
            return response.data;
          } else {
            throw new Error(response.error || 'Failed to fetch commits');
          }
        }),
        catchError(error => {
          console.error('Error fetching commits:', error);
          const errorMessage = this.formatErrorMessage(error);
          this.errorSubject.next(errorMessage);
          
          // Return current commits if any, otherwise empty array
          const currentCommits = this.commitsSubject.getValue();
          return of(currentCommits);
        }),
        finalize(() => {
          this.loadingSubject.next(false);
        })
      );
  }

  /**
   * Fetch user repositories from backend
   */
  fetchRepositories(): Observable<GitHubRepo[]> {
    return this.http.get<GitHubApiResponse<GitHubRepo[]>>(`${this.apiUrl}/repos`)
      .pipe(
        map(response => {
          if (response.success) {
            console.log(`Loaded ${response.data.length} repositories`);
            return response.data;
          } else {
            throw new Error(response.error || 'Failed to fetch repositories');
          }
        }),
        catchError(error => {
          console.error('Error fetching repositories:', error);
          return of([]);
        })
      );
  }

  /**
   * Force refresh GitHub data (bypass cache)
   */
  forceRefresh(): Observable<GitHubCommit[]> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.post<GitHubApiResponse<GitHubCommit[]>>(`${this.apiUrl}/refresh`, {})
      .pipe(
        map(response => {
          if (response.success) {
            console.log('GitHub data refreshed successfully');
            this.commitsSubject.next(response.data);
            return response.data;
          } else {
            throw new Error(response.error || 'Failed to refresh GitHub data');
          }
        }),
        catchError(error => {
          console.error('Error refreshing GitHub data:', error);
          const errorMessage = this.formatErrorMessage(error);
          this.errorSubject.next(errorMessage);
          return of([]);
        }),
        finalize(() => {
          this.loadingSubject.next(false);
        })
      );
  }

  /**
   * Get cached commits without making API call
   */
  getCachedCommits(): GitHubCommit[] {
    return this.commitsSubject.getValue();
  }

  /**
   * Check if we have any commits loaded
   */
  hasCommits(): boolean {
    return this.commitsSubject.getValue().length > 0;
  }

  /**
   * Clear all data and reset state
   */
  clearData(): void {
    this.commitsSubject.next([]);
    this.errorSubject.next(null);
    this.loadingSubject.next(false);
  }

  private formatErrorMessage(error: any): string {
    if (error.status === 429) {
      return 'GitHub API rate limit exceeded. Please try again later.';
    }
    if (error.status === 404) {
      return 'GitHub user not found. Please check the configuration.';
    }
    if (error.status === 401) {
      return 'GitHub authentication failed. Please check the token.';
    }
    if (error.status === 0) {
      return 'Network error. Please check your internet connection.';
    }
    if (error.error?.error) {
      return error.error.error;
    }
    return error.message || 'An unexpected error occurred while fetching GitHub data.';
  }
}