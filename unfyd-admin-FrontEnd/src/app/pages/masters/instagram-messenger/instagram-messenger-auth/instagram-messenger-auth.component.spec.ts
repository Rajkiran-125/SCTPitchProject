import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramMessengerAuthComponent } from './instagram-messenger-auth.component';

describe('InstagramMessengerAuthComponent', () => {
  let component: InstagramMessengerAuthComponent;
  let fixture: ComponentFixture<InstagramMessengerAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstagramMessengerAuthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstagramMessengerAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
