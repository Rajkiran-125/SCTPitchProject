import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportInteractionDetailsComponent } from './report-interaction-details.component';

describe('ReportMedicalClearanceComponent', () => {
  let component: ReportInteractionDetailsComponent;
  let fixture: ComponentFixture<ReportInteractionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportInteractionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportInteractionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
