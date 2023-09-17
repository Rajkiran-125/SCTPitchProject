import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookMessengerMediaComponent } from './facebook-messenger-media.component';

describe('FacebookMessengerMediaComponent', () => {
  let component: FacebookMessengerMediaComponent;
  let fixture: ComponentFixture<FacebookMessengerMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacebookMessengerMediaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookMessengerMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
