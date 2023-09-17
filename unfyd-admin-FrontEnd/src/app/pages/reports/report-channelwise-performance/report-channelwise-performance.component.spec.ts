import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportChannelwisePerformanceComponent } from './report-channelwise-performance.component';

describe('ReportChannelwisePerformanceComponent', () => {
  let component: ReportChannelwisePerformanceComponent;
  let fixture: ComponentFixture<ReportChannelwisePerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportChannelwisePerformanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportChannelwisePerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
