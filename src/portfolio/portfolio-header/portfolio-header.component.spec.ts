import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioHeaderComponent } from './portfolio-header.component';

describe('PortfolioHeaderComponent', () => {
  let component: PortfolioHeaderComponent;
  let fixture: ComponentFixture<PortfolioHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PortfolioHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});