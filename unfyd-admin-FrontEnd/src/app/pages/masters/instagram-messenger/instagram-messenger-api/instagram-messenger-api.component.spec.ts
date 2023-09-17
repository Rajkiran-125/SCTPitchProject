import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramMessengerApiComponent } from './instagram-messenger-api.component';

describe('InstagramMessengerApiComponent', () => {
  let component: InstagramMessengerApiComponent;
  let fixture: ComponentFixture<InstagramMessengerApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstagramMessengerApiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstagramMessengerApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
