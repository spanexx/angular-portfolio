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

@Injectable({
  providedIn: 'root'
})
export class GithubApiService {
  private readonly baseUrl = environment.githubApiUrl;
  
  private commitsSubject = new BehaviorSubject<GitHubCommit[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  
  public commits$ = this.commitsSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();
  private lastSeenCommitSha: string | null = null;
  
  constructor(private http: HttpClient) {
    console.log('GitHub API Service initialized');
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

  // Fetch commits only if there is a new commit (by SHA)
  async fetchCommitsIfNew(username: string, token: string | null = null): Promise<GitHubCommit[]> {
    const headers = this.buildHeaders(token);
    const repos = await this.fetchUserRepositories(username, headers);
    if (repos.length === 0) return [];

    // Get the latest commit SHA from all repos
    let latestSha: string | null = null;
    let latestDate: number = 0;
    let latestRepo: GitHubRepo | null = null;
    for (const repo of repos) {
      const commits = await this.fetchRepositoryCommits(username, repo.name, headers);
      if (commits.length > 0) {
        const commitDate = new Date(commits[0].commit.author.date).getTime();
        if (commitDate > latestDate) {
          latestDate = commitDate;
          latestSha = commits[0].sha;
          latestRepo = repo;
        }
      }
    }
    if (latestSha && latestSha !== this.lastSeenCommitSha) {
      // New commit found, fetch all recent commits as before
      this.lastSeenCommitSha = latestSha;
      const allCommits: GitHubCommit[] = [];
      for (const repo of repos) {
        const repoCommits = await this.fetchRepositoryCommits(username, repo.name, headers);
        allCommits.push(...repoCommits.map(commit => ({ ...commit, repository: repo.name, repository_url: repo.html_url })));
      }
      allCommits.sort((a, b) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime());
      const finalCommits = allCommits.slice(0, 20);
      this.commitsSubject.next(finalCommits);
      return finalCommits;
    } else {
      // No new commit, do not fetch again
      return this.commitsSubject.getValue();
    }
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
    let repos: GitHubRepo[] = [];
    let page = 1;
    const perPage = 100; // GitHub API max per page
    let hasMore = true;
    while (hasMore) {
      const url = `${this.baseUrl}/users/${username}/repos?sort=updated&per_page=${perPage}&page=${page}`;
      try {
        const response = await firstValueFrom(
          this.http.get<GitHubRepo[]>(url, { headers })
        );
        repos = repos.concat(response);
        if (response.length < perPage) {
          hasMore = false;
        } else {
          page++;
        }
      } catch (error: any) {
        if (error.status === 404) {
          throw new Error(`User '${username}' not found`);
        }
        throw error;
      }
    }
    return repos;
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
