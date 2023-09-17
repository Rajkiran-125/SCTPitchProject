import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramMessengerMediaComponent } from './instagram-messenger-media.component';

describe('InstagramMessengerMediaComponent', () => {
  let component: InstagramMessengerMediaComponent;
  let fixture: ComponentFixture<InstagramMessengerMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstagramMessengerMediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstagramMessengerMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
