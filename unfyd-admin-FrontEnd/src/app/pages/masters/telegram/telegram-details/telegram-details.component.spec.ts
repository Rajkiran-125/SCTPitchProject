import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelegramDetailsComponent } from './telegram-details.component';

describe('TelegramDetailsComponent', () => {
  let component: TelegramDetailsComponent;
  let fixture: ComponentFixture<TelegramDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelegramDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TelegramDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
