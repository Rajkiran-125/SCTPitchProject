import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailCardsComponent } from './email-cards.component';

describe('EmailCardsComponent', () => {
  let component: EmailCardsComponent;
  let fixture: ComponentFixture<EmailCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
