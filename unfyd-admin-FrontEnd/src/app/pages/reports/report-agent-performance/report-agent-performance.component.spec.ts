import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAgentPerformanceComponent } from './report-agent-performance.component';

describe('ReportTrainingComponent', () => {
  let component: ReportAgentPerformanceComponent;
  let fixture: ComponentFixture<ReportAgentPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportAgentPerformanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAgentPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
