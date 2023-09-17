import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportInteractionDashboardComponent } from './report-interaction-dashboard.component';

describe('ReportInteractionDashboardComponent', () => {
  let component: ReportInteractionDashboardComponent;
  let fixture: ComponentFixture<ReportInteractionDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportInteractionDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportInteractionDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
