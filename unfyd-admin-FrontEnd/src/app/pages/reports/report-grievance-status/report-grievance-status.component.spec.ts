import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportGrievanceStatusComponent } from './report-grievance-status.component';

describe('ReportGrievanceStatusComponent', () => {
  let component: ReportGrievanceStatusComponent;
  let fixture: ComponentFixture<ReportGrievanceStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportGrievanceStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportGrievanceStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
