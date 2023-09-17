import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportMisSummaryComponent } from './report-mis-summary.component';

describe('ReportMisSummaryComponent', () => {
  let component: ReportMisSummaryComponent;
  let fixture: ComponentFixture<ReportMisSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportMisSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportMisSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
