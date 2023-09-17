import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportBotComponent } from './report-bot.component';

describe('ReportBotComponent', () => {
  let component: ReportBotComponent;
  let fixture: ComponentFixture<ReportBotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportBotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
