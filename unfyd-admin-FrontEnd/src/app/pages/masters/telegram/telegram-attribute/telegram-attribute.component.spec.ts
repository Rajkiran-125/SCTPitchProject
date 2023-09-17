import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelegramAttributeComponent } from './telegram-attribute.component';

describe('TelegramAttributeComponent', () => {
  let component: TelegramAttributeComponent;
  let fixture: ComponentFixture<TelegramAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelegramAttributeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TelegramAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
