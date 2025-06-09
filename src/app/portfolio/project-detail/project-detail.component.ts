import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project, ProjectVideo, ProjectImage } from '../../shared/models';
import { MockDataService } from '../../core/services/mock-data.service';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css'
})
export class ProjectDetailComponent implements OnInit {
  projectId: string | null = null;
  project: Project | undefined;
  private route = inject(ActivatedRoute);
  private router = inject(Router);  private location = inject(Location);
  private mockDataService = inject(MockDataService);
  private sanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    if (this.projectId) {
      this.project = this.mockDataService.getProjectById(this.projectId);
      if (!this.project) {
        // Project not found, redirect to portfolio
        this.router.navigate(['/portfolio']);
      }
    }
  }

  goBack(): void {
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

  onVideoError(event: any): void {
    console.warn('Video failed to load:', event);
    const iframe = event.target;
    const wrapper = iframe.parentElement;
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'video-error';
    errorDiv.innerHTML = `
      <i class="fas fa-exclamation-triangle"></i>
      <span>Video temporarily unavailable</span>
    `;
    
    // Replace iframe with error message
    wrapper.innerHTML = '';
    wrapper.appendChild(errorDiv);
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
  onImageError(event: any): void {
    // Handle image loading errors
    const img = event.target;
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDA0MDQwIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzgwODA4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPg==';
    img.alt = 'Image not available';
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
