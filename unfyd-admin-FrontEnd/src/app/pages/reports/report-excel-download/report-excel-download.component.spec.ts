import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportExcelDownloadComponent } from './report-excel-download.component';

describe('ReportExcelDownloadComponent', () => {
  let component: ReportExcelDownloadComponent;
  let fixture: ComponentFixture<ReportExcelDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportExcelDownloadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportExcelDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
