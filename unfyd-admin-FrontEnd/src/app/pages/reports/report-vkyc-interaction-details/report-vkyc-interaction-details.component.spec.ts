import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportVkycInteractionDetailsComponent } from './report-vkyc-interaction-details.component';

describe('ReportVkycInteractionDetailsComponent', () => {
  let component: ReportVkycInteractionDetailsComponent;
  let fixture: ComponentFixture<ReportVkycInteractionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportVkycInteractionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportVkycInteractionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
