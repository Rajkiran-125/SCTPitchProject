import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardGrievanceComponent } from './dashboard-grievance.component';

describe('DashboardGrievanceComponent', () => {
  let component: DashboardGrievanceComponent;
  let fixture: ComponentFixture<DashboardGrievanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardGrievanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardGrievanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
