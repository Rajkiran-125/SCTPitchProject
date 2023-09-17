import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchTileCardComponent } from './pitch-tile-card.component';

describe('PitchTileCardComponent', () => {
  let component: PitchTileCardComponent;
  let fixture: ComponentFixture<PitchTileCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PitchTileCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PitchTileCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
