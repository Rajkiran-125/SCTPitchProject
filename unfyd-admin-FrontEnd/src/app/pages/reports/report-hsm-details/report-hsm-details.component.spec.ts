import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportHsmDetailsComponent } from './report-hsm-details.component';

describe('ReportHsmDetailsComponent', () => {
  let component: ReportHsmDetailsComponent;
  let fixture: ComponentFixture<ReportHsmDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportHsmDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportHsmDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
