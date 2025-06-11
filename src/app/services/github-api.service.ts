import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
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

  constructor(private http: HttpClient) {}

  async fetchCommits(username: string, token: string | null = null): Promise<GitHubCommit[]> {
    try {
      const headers = this.buildHeaders(token);

      // First, get user's repositories
      const repos = await this.fetchUserRepositories(username, headers);
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

      return commits.slice(0, 20); // Return latest 20 commits
    } catch (error: any) {
      console.error('Error fetching commits:', error);
      throw new Error(this.formatErrorMessage(error));
    }
  }

  private buildHeaders(token: string | null): HttpHeaders {
    let headers = new HttpHeaders({
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Activity-Tracker'
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
