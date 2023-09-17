import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HawkerTrainingComponent } from './hawker-training.component';

describe('HawkerTrainingComponent', () => {
  let component: HawkerTrainingComponent;
  let fixture: ComponentFixture<HawkerTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HawkerTrainingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HawkerTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
