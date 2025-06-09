import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { InViewAnimationDirective } from './in-view-animation.directive';
import { AnimationBuilder } from '@angular/animations';

describe('InViewAnimationDirective', () => {
  let directive: InViewAnimationDirective;
  let elementRef: ElementRef;
  let animationBuilder: AnimationBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnimationBuilder]
    });
    elementRef = new ElementRef(document.createElement('div'));
    animationBuilder = TestBed.inject(AnimationBuilder);
    directive = new InViewAnimationDirective(elementRef, animationBuilder);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});