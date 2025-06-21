import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GithubApiService, GitHubCommit } from '../../services/github-api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-current-work',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './current-work.component.html',
  styleUrls: ['./current-work.component.scss']
})
export class CurrentWorkComponent implements OnInit, OnDestroy {
  currentProject: any = null;
  latestCommit: GitHubCommit | null = null;
  isLoading = false;
  private subscription?: Subscription;

  constructor(private githubService: GithubApiService) {}

  ngOnInit() {
    this.loadCurrentWork();
    
    // Subscribe to GitHub commits updates
    this.subscription = this.githubService.commits$.subscribe(commits => {
      if (commits && commits.length > 0) {
        this.processLatestCommit(commits[0]);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private async loadCurrentWork() {
    try {
      this.isLoading = true;
      // Always fetch latest commits (or use fetchCommitsIfNew for optimized requests)
      const commits = await this.githubService.fetchCommits('spanexx', 'YOUR_GITHUB_TOKEN_HERE');
      if (commits && commits.length > 0) {
        this.processLatestCommit(commits[0]);
      }
    } catch (error) {
      console.warn('Failed to load current work:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private processLatestCommit(commit: GitHubCommit) {
    this.latestCommit = commit;
    this.currentProject = this.analyzeProject(commit);
  }

  private analyzeProject(commit: GitHubCommit): any {
    const repoName = commit.repository || 'Unknown Project';
    const commitMessage = commit.commit.message;
    const commitDate = new Date(commit.commit.author.date);
    
    // Analyze the project type based on repository name and commit message
    const projectType = this.getProjectType(repoName, commitMessage);
    const status = this.getProjectStatus(commitMessage);
    const description = this.getProjectDescription(repoName, commitMessage);

    return {
      name: this.formatProjectName(repoName),
      type: projectType,
      status: status,
      description: description,
      lastActivity: this.formatTimeAgo(commitDate),
      repository: repoName,
      repositoryUrl: commit.repository_url,
      commitMessage: commitMessage.split('\n')[0], // First line only
      commitSha: commit.sha.substring(0, 7)
    };
  }

  private getProjectType(repoName: string, commitMessage: string): string {
    const repo = repoName.toLowerCase();
    const message = commitMessage.toLowerCase();

    if (repo.includes('angular') || message.includes('angular')) return 'Angular Application';
    if (repo.includes('react') || message.includes('react')) return 'React Application';
    if (repo.includes('node') || message.includes('node')) return 'Node.js Backend';
    if (repo.includes('portfolio')) return 'Portfolio Website';
    if (repo.includes('api') || message.includes('api')) return 'API Development';
    if (repo.includes('mobile') || message.includes('mobile')) return 'Mobile Application';
    if (repo.includes('web') || message.includes('web')) return 'Web Application';
    if (repo.includes('bot') || message.includes('bot')) return 'Bot Development';
    if (repo.includes('script') || message.includes('script')) return 'Automation Script';
    
    return 'Software Project';
  }

  private getProjectStatus(commitMessage: string): { text: string; color: string } {
    const message = commitMessage.toLowerCase();

    if (message.includes('fix') || message.includes('bug')) {
      return { text: 'Bug Fixing', color: '#f39c12' };
    }
    if (message.includes('feature') || message.includes('add')) {
      return { text: 'Adding Features', color: '#27ae60' };
    }
    if (message.includes('update') || message.includes('improve')) {
      return { text: 'Improving', color: '#3498db' };
    }
    if (message.includes('refactor') || message.includes('clean')) {
      return { text: 'Refactoring', color: '#9b59b6' };
    }
    if (message.includes('initial') || message.includes('start')) {
      return { text: 'Starting', color: '#e74c3c' };
    }
    if (message.includes('deploy') || message.includes('release')) {
      return { text: 'Deploying', color: '#1abc9c' };
    }

    return { text: 'In Development', color: '#34495e' };
  }

  private getProjectDescription(repoName: string, commitMessage: string): string {
    const repo = repoName.toLowerCase();
    
    if (repo.includes('portfolio')) {
      return 'Building and enhancing my professional portfolio website';
    }
    if (repo.includes('angular')) {
      return 'Developing a modern Angular application with latest features';
    }
    if (repo.includes('api')) {
      return 'Creating robust backend APIs and services';
    }
    if (repo.includes('mobile')) {
      return 'Building cross-platform mobile applications';
    }
    
    return `Working on ${this.formatProjectName(repoName)} - ${commitMessage.split('\n')[0]}`;
  }

  private formatProjectName(repoName: string): string {
    return repoName
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  private formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  }

  openGitHubRepo() {
    if (this.currentProject?.repositoryUrl) {
      window.open(this.currentProject.repositoryUrl, '_blank');
    }
  }

  viewFullActivity() {
    // Navigate to GitHub activity page
    window.location.href = '/github-activity';
  }
}
