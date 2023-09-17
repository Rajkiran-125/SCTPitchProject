import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailRoutingComponent } from './email-routing.component';

describe('EmailRoutingComponent', () => {
  let component: EmailRoutingComponent;
  let fixture: ComponentFixture<EmailRoutingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailRoutingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
