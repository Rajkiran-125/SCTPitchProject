import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportMedicalClearanceComponent } from './report-medical-clearance.component';

describe('ReportMedicalClearanceComponent', () => {
  let component: ReportMedicalClearanceComponent;
  let fixture: ComponentFixture<ReportMedicalClearanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportMedicalClearanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportMedicalClearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
