import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelegramAuthComponent } from './telegram-auth.component';

describe('TelegramAuthComponent', () => {
  let component: TelegramAuthComponent;
  let fixture: ComponentFixture<TelegramAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelegramAuthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TelegramAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
