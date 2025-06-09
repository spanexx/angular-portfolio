import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InViewAnimationDirective } from './in-view-animation.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AnimationBuilder, style, animate } from '@angular/animations';

@Component({
  template: `
    <div appInViewAnimation animationType="fadeIn"></div>
    <div appInViewAnimation animationType="slideUp"></div>
  `
})
class TestComponent {
}

describe('InViewAnimationDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let divElements: DebugElement[];
  let intersectionObserverMock: any;

  beforeEach(() => {
    intersectionObserverMock = {
      observe: jasmine.createSpy('observe'),
      unobserve: jasmine.createSpy('unobserve'),
      disconnect: jasmine.createSpy('disconnect')
    };

    spyOn(window, 'IntersectionObserver').and.returnValue(intersectionObserverMock);

    TestBed.configureTestingModule({
      declarations: [InViewAnimationDirective, TestComponent],
      imports: [BrowserAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    divElements = fixture.debugElement.queryAll(By.directive(InViewAnimationDirective));
  });

  it('should create two elements with the directive', () => {
    expect(divElements.length).toBe(2);
  });

  it('should apply fadeIn animation when element is in view', fakeAsync(() => {
    const element = fixture.debugElement.query(By.css('div[animationType="fadeIn"]')).nativeElement;
    const directive = divElements[0].injector.get(InViewAnimationDirective);
    const animationBuilder = TestBed.inject(AnimationBuilder);
    const buildSpy = spyOn(animationBuilder, 'build').and.callThrough();

    // Simulate the element being in view
    const entries = [{
      target: element,
      isIntersecting: true
    }] as IntersectionObserverEntry[];
    const observerCallback = (window as any).IntersectionObserver.calls.mostRecent().args[0];
    observerCallback(entries, intersectionObserverMock);
    tick(500); // Wait for the animation to complete

    expect(buildSpy).toHaveBeenCalled();
    expect(element.style.opacity).toBe('1');
  }));

  it('should apply slideUp animation when element is in view', fakeAsync(() => {
    const element = fixture.debugElement.query(By.css('div[animationType="slideUp"]')).nativeElement;
    const directive = divElements[1].injector.get(InViewAnimationDirective);
    const animationBuilder = TestBed.inject(AnimationBuilder);
    const buildSpy = spyOn(animationBuilder, 'build').and.callThrough();

    // Simulate the element being in view
    const entries = [{
      target: element,
      isIntersecting: true
    }] as IntersectionObserverEntry[];
    const observerCallback = (window as any).IntersectionObserver.calls.mostRecent().args[0];
    observerCallback(entries, intersectionObserverMock);
    tick(500); // Wait for the animation to complete

    expect(buildSpy).toHaveBeenCalled();
    expect(element.style.transform).toBe('translateY(0px)');
    expect(element.style.opacity).toBe('1');
  }));

  it('should disconnect the observer on ngOnDestroy', () => {
    fixture.destroy();
    expect(intersectionObserverMock.disconnect).toHaveBeenCalled();
  });
});