import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { AnimationBuilder, style, animate } from '@angular/animations';

/**
 * Directive to apply entrance animations when an element is in view.
 *
 * @example
 * <div appInViewAnimation animationType="fadeIn"></div>
 */
@Directive({
  selector: '[appInViewAnimation]'
})
export class InViewAnimationDirective {

  /**
   * The type of animation to apply.
   * Possible values: 'fadeIn', 'slideUp'
   * @default 'fadeIn'
   */

  @Input() animationType: 'fadeIn' | 'slideUp' = 'fadeIn';
  private observer!: IntersectionObserver;

  constructor(
    private el: ElementRef,
    private animationBuilder: AnimationBuilder
  ) { }

  ngOnInit() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animate(this.animationType);
          this.observer.unobserve(this.el.nativeElement);
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });

    this.observer.observe(this.el.nativeElement);
  }

  animate(animationType: string) {
    let animation;
    switch (animationType) {
      case 'fadeIn':
        animation = this.fadeInAnimation();
        break;
      case 'slideUp':
        animation = this.slideUpAnimation();
        break;
      default:
        animation = this.fadeInAnimation();
    }

    const player = animation.create(this.el.nativeElement);
    player.play();
  }

  private fadeInAnimation() {
    return this.animationBuilder.build([
      style({ opacity: 0 }),
      animate('500ms ease-in', style({ opacity: 1 }))
    ]);
  }

  private slideUpAnimation() {
    return this.animationBuilder.build([
      style({ opacity: 0, transform: 'translateY(20px)' }),
      animate('500ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
    ]);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}