import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelPerformanceComponent } from './channel-performance.component';

describe('ChannelPerformanceComponent', () => {
  let component: ChannelPerformanceComponent;
  let fixture: ComponentFixture<ChannelPerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelPerformanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
