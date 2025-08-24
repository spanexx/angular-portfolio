import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { GithubBackendService, GitHubCommit } from '../services/github-backend.service';

@Component({
  selector: 'app-github-activity',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './github-activity.component.html',
  styleUrls: ['./github-activity.component.scss']
})
export class GithubActivityComponent implements OnInit, OnDestroy {  
    
  commits: GitHubCommit[] = [];
  isTracking: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  statusText: string = 'Loading your GitHub activity...';
  lastUpdate: string = 'Never updated';

  private trackingInterval?: Subscription;
  private subscriptions: Subscription[] = [];

  constructor(private githubService: GithubBackendService) {}

  ngOnInit(): void {
    // Subscribe to the service observables
    this.subscriptions.push(
      this.githubService.commits$.subscribe(commits => {
        this.commits = commits;
        if (commits.length > 0 && !this.isLoading) {
          this.statusText = 'Showing GitHub activity';
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

    // Load initial data
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.stopTracking();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadInitialData(): void {
    // Check if we already have cached commits
    if (this.githubService.hasCommits()) {
      this.commits = this.githubService.getCachedCommits();
      this.statusText = 'Showing GitHub activity (cached)';
      this.lastUpdate = 'Loaded from cache';
    } else {
      // Fetch fresh data
      this.fetchCommits();
    }
  }

  private fetchCommits(): void {
    this.githubService.fetchCommits().subscribe({
      next: (commits) => {
        // Data is already handled by observables
        console.log(`Loaded ${commits.length} commits`);
      },
      error: (error) => {
        console.error('Error fetching commits:', error);
      }
    });
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

    this.isTracking = true;
    this.errorMessage = '';

    // Fetch fresh data when user starts tracking
    this.fetchCommits();

    // Set up periodic refresh (every 5 minutes)
    this.trackingInterval = interval(5 * 60 * 1000).subscribe(() => {
      console.log('Checking for GitHub updates...');
      this.fetchCommits();
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

  getShortSha(sha: string): string {
    return sha.substring(0, 7);
  }

  trackByCommitSha(index: number, commit: GitHubCommit): string {
    return commit.sha;
  }

  async forceRefresh(): Promise<void> {
    this.statusText = 'Refreshing from GitHub...';
    this.githubService.forceRefresh().subscribe({
      next: (commits) => {
        this.statusText = 'Showing GitHub activity';
        this.lastUpdate = `Last updated: ${new Date().toLocaleTimeString()}`;
        console.log(`Refreshed ${commits.length} commits`);
      },
      error: (error) => {
        console.error('Error refreshing commits:', error);
      }
    });
  }
}
