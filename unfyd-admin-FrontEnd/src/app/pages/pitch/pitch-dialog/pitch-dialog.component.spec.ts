import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchDialogComponent } from './pitch-dialog.component';

describe('PitchDialogComponent', () => {
  let component: PitchDialogComponent;
  let fixture: ComponentFixture<PitchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PitchDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PitchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
