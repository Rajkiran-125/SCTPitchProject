import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HawkerGrievancesComponent } from './hawker-grievances.component';

describe('HawkerGrievancesComponent', () => {
  let component: HawkerGrievancesComponent;
  let fixture: ComponentFixture<HawkerGrievancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HawkerGrievancesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HawkerGrievancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
