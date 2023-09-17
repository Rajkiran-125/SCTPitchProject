import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotMenuUsageComponent } from './bot-menu-usage.component';

describe('BotMenuUsageComponent', () => {
  let component: BotMenuUsageComponent;
  let fixture: ComponentFixture<BotMenuUsageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BotMenuUsageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BotMenuUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
