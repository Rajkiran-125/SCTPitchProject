import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookMessengerComponent } from './facebook-messenger.component';

describe('FacebookMessengerComponent', () => {
  let component: FacebookMessengerComponent;
  let fixture: ComponentFixture<FacebookMessengerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacebookMessengerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookMessengerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
