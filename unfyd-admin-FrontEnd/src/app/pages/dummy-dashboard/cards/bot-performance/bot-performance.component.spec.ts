import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotPerformanceComponent } from './bot-performance.component';

describe('BotPerformanceComponent', () => {
  let component: BotPerformanceComponent;
  let fixture: ComponentFixture<BotPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BotPerformanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BotPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
