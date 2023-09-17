import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelegramApiComponent } from './telegram-api.component';

describe('TelegramApiComponent', () => {
  let component: TelegramApiComponent;
  let fixture: ComponentFixture<TelegramApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelegramApiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TelegramApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
