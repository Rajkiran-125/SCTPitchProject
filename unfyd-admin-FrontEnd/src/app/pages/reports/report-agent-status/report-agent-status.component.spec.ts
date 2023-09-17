import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAgentStatusComponent } from './report-agent-status.component';

describe('ReportOutstandingPaymentComponent', () => {
  let component: ReportAgentStatusComponent;
  let fixture: ComponentFixture<ReportAgentStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportAgentStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAgentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
