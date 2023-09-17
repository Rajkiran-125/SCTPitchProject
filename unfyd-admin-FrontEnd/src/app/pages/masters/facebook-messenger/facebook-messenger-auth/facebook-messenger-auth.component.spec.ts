import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookMessengerAuthComponent } from './facebook-messenger-auth.component';

describe('FacebookMessengerAuthComponent', () => {
  let component: FacebookMessengerAuthComponent;
  let fixture: ComponentFixture<FacebookMessengerAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacebookMessengerAuthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookMessengerAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
