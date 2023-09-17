import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiPerformanceComponent } from './api-performance.component';

describe('ApiPerformanceComponent', () => {
  let component: ApiPerformanceComponent;
  let fixture: ComponentFixture<ApiPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiPerformanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
