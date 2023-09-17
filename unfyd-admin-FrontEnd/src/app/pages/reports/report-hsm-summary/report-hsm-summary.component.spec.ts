import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportHsmSummaryComponent } from './report-hsm-summary.component';

describe('ReportHsmSummaryComponent', () => {
  let component: ReportHsmSummaryComponent;
  let fixture: ComponentFixture<ReportHsmSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportHsmSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportHsmSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
