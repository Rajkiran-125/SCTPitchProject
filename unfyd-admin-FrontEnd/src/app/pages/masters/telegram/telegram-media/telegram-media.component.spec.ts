import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelegramMediaComponent } from './telegram-media.component';

describe('TelegramMediaComponent', () => {
  let component: TelegramMediaComponent;
  let fixture: ComponentFixture<TelegramMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelegramMediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TelegramMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
