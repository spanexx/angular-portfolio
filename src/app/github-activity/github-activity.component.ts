import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { GithubApiService, GitHubCommit } from '../services/github-api.service';
import { environment } from '../../../environment';
import e from 'cors';

@Component({
  selector: 'app-github-activity',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './github-activity.component.html',
  styleUrls: ['./github-activity.component.scss']
})
export class GithubActivityComponent implements OnInit, OnDestroy {  
    
  username: string = 'spanexx';  
  token: string = environment.githubToken;
  commits: GitHubCommit[] = [];
  isTracking: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';  statusText: string = 'Loading your GitHub activity...';
  lastUpdate: string = 'Never updated';

  private trackingInterval?: Subscription;

  constructor(private githubService: GithubApiService) {}

  ngOnInit(): void {
    // Auto-start if username is provided
    if (this.username) {
      setTimeout(() => this.startTracking(), 2000);
    }
  }

  ngOnDestroy(): void {
    this.stopTracking();
  }

  formatTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  }

  async startTracking(): Promise<void> {
    if (this.isTracking) return;

    if (!this.username.trim()) {
      this.errorMessage = 'Please enter a GitHub username';
      return;
    }

    this.isTracking = true;
    this.isLoading = true;
    this.errorMessage = '';
    this.statusText = 'Starting tracking...';

    await this.updateCommits();

    // Poll every 30 seconds
    this.trackingInterval = interval(30000).subscribe(() => {
      this.updateCommits();
    });
  }

  stopTracking(): void {
    if (!this.isTracking) return;

    this.isTracking = false;
    this.isLoading = false;
    this.statusText = 'Tracking stopped';
    
    if (this.trackingInterval) {
      this.trackingInterval.unsubscribe();
      this.trackingInterval = undefined;
    }
  }

  private async updateCommits(): Promise<void> {
    try {
      this.statusText = 'Fetching commits...';
      this.commits = await this.githubService.fetchCommits(this.username, this.token || null);
      this.statusText = `Tracking ${this.username}'s activity`;
      this.lastUpdate = `Last updated: ${new Date().toLocaleTimeString()}`;
      this.errorMessage = '';
      this.isLoading = false;
    } catch (error: any) {
      this.statusText = 'Error fetching commits';
      this.errorMessage = error.message || 'Failed to fetch GitHub activity';
      this.isLoading = false;
    }
  }
  getShortSha(sha: string): string {
    return sha.substring(0, 7);
  }

  trackByCommitSha(index: number, commit: GitHubCommit): string {
    return commit.sha;
  }
}
