import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramMessengerDatabaseComponent } from './instagram-messenger-database.component';

describe('InstagramMessengerDatabaseComponent', () => {
  let component: InstagramMessengerDatabaseComponent;
  let fixture: ComponentFixture<InstagramMessengerDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstagramMessengerDatabaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstagramMessengerDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
