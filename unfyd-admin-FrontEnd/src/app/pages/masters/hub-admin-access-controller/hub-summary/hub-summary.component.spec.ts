import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HubSummaryComponent } from './hub-summary.component';

describe('HubSummaryComponent', () => {
  let component: HubSummaryComponent;
  let fixture: ComponentFixture<HubSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HubSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HubSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
