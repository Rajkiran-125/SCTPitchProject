import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportVendorRegistrationComponent } from './report-vendor-registration.component';

describe('ReportVendorRegistrationComponent', () => {
  let component: ReportVendorRegistrationComponent;
  let fixture: ComponentFixture<ReportVendorRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportVendorRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportVendorRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
