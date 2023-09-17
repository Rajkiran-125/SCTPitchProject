import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTopPerformerComponent } from './dashboard-top-performer.component';

describe('DashboardTopPerformerComponent', () => {
  let component: DashboardTopPerformerComponent;
  let fixture: ComponentFixture<DashboardTopPerformerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardTopPerformerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTopPerformerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
