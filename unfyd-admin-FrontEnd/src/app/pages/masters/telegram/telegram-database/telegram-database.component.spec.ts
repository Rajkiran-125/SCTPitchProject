import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelegramDatabaseComponent } from './telegram-database.component';

describe('TelegramDatabaseComponent', () => {
  let component: TelegramDatabaseComponent;
  let fixture: ComponentFixture<TelegramDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelegramDatabaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TelegramDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
