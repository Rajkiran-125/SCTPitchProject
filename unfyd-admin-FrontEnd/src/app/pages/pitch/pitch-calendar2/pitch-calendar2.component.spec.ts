import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchCalendar2Component } from './pitch-calendar2.component';

describe('PitchCalendar2Component', () => {
  let component: PitchCalendar2Component;
  let fixture: ComponentFixture<PitchCalendar2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PitchCalendar2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PitchCalendar2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
