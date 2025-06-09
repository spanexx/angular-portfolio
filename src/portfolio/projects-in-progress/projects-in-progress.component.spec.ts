import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsInProgressComponent } from './projects-in-progress.component';

describe('ProjectsInProgressComponent', () => {
  let component: ProjectsInProgressComponent;
  let fixture: ComponentFixture<ProjectsInProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ProjectsInProgressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});