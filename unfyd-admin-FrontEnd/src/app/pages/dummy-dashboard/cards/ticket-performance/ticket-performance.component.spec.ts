import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketPerformanceComponent } from './ticket-performance.component';

describe('TicketPerformanceComponent', () => {
  let component: TicketPerformanceComponent;
  let fixture: ComponentFixture<TicketPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketPerformanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
