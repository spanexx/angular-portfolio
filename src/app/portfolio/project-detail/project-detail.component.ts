import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project, ProjectVideo, ProjectImage } from '../../shared/models';
import { MockDataService } from '../../core/services/mock-data.service';
import { ProjectService } from '../../core/services/project.service';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css'
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  projectId: string | null = null;
  project: Project | undefined;
  isLoading = false;
  error: string | null = null;
  
  private subscription = new Subscription();
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private mockDataService = inject(MockDataService);
  private projectService = inject(ProjectService);
  private sanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    if (this.projectId) {
      this.loadProject(this.projectId);
    } else {
      this.router.navigate(['/portfolio']);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadProject(id: string): void {
    this.isLoading = true;
    this.error = null;
    
    // Unsubscribe from any previous request
    this.subscription.unsubscribe();
    this.subscription = new Subscription();
    
    this.subscription.add(
      this.projectService.getProjectById(id).subscribe({
        next: (project) => {
          if (project) {
            this.project = project;
            this.isLoading = false;
            this.error = null;
          } else {
            // Project not found, try mock data
            this.tryFallbackToMockData(id);
          }
        },
        error: (error) => {
          console.warn('API request failed, attempting fallback to mock data:', error);
          this.tryFallbackToMockData(id);
        }
      })
    );
  }

  private tryFallbackToMockData(id: string): void {
    try {
      const mockProject = this.mockDataService.getProjectById(id);
      if (mockProject) {
        this.project = mockProject;
        this.isLoading = false;
        this.error = null;
        console.info('Successfully loaded project from mock data');
      } else {
        this.handleProjectNotFound();
      }
    } catch (fallbackError) {
      console.error('Failed to load from mock data:', fallbackError);
      this.handleProjectNotFound();
    }
  }

  private handleProjectNotFound(): void {
    this.isLoading = false;
    this.error = 'Project not found. The project may have been moved or removed.';
    // Don't navigate immediately, let user see the error and decide
  }

  retryLoading(): void {
    if (this.projectId) {
      this.loadProject(this.projectId);
    }
  }

  navigateToPortfolio(): void {
    this.router.navigate(['/portfolio']);
  }

  goBack(): void {
    this.location.back();
  }

  goToPortfolio(): void {
    this.router.navigate(['/portfolio']);
  }

  openExternalLink(url: string): void {
    window.open(url, '_blank');
  }
  // YouTube video methods
  getYouTubeEmbedUrl(videoUrl: string): SafeResourceUrl {
    let videoId = '';
    
    try {
      // Extract video ID from various YouTube URL formats
      if (videoUrl.includes('youtube.com/watch?v=')) {
        videoId = videoUrl.split('v=')[1].split('&')[0];
      } else if (videoUrl.includes('youtu.be/')) {
        videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
      } else if (videoUrl.includes('youtube.com/embed/')) {
        videoId = videoUrl.split('embed/')[1].split('?')[0];
      } else if (videoUrl.match(/^[a-zA-Z0-9_-]{11}$/)) {
        // Assume it's already a video ID
        videoId = videoUrl;
      } else {
        console.warn('Invalid YouTube URL format:', videoUrl);
        return this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
      }
      
      const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&origin=${window.location.origin}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    } catch (error) {
      console.error('Error processing YouTube URL:', error);
      return this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
    }
  }

  getVideoTypeDisplay(type?: string): string {
    const typeMap: { [key: string]: string } = {
      'demo': 'Demo',
      'tutorial': 'Tutorial',
      'overview': 'Overview',
      'feature': 'Feature Demo'
    };
    return type ? (typeMap[type] || type) : 'Video';
  }

  // Image methods
  openImageModal(image: ProjectImage): void {
    // For now, open in new tab. You can implement a modal later
    window.open(image.url, '_blank');
  }

  getImageTypeDisplay(type?: string): string {
    const typeMap: { [key: string]: string } = {
      'screenshot': 'Screenshot',
      'diagram': 'Diagram',
      'architecture': 'Architecture',
      'ui': 'User Interface',
      'result': 'Result'
    };
    return type ? (typeMap[type] || type) : 'Image';
  }
}
