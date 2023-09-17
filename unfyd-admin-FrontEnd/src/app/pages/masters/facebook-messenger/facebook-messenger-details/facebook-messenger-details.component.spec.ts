import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookMessengerDetailsComponent } from './facebook-messenger-details.component';

describe('FacebookMessengerDetailsComponent', () => {
  let component: FacebookMessengerDetailsComponent;
  let fixture: ComponentFixture<FacebookMessengerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacebookMessengerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookMessengerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
