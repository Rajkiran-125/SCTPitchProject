import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportBatchWiseStatusComponent } from './report-batch-wise-status.component';

describe('ReportBatchWiseStatusComponent', () => {
  let component: ReportBatchWiseStatusComponent;
  let fixture: ComponentFixture<ReportBatchWiseStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportBatchWiseStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportBatchWiseStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
