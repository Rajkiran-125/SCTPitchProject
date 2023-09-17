import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramMessengerDetailsComponent } from './instagram-messenger-details.component';

describe('InstagramMessengerDetailsComponent', () => {
  let component: InstagramMessengerDetailsComponent;
  let fixture: ComponentFixture<InstagramMessengerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstagramMessengerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstagramMessengerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
