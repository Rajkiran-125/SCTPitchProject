import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchCalendarComponent } from './pitch-calendar.component';

describe('PitchCalendarComponent', () => {
  let component: PitchCalendarComponent;
  let fixture: ComponentFixture<PitchCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PitchCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PitchCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
