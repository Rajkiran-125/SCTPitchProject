import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchFilterComponent } from './pitch-filter.component';

describe('PitchFilterComponent', () => {
  let component: PitchFilterComponent;
  let fixture: ComponentFixture<PitchFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PitchFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PitchFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
