import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingMastersComponent } from './training-masters.component';

describe('TrainingMastersComponent', () => {
  let component: TrainingMastersComponent;
  let fixture: ComponentFixture<TrainingMastersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingMastersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
