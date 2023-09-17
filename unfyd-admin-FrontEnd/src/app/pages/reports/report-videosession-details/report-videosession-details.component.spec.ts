import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportVideosessionDetailsComponent } from './report-videosession-details.component';

describe('ReportVideosessionDetailsComponent', () => {
  let component: ReportVideosessionDetailsComponent;
  let fixture: ComponentFixture<ReportVideosessionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportVideosessionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportVideosessionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
