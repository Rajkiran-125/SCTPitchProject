import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotFeedbackComponent } from './bot-feedback.component';

describe('BotFeedbackComponent', () => {
  let component: BotFeedbackComponent;
  let fixture: ComponentFixture<BotFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BotFeedbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BotFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
