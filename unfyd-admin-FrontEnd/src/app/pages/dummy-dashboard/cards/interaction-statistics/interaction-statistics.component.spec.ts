import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionStatisticsComponent } from './interaction-statistics.component';

describe('InteractionStatisticsComponent', () => {
  let component: InteractionStatisticsComponent;
  let fixture: ComponentFixture<InteractionStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteractionStatisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractionStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
