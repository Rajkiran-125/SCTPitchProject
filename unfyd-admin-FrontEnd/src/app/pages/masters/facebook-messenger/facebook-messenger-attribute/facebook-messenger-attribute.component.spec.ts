import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookMessengerAttributeComponent } from './facebook-messenger-attribute.component';

describe('FacebookMessengerAttributeComponent', () => {
  let component: FacebookMessengerAttributeComponent;
  let fixture: ComponentFixture<FacebookMessengerAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacebookMessengerAttributeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookMessengerAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
