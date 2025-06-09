import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvNavigationComponent } from './cv-navigation.component';

describe('CvNavigationComponent', () => {
  let component: CvNavigationComponent;
  let fixture: ComponentFixture<CvNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ CvNavigationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CvNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});