import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HubModSummaryComponent } from './hub-mod-summary.component';

describe('HubModSummaryComponent', () => {
  let component: HubModSummaryComponent;
  let fixture: ComponentFixture<HubModSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HubModSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HubModSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
