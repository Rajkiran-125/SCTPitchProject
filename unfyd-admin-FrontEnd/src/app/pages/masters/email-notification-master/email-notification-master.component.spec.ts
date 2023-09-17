import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailNotificationMasterComponent } from './email-notification-master.component';

describe('EmailNotificationMasterComponent', () => {
  let component: EmailNotificationMasterComponent;
  let fixture: ComponentFixture<EmailNotificationMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailNotificationMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailNotificationMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
