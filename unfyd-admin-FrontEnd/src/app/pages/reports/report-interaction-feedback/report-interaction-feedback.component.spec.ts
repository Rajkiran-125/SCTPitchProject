import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportInteractionFeedbackComponent } from './report-interaction-feedback.component';

describe('ReportInteractionFeedbackComponent', () => {
  let component: ReportInteractionFeedbackComponent;
  let fixture: ComponentFixture<ReportInteractionFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportInteractionFeedbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportInteractionFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
