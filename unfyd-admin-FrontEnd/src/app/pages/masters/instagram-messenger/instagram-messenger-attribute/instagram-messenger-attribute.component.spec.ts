import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramMessengerAttributeComponent } from './instagram-messenger-attribute.component';

describe('InstagramMessengerAttributeComponent', () => {
  let component: InstagramMessengerAttributeComponent;
  let fixture: ComponentFixture<InstagramMessengerAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstagramMessengerAttributeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstagramMessengerAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
