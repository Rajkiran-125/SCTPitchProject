import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardOverallCollectionComponent } from './dashboard-overall-collection.component';

describe('DashboardOverallCollectionComponent', () => {
  let component: DashboardOverallCollectionComponent;
  let fixture: ComponentFixture<DashboardOverallCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardOverallCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardOverallCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
