import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaPerformanceComponent } from './sla-performance.component';

describe('SlaPerformanceComponent', () => {
  let component: SlaPerformanceComponent;
  let fixture: ComponentFixture<SlaPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlaPerformanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
