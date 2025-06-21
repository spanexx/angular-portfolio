import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface GitHubRepo {
  name: string;
  html_url: string;
}

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

interface CachedData {
  commits: GitHubCommit[];
  timestamp: number;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class GithubApiService {
  private readonly baseUrl = environment.githubApiUrl;
  private readonly CACHE_DURATION = 2 * 60 * 1000; // Reduced to 2 minutes for more frequent updates
  private readonly CACHE_KEY = 'github_commits_cache';
  
  private commitsSubject = new BehaviorSubject<GitHubCommit[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  
  public commits$ = this.commitsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();
  constructor(private http: HttpClient) {
    console.log('GitHub API Service initialized');
    this.loadFromCache();
  }

  // Force refresh - bypass cache
  async forceRefresh(username: string, token: string | null = null): Promise<GitHubCommit[]> {
    console.log(`Force refreshing commits for ${username}...`);
    
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    try {
      const headers = this.buildHeaders(token);
      const repos = await this.fetchUserRepositories(username, headers);
      console.log(`Found ${repos.length} repositories for ${username}`);
      
      const commits: GitHubCommit[] = [];
      const repoPromises = repos.slice(0, 5).map(async (repo) => {
        try {
          const repoCommits = await this.fetchRepositoryCommits(username, repo.name, headers);
          return repoCommits.map(commit => ({
            ...commit,
            repository: repo.name,
            repository_url: repo.html_url
          }));
        } catch (error) {
          console.warn(`Failed to fetch commits for ${repo.name}:`, error);
          return [];
        }
      });

      const allRepoCommits = await Promise.all(repoPromises);
      allRepoCommits.forEach(repoCommits => {
        commits.push(...repoCommits);
      });

      commits.sort((a, b) => 
        new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()
      );

      const finalCommits = commits.slice(0, 20);
      
      // Update cache with fresh data
      this.cacheData(username, finalCommits);
      this.commitsSubject.next(finalCommits);
      
      return finalCommits;
    } catch (error: any) {
      console.error('Error force refreshing commits:', error);
      const errorMessage = this.formatErrorMessage(error);
      this.errorSubject.next(errorMessage);
      throw new Error(errorMessage);
    } finally {
      this.loadingSubject.next(false);
    }
  }async fetchCommits(username: string, token: string | null = null): Promise<GitHubCommit[]> {
    console.log(`Fetching commits for ${username}, cache check...`);
    
    // Check if we have cached data that's still valid
    const cachedData = this.getValidCachedData(username);
    if (cachedData) {
      console.log(`Using cached data for ${username}, ${cachedData.commits.length} commits`);
      this.commitsSubject.next(cachedData.commits);
      return cachedData.commits;
    }

    console.log(`No valid cache found for ${username}, fetching fresh data...`);
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    try {
      const headers = this.buildHeaders(token);

      // First, get user's repositories
      const repos = await this.fetchUserRepositories(username, headers);
      console.log(`Found ${repos.length} repositories for ${username}`);
      
      const commits: GitHubCommit[] = [];

      // Get recent commits from each repository (limit to 5 repos to avoid rate limits)
      const repoPromises = repos.slice(0, 5).map(async (repo) => {
        try {
          const repoCommits = await this.fetchRepositoryCommits(username, repo.name, headers);
          return repoCommits.map(commit => ({
            ...commit,
            repository: repo.name,
            repository_url: repo.html_url
          }));
        } catch (error) {
          console.warn(`Failed to fetch commits for ${repo.name}:`, error);
          return [];
        }
      });

      const allRepoCommits = await Promise.all(repoPromises);
      
      // Flatten and combine all commits
      allRepoCommits.forEach(repoCommits => {
        commits.push(...repoCommits);
      });

      // Sort commits by date (newest first)
      commits.sort((a, b) => 
        new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()
      );

      const finalCommits = commits.slice(0, 20); // Return latest 20 commits
      
      // Cache the results
      this.cacheData(username, finalCommits);
      this.commitsSubject.next(finalCommits);
      
      return finalCommits;
    } catch (error: any) {
      console.error('Error fetching commits:', error);
      const errorMessage = this.formatErrorMessage(error);
      this.errorSubject.next(errorMessage);
      throw new Error(errorMessage);
    } finally {
      this.loadingSubject.next(false);
    }
  }

  // Method to get cached commits without making API call
  getCachedCommits(username: string): GitHubCommit[] | null {
    const cachedData = this.getValidCachedData(username);
    if (cachedData) {
      this.commitsSubject.next(cachedData.commits);
      return cachedData.commits;
    }
    return null;
  }

  // Method to refresh data in background
  async refreshInBackground(username: string, token: string | null = null): Promise<void> {
    try {
      await this.fetchCommits(username, token);
    } catch (error) {
      console.warn('Background refresh failed:', error);
    }
  }

  // Check if cache needs refresh
  shouldRefresh(username: string): boolean {
    return !this.getValidCachedData(username);
  }

  private loadFromCache(): void {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (cached) {
        const data: CachedData = JSON.parse(cached);
        if (this.isCacheValid(data)) {
          this.commitsSubject.next(data.commits);
        }
      }
    } catch (error) {
      console.warn('Failed to load from cache:', error);
    }
  }

  private cacheData(username: string, commits: GitHubCommit[]): void {
    try {
      // Get existing cached data for this user
      const cached = localStorage.getItem(this.CACHE_KEY);
      let mergedCommits = commits;
      if (cached) {
        const data: CachedData = JSON.parse(cached);
        if (data.username === username && Array.isArray(data.commits)) {
          // Merge, deduplicate by SHA
          const shaSet = new Set(commits.map(c => c.sha));
          const additionalCommits = data.commits.filter(c => !shaSet.has(c.sha));
          mergedCommits = [...commits, ...additionalCommits];
        }
      }
      // Sort by date (newest first)
      mergedCommits.sort((a, b) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime());
      // Keep only the latest 20
      mergedCommits = mergedCommits.slice(0, 20);
      const data: CachedData = {
        commits: mergedCommits,
        timestamp: Date.now(),
        username
      };
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  }

  private getValidCachedData(username: string): CachedData | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (cached) {
        const data: CachedData = JSON.parse(cached);
        if (data.username === username && this.isCacheValid(data)) {
          return data;
        }
      }
    } catch (error) {
      console.warn('Failed to get cached data:', error);
    }
    return null;
  }

