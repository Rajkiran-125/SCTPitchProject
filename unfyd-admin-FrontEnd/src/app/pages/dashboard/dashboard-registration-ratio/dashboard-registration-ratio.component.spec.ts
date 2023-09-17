import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardRegistrationRatioComponent } from './dashboard-registration-ratio.component';

describe('DashboardRegistrationRatioComponent', () => {
  let component: DashboardRegistrationRatioComponent;
  let fixture: ComponentFixture<DashboardRegistrationRatioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardRegistrationRatioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardRegistrationRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
