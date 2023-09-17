import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookMessengerApiComponent } from './facebook-messenger-api.component';

describe('FacebookMessengerApiComponent', () => {
  let component: FacebookMessengerApiComponent;
  let fixture: ComponentFixture<FacebookMessengerApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacebookMessengerApiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookMessengerApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