  private isCacheValid(data: CachedData): boolean {
    return (Date.now() - data.timestamp) < this.CACHE_DURATION;
  }
  private buildHeaders(token: string | null): HttpHeaders {
    let headers = new HttpHeaders({
      'Accept': 'application/vnd.github.v3+json'
    });

    if (token) {
      headers = headers.set('Authorization', `token ${token}`);
    }

    return headers;
  }

  private async fetchUserRepositories(username: string, headers: HttpHeaders): Promise<GitHubRepo[]> {
    const url = `${this.baseUrl}/users/${username}/repos?sort=updated&per_page=10`;
    
    try {
      const response = await firstValueFrom(
        this.http.get<GitHubRepo[]>(url, { headers })
      );
      return response;
    } catch (error: any) {
      if (error.status === 404) {
        throw new Error(`User '${username}' not found`);
      }
      throw error;
    }
  }

  private async fetchRepositoryCommits(username: string, repoName: string, headers: HttpHeaders): Promise<GitHubCommit[]> {
    const url = `${this.baseUrl}/repos/${username}/${repoName}/commits?per_page=5`;
    
    const response = await firstValueFrom(
      this.http.get<GitHubCommit[]>(url, { headers })
    );
    return response;
  }

  private formatErrorMessage(error: any): string {
    if (error.status === 403) {
      return 'Rate limit exceeded. Please add a GitHub token for higher limits.';
    }
    if (error.status === 404) {
      return 'User not found. Please check the username.';
    }
    if (error.status === 401) {
      return 'Invalid GitHub token. Please check your token.';
    }
    if (error.status === 0) {
      return 'Network error. Please check your internet connection.';
    }
    return error.message || 'An unexpected error occurred while fetching GitHub data.';
  }
}
