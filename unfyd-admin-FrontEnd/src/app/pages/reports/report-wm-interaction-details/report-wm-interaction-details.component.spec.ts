import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportWmInteractionDetailsComponent } from './report-wm-interaction-details.component';

describe('ReportWmInteractionDetailsComponent', () => {
  let component: ReportWmInteractionDetailsComponent;
  let fixture: ComponentFixture<ReportWmInteractionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportWmInteractionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportWmInteractionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
