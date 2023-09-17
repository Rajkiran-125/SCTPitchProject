import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HsmPerformanceComponent } from './hsm-performance.component';

describe('HsmPerformanceComponent', () => {
  let component: HsmPerformanceComponent;
  let fixture: ComponentFixture<HsmPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HsmPerformanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HsmPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
