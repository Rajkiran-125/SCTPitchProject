import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullDatePickerComponent } from './full-date-picker.component';

describe('FullDatePickerComponent', () => {
  let component: FullDatePickerComponent;
  let fixture: ComponentFixture<FullDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullDatePickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
