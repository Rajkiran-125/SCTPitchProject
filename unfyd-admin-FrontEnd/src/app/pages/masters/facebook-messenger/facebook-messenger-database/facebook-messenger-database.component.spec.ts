import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookMessengerDatabaseComponent } from './facebook-messenger-database.component';

describe('FacebookMessengerDatabaseComponent', () => {
  let component: FacebookMessengerDatabaseComponent;
  let fixture: ComponentFixture<FacebookMessengerDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacebookMessengerDatabaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookMessengerDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
