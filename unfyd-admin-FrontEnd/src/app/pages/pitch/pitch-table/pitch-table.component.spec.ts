import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchTableComponent } from './pitch-table.component';

describe('PitchTableComponent', () => {
  let component: PitchTableComponent;
  let fixture: ComponentFixture<PitchTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PitchTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PitchTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
