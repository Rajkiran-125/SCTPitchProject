import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAgentUtilizationComponent } from './report-agent-utilization.component';

describe('ReportAgentUtilizationComponent', () => {
  let component: ReportAgentUtilizationComponent;
  let fixture: ComponentFixture<ReportAgentUtilizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportAgentUtilizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAgentUtilizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
