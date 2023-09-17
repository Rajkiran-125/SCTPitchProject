import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardHawkerApplicationComponent } from './dashboard-hawker-application.component';

describe('DashboardHawkerApplicationComponent', () => {
  let component: DashboardHawkerApplicationComponent;
  let fixture: ComponentFixture<DashboardHawkerApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardHawkerApplicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardHawkerApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
