import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { GithubApiService, GitHubCommit } from '../services/github-api.service';
import { environment } from '../../../environment';

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
  errorMessage: string = '';
  statusText: string = 'Loading your GitHub activity...';
  lastUpdate: string = 'Never updated';

  private trackingInterval?: Subscription;
  private subscriptions: Subscription[] = [];

  constructor(private githubService: GithubApiService) {}

  ngOnInit(): void {
    // Subscribe to the service observables
    this.subscriptions.push(
      this.githubService.commits$.subscribe(commits => {
        this.commits = commits;
        if (commits.length > 0 && !this.isLoading) {
          this.statusText = `Showing ${this.username}'s activity`;
          this.lastUpdate = `Last updated: ${new Date().toLocaleTimeString()}`;
        }
      }),
      
      this.githubService.loading$.subscribe(loading => {
        this.isLoading = loading;
        if (loading) {
          this.statusText = 'Fetching commits...';
          this.errorMessage = '';
        }
      }),
      
      this.githubService.error$.subscribe(error => {
        this.errorMessage = error || '';
        if (error) {
          this.statusText = 'Error fetching commits';
        }
      })
    );

    // Try to load cached data first
    this.loadCachedDataAndStart();
  }

  ngOnDestroy(): void {
    this.stopTracking();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private async loadCachedDataAndStart(): Promise<void> {
    // First, try to get cached data immediately
    const cachedCommits = this.githubService.getCachedCommits(this.username);
    
    if (cachedCommits && cachedCommits.length > 0) {
      // We have cached data, show it immediately
      this.statusText = `Showing ${this.username}'s activity (cached)`;
      this.lastUpdate = 'Loaded from cache';
      
      // Check if we should refresh in background
      if (this.githubService.shouldRefresh(this.username)) {
        // Start background refresh
        this.githubService.refreshInBackground(this.username, this.token || null);
      }
    } else {
      // No cached data, need to fetch
      this.statusText = 'Loading your GitHub activity...';
    }

    // Auto-start tracking if username is provided
    if (this.username) {
      setTimeout(() => this.startTracking(), 1000);
    }
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
    this.errorMessage = '';

    // Only fetch if we don't have recent cached data
    if (this.githubService.shouldRefresh(this.username)) {
      await this.updateCommits();
    }

    // Set up periodic refresh (every 5 minutes instead of 30 seconds to be more reasonable)
    this.trackingInterval = interval(5 * 60 * 1000).subscribe(() => {
      if (this.githubService.shouldRefresh(this.username)) {
        this.updateCommits();
      }
    });
  }

  stopTracking(): void {
    if (!this.isTracking) return;

    this.isTracking = false;
    this.statusText = 'Tracking stopped';
    
    if (this.trackingInterval) {
      this.trackingInterval.unsubscribe();
      this.trackingInterval = undefined;
    }
  }

  private async updateCommits(): Promise<void> {
    try {
      await this.githubService.fetchCommits(this.username, this.token || null);
      // The observables will handle updating the UI
    } catch (error: any) {
      // Error handling is done through the error observable
      console.error('Failed to update commits:', error);
    }
  }

  getShortSha(sha: string): string {
    return sha.substring(0, 7);
  }

  trackByCommitSha(index: number, commit: GitHubCommit): string {
    return commit.sha;
  }
}
