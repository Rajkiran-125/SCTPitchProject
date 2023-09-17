import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramMessengerComponent } from './instagram-messenger.component';

describe('InstagramMessengerComponent', () => {
  let component: InstagramMessengerComponent;
  let fixture: ComponentFixture<InstagramMessengerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstagramMessengerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstagramMessengerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
