import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTopPerformerByLocationComponent } from './dashboard-top-performer-by-location.component';

describe('DashboardTopPerformerByLocationComponent', () => {
  let component: DashboardTopPerformerByLocationComponent;
  let fixture: ComponentFixture<DashboardTopPerformerByLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardTopPerformerByLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTopPerformerByLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
