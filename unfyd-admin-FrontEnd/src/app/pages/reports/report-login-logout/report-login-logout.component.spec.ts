import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportLoginLogoutComponent } from './report-login-logout.component';

describe('ReportVendorRegistrationComponent', () => {
  let component: ReportLoginLogoutComponent;
  let fixture: ComponentFixture<ReportLoginLogoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportLoginLogoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportLoginLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
