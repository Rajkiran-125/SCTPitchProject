import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbandonedReportComponent } from './report-abandoned.component';

describe('ReportPccComponent', () => {
  let component: AbandonedReportComponent;
  let fixture: ComponentFixture<AbandonedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbandonedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbandonedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
