import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTrainingComponent } from './dashboard-training.component';

describe('DashboardTrainingComponent', () => {
  let component: DashboardTrainingComponent;
  let fixture: ComponentFixture<DashboardTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardTrainingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
