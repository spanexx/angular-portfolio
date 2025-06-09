import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portfolio-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio-header.component.html',
  styleUrl: './portfolio-header.component.css'
})
export class PortfolioHeaderComponent implements OnInit, OnDestroy {
  displayedText = '';
  fullText = 'Portfolio < Node.js - Angular >';
  typingSpeed = 100; // milliseconds per character
  showCursor = true;
  
  private typingInterval?: number;
  private cursorInterval?: number;

  ngOnInit(): void {
    this.startTypingEffect();
    this.startCursorBlink();
  }

  ngOnDestroy(): void {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
    if (this.cursorInterval) {
      clearInterval(this.cursorInterval);
    }
  }

  // Method to get formatted HTML with styling
  get formattedText(): string {
    const text = this.displayedText;
    
    // Apply highlighting to specific parts
    return text
      .replace('Portfolio', '<span class="portfolio-text">Portfolio</span>')
      .replace('< Node.js - Angular >', '<span class="tech-stack">< Node.js - Angular ></span>');
  }

  private startTypingEffect(): void {
    let currentIndex = 0;
    
    this.typingInterval = window.setInterval(() => {
      if (currentIndex < this.fullText.length) {
        this.displayedText = this.fullText.substring(0, currentIndex + 1);
        currentIndex++;
      } else {
        // Stop typing when complete
        if (this.typingInterval) {
          clearInterval(this.typingInterval);
        }
        // Stop cursor blinking after typing is complete
        setTimeout(() => {
          this.showCursor = false;
          if (this.cursorInterval) {
            clearInterval(this.cursorInterval);
          }
        }, 2000); // Keep cursor visible for 2 seconds after typing completes
      }
    }, this.typingSpeed);
  }

  private startCursorBlink(): void {
    this.cursorInterval = window.setInterval(() => {
      this.showCursor = !this.showCursor;
    }, 500); // Blink every 500ms
  }
}
